import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '240 Haute Couture Masterpiece Gallery · WeddingHelper',
  description: 'Explore all 240 ultra-high definition editorial camera angles across 12 iconic global destinations, synthesized with authentic facial contours and bespoke silhouettes.',
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
