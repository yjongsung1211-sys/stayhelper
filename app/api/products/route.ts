import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface ProductItem {
  id: string;
  sku: string;
  title: string;
  brand: string;
  category: string;
  gender: string;
  price: number;
  retailer: string;
  buyUrl: string;
  imageUrl: string;
  inStock: boolean;
  verifiedAt: string;
}

let cachedProducts: ProductItem[] | null = null;
let lastLoadedTime = 0;

function loadProducts(): ProductItem[] {
  const now = Date.now();
  // Cache for 10 seconds to allow live updates while scraping
  if (cachedProducts && now - lastLoadedTime < 10000) {
    return cachedProducts;
  }

  const filePath = path.join(process.cwd(), 'public', 'data', 'luxury_catalog_1000.json');
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      cachedProducts = data;
      lastLoadedTime = now;
      return cachedProducts || [];
    } catch {
      return cachedProducts || [];
    }
  }
  return [];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category')?.toLowerCase();
  const gender = searchParams.get('gender')?.toLowerCase();
  const query = searchParams.get('query')?.toLowerCase();
  const brand = searchParams.get('brand')?.toLowerCase();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '24', 10);

  let items = loadProducts();

  // Category filter
  if (category && category !== 'all') {
    items = items.filter((p) => p.category?.toLowerCase() === category);
  }

  // Gender filter
  if (gender && gender !== 'all') {
    items = items.filter(
      (p) => p.gender?.toLowerCase() === gender || p.gender?.toLowerCase() === 'unisex'
    );
  }

  // Brand filter
  if (brand) {
    items = items.filter((p) => p.brand?.toLowerCase().includes(brand));
  }

  // Keyword query
  if (query) {
    items = items.filter(
      (p) =>
        p.title?.toLowerCase().includes(query) ||
        p.brand?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query)
    );
  }

  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginated = items.slice(offset, offset + limit);

  return NextResponse.json({
    total,
    page,
    limit,
    totalPages,
    products: paginated,
  });
}
