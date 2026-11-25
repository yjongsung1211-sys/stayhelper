'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import productsData from '@/data/beautyhelper_products.json';

interface PriceEntry {
  retailer: string;
  usd: number;
  url: string;
}

interface BeautyProduct {
  id: string;
  brand: string;
  name: string;
  shade: string;
  category: string;
  season: string;
  subtone: string;
  swatchHex: string;
  whyItFits: string;
  prices: PriceEntry[];
}

const PRODUCTS: BeautyProduct[] = productsData as BeautyProduct[];
const SEASONS = ['All', 'Spring Warm', 'Summer Cool', 'Autumn Warm', 'Winter Cool'] as const;

export default function BeautyHelperPage() {
  const [selectedSeason, setSelectedSeason] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [query, setQuery] = useState<string>('');

  // Dynamic DB aggregation (Zero phantom counts)
  const categories = useMemo(() => {
    const set = new Set<string>(PRODUCTS.map((p) => p.category));
    return ['All', ...Array.from(set)];
  }, []);

  const seasonCounts = useMemo(() => {
    const map: Record<string, number> = { All: PRODUCTS.length };
    for (const p of PRODUCTS) {
      map[p.season] = (map[p.season] || 0) + 1;
    }
    return map;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      if (selectedSeason !== 'All' && p.season !== selectedSeason) return false;
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (
        q &&
        !`${p.brand} ${p.name} ${p.shade} ${p.subtone} ${p.category}`.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [selectedSeason, selectedCategory, query]);

  return (
    <div className="min-h-screen bg-white text-neutral-950 selection:bg-neutral-900 selection:text-white">
      {/* Top Minimal Header */}
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold tracking-tight text-neutral-950">
              BEAUTYHELPER
            </span>
            <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-[11px] font-medium text-neutral-600">
              100% Free Forever &middot; K-Beauty Shade &amp; Price Tracker
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/colorhelper"
              className="rounded-full border border-neutral-900 bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-neutral-800"
            >
              Free 12-Season Color Test &rarr;
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section (Clean White-Black Minimal) */}
      <section className="border-b border-neutral-100 bg-neutral-50/60">
        <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            SEOUL PERSONAL COLOR &times; GLOBAL LOWEST PRICE
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-neutral-950 md:text-5xl md:leading-[1.12]">
            Match your exact K-Beauty shade and buy at the lowest US price.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base">
            Stop guessing Korean lip tint and cushion shades online. Filter{' '}
            <strong className="font-semibold text-neutral-900">{PRODUCTS.length} verified Seoul bestsellers</strong>{' '}
            by your 12-season undertone and compare live prices across Olive Young Global, YesStyle, and Amazon US side by side.
          </p>

          {/* Season Filter Bar */}
          <div className="mt-8 flex flex-wrap items-center gap-2">
            {SEASONS.map((season) => {
              const active = selectedSeason === season;
              return (
                <button
                  key={season}
                  onClick={() => setSelectedSeason(season)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                    active
                      ? 'bg-neutral-950 text-white shadow-xs'
                      : 'border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                  }`}
                >
                  {season}{' '}
                  <span className={active ? 'text-neutral-300' : 'text-neutral-400'}>
                    ({seasonCounts[season] || 0})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Secondary Category + Search */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-neutral-200 text-neutral-950 font-semibold'
                      : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search brand, shade, or subtone (e.g. Bare Grape, Clio)..."
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none sm:w-80"
            />
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <main className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-xs font-medium text-neutral-500">
            Showing <strong className="text-neutral-950">{filtered.length}</strong> of {PRODUCTS.length} curated items
          </p>
          <span className="text-[11px] text-neutral-400">
            Prices shown in USD &middot; Lowest retailer highlighted automatically
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const sortedPrices = [...item.prices].sort((a, b) => a.usd - b.usd);
            const lowest = sortedPrices[0];
            const highest = sortedPrices[sortedPrices.length - 1];
            const savingsPct =
              highest.usd > 0 ? Math.round(((highest.usd - lowest.usd) / highest.usd) * 100) : 0;

            return (
              <article
                key={item.id}
                className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-400 hover:shadow-sm"
              >
                <div>
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                        {item.brand} &middot; {item.category}
                      </span>
                      <h2 className="mt-1 text-base font-bold text-neutral-950">{item.name}</h2>
                      <p className="text-xs font-semibold text-neutral-700">{item.shade}</p>
                    </div>
                    <div
                      title={`Shade Swatch: ${item.shade}`}
                      className="h-11 w-11 shrink-0 rounded-full border border-neutral-200 shadow-inner"
                      style={{ backgroundColor: item.swatchHex }}
                    />
                  </div>

                  {/* Season Tags */}
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-800">
                      {item.subtone}
                    </span>
                    {savingsPct > 0 && (
                      <span className="rounded-md bg-neutral-950 px-2 py-0.5 text-[11px] font-semibold text-white">
                        Save {savingsPct}%
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-neutral-600">{item.whyItFits}</p>
                </div>

                {/* Live Price Comparison Table */}
                <div className="mt-5 space-y-2 border-t border-neutral-100 pt-4">
                  {sortedPrices.map((pr, idx) => {
                    const isBest = idx === 0;
                    return (
                      <a
                        key={pr.retailer}
                        href={pr.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs transition ${
                          isBest
                            ? 'border border-neutral-900 bg-neutral-950 text-white hover:bg-neutral-800'
                            : 'border border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-400 hover:bg-white'
                        }`}
                      >
                        <span className="font-medium">
                          {isBest && <span className="mr-1.5 text-[10px] uppercase opacity-80">BEST</span>}
                          {pr.retailer}
                        </span>
                        <span className="font-bold">${pr.usd.toFixed(2)} &rarr;</span>
                      </a>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>

        {/* Cross-Promotion Hub: Helper Family Ecosystem */}
        <section className="mt-14 border-t border-neutral-200 pt-10">
          <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                THE HELPER FAMILY ECOSYSTEM
              </p>
              <h3 className="mt-1 text-xl font-bold text-neutral-950">
                More Free &amp; Curated Tools Built for You
              </h3>
            </div>
            <p className="text-xs text-neutral-500">
              BeautyHelper is 100% free for visitors, supported by retail partner commissions.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <a
              href="https://personalcolorhelper.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-neutral-200 bg-neutral-50/70 p-5 transition hover:border-neutral-900 hover:bg-white"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                100% FREE WEB TOOL
              </span>
              <h4 className="mt-1.5 text-sm font-bold text-neutral-950 group-hover:underline">
                PersonalColorHelper &rarr;
              </h4>
              <p className="mt-1.5 text-xs leading-relaxed text-neutral-600">
                Find your exact 12-season tone with our live Warm vs Cool split-screen fabric draping tool.
              </p>
            </a>

            <a
              href="https://stylinghelper.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-neutral-200 bg-neutral-50/70 p-5 transition hover:border-neutral-900 hover:bg-white"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                US AUTHORIZED RETAILERS
              </span>
              <h4 className="mt-1.5 text-sm font-bold text-neutral-950 group-hover:underline">
                StylingHelper &rarr;
              </h4>
              <p className="mt-1.5 text-xs leading-relaxed text-neutral-600">
                Track live stock and markdowns on classic designer pieces at Nordstrom &amp; Shopbop.
              </p>
            </a>

            <a
              href="https://weddinghelper.love"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-neutral-200 bg-neutral-50/70 p-5 transition hover:border-neutral-900 hover:bg-white"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                DESTINATION PRE-WEDDING
              </span>
              <h4 className="mt-1.5 text-sm font-bold text-neutral-950 group-hover:underline">
                WeddingHelper &rarr;
              </h4>
              <p className="mt-1.5 text-xs leading-relaxed text-neutral-600">
                Preview pre-wedding portraits in Lake Como, Bali, and Paris while preserving real facial features.
              </p>
            </a>

            <a
              href="https://www.thestayhelper.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-neutral-200 bg-neutral-50/70 p-5 transition hover:border-neutral-900 hover:bg-white"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                4K LUXURY HOTEL VIP PERKS
              </span>
              <h4 className="mt-1.5 text-sm font-bold text-neutral-950 group-hover:underline">
                StayHelper &rarr;
              </h4>
              <p className="mt-1.5 text-xs leading-relaxed text-neutral-600">
                Compare complimentary room upgrades and $100–$200 VIP credits at Aman &amp; Four Seasons.
              </p>
            </a>
          </div>

          <p className="mt-6 text-center text-[11px] text-neutral-400">
            Disclosure: BeautyHelper is completely free to use with no paywalls. Some retailer links are partner/affiliate links that may earn a small commission at no extra cost to you.
          </p>
        </section>
      </main>
    </div>
  );
}
