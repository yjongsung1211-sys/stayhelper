import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LoopShadow — 100% Free Korean Shadowing for Seoul Travel & K-Culture',
  description:
    'Practice real Seoul Korean phrases out loud in your browser with instant pronunciation matching. 100% free forever with zero auto-renewal traps.',
};

export default function LoopShadowLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
