import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BeautyHelper — Free K-Beauty 12-Season Shade & Lowest US Price Tracker',
  description:
    'Match your exact 12-season Seoul personal color to K-Beauty bestsellers and compare live prices across Olive Young Global, YesStyle, and Amazon US—100% free forever.',
};

export default function BeautyHelperLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
