import fs from 'fs';
import path from 'path';

export interface WeddingOrder {
  orderId: string;
  email: string;
  plan: 'grand' | 'trio' | 'single';
  selectedTheme: string;
  proportions: {
    groomHeight: number;
    groomWeight: number;
    brideHeight: number;
    brideWeight: number;
  };
  clientImages: string[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  currentStep: number;
  totalSteps: number;
  completedScenes: Record<string, string>; // sceneId -> base64 or url
  zipUrl?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

// Memory cache fallback for serverless environment where filesystem may be ephemeral
const MEMORY_ORDER_CACHE: Record<string, WeddingOrder> = {};

function getStoreFilePath(): string {
  // Use /tmp in production serverless or local data dir
  const dir = process.env.NODE_ENV === 'production' ? '/tmp' : path.join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (e) {}
  }
  return path.join(dir, 'wedding_orders.json');
}

function loadOrdersFromFile(): Record<string, WeddingOrder> {
  try {
    const filePath = getStoreFilePath();
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('[WeddingOrderStore] Read error:', e);
  }
  return {};
}

function saveOrdersToFile(orders: Record<string, WeddingOrder>): void {
  try {
    const filePath = getStoreFilePath();
    fs.writeFileSync(filePath, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (e) {
    console.warn('[WeddingOrderStore] Write error:', e);
  }
}

export function createWeddingOrder(params: {
  email: string;
  plan?: 'grand' | 'trio' | 'single';
  selectedTheme?: string;
  proportions?: { groomHeight: number; groomWeight: number; brideHeight: number; brideWeight: number };
  clientImages?: string[];
}): WeddingOrder {
  const now = new Date().toISOString();
  const orderId = `WH_${Date.now().toString(36).toUpperCase()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  const order: WeddingOrder = {
    orderId,
    email: params.email.trim().toLowerCase(),
    plan: params.plan || 'grand',
    selectedTheme: params.selectedTheme || 'theme_01_bali',
    proportions: params.proportions || {
      groomHeight: 181,
      groomWeight: 74,
      brideHeight: 167,
      brideWeight: 49,
    },
    clientImages: params.clientImages || [],
    status: 'pending',
    currentStep: 0,
    totalSteps: 240,
    completedScenes: {},
    createdAt: now,
    updatedAt: now,
  };

  MEMORY_ORDER_CACHE[orderId] = order;

  const diskOrders = loadOrdersFromFile();
  diskOrders[orderId] = order;
  saveOrdersToFile(diskOrders);

  return order;
}

export function getWeddingOrder(orderId: string): WeddingOrder | null {
  if (MEMORY_ORDER_CACHE[orderId]) {
    return MEMORY_ORDER_CACHE[orderId];
  }
  const diskOrders = loadOrdersFromFile();
  if (diskOrders[orderId]) {
    MEMORY_ORDER_CACHE[orderId] = diskOrders[orderId];
    return diskOrders[orderId];
  }
  return null;
}

export function updateWeddingOrder(
  orderId: string,
  updates: Partial<WeddingOrder>
): WeddingOrder | null {
  const order = getWeddingOrder(orderId);
  if (!order) return null;

  const updated: WeddingOrder = {
    ...order,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  MEMORY_ORDER_CACHE[orderId] = updated;

  const diskOrders = loadOrdersFromFile();
  diskOrders[orderId] = updated;
  saveOrdersToFile(diskOrders);

  return updated;
}

export function findOrderByEmail(email: string): WeddingOrder | null {
  const cleanEmail = email.trim().toLowerCase();
  for (const ord of Object.values(MEMORY_ORDER_CACHE)) {
    if (ord.email === cleanEmail) return ord;
  }
  const diskOrders = loadOrdersFromFile();
  for (const ord of Object.values(diskOrders)) {
    if (ord.email === cleanEmail) {
      MEMORY_ORDER_CACHE[ord.orderId] = ord;
      return ord;
    }
  }
  return null;
}
