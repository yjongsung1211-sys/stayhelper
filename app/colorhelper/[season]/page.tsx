import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { COLORHELPER_SEASONS, getSeasonGuide } from '@/lib/colorhelper-seasons';

interface PageProps {
  params: { season: string };
}

export function generateStaticParams() {
  return COLORHELPER_SEASONS.map((s) => ({ season: s.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const guide = getSeasonGuide(params.season);
  if (!guide) {
    return { title: 'Personal Color Guide | ColorHelper' };
  }

  const canonical = `https://personalcolorhelper.com/colorhelper/${guide.slug}`;

  return {
    title: guide.seoTitle,
    description: guide.seoDescription,
    alternates: { canonical },
    openGraph: {
      title: guide.seoTitle,
      description: guide.seoDescription,
      url: canonical,
      type: 'article',
      locale: 'en_US',
    },
  };
}

export default function ColorHelperSeasonPage({ params }: PageProps) {
  const guide = getSeasonGuide(params.season);
  if (!guide) {
    notFound();
  }

  const otherSeasons = COLORHELPER_SEASONS.filter((s) => s.slug !== guide.slug).slice(0, 6);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <div className="min-h-screen bg-white text-[#0F172A]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Minimal Top Bar */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link
            href="/?lang=en"
            className="text-sm font-bold tracking-tight text-[#0F172A] hover:opacity-75"
          >
            &larr; COLORHELPER
          </Link>
          <Link
            href="/?lang=en"
            className="rounded-full bg-[#0F172A] px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            Free Virtual Draping &rarr;
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-12 md:py-16">
        {/* Hero */}
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
            <span>{guide.undertone}</span>
            <span>&middot;</span>
            <span>{guide.subTones.join(' / ')}</span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#0F172A] md:text-5xl md:leading-[1.12]">
            {guide.heroHeadline}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 md:text-base">
            {guide.heroSub}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/?lang=en"
              className="rounded-full bg-[#0F172A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Try Free Virtual Draping ($0) &rarr;
            </Link>
            <a
              href="https://www.stylinghelper.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-[#0F172A] transition hover:border-[#0F172A]"
            >
              Shop Your Tone on StylingHelper &#8599;
            </a>
          </div>
        </div>

        {/* Best Palette */}
        <section className="mt-14">
          <h2 className="text-xl font-bold tracking-tight text-[#0F172A] md:text-2xl">
            Best Colors for {guide.seasonName}
          </h2>
          <p className="mt-1.5 text-sm text-slate-600">
            Shades that clarify skin tone, soften shadows, and balance your natural undertone.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {guide.bestSwatches.map((swatch) => (
              <div
                key={swatch.name}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-[#F8FAFC]"
              >
                <div
                  className="h-24 w-full border-b border-slate-200"
                  style={{ backgroundColor: swatch.hex }}
                  aria-label={`${swatch.name} color swatch`}
                />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#0F172A]">{swatch.name}</span>
                    <span className="font-mono text-xs text-slate-500">{swatch.hex}</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{swatch.note}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Worst Palette */}
        <section className="mt-14">
          <h2 className="text-xl font-bold tracking-tight text-[#0F172A] md:text-2xl">
            Colors to Avoid Near the Face
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {guide.worstSwatches.map((swatch) => (
              <div
                key={swatch.name}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-9 w-9 shrink-0 rounded-full border border-slate-200"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <div>
                    <p className="text-sm font-bold text-[#0F172A]">{swatch.name}</p>
                    <p className="font-mono text-[11px] text-slate-500">{swatch.hex}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-600">{swatch.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Makeup & Wardrobe Formula */}
        <section className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6">
            <h2 className="text-lg font-bold text-[#0F172A]">
              Best Lip Shades for {guide.seasonName}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-700">
              {guide.lipShades.map((lip) => (
                <li key={lip} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F172A]" />
                  <span>{lip}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/beautyhelper"
              className="mt-6 inline-block text-xs font-semibold text-[#0F172A] underline underline-offset-4 hover:opacity-70"
            >
              Explore Curated Lip &amp; Beauty Shades on BeautyHelper &rarr;
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6">
            <h2 className="text-lg font-bold text-[#0F172A]">Wardrobe &amp; Styling Formula</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Outerwear &amp; Neutrals
                </dt>
                <dd className="mt-0.5 text-slate-700">{guide.wardrobeTips.outerwear}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Jewelry Metals
                </dt>
                <dd className="mt-0.5 text-slate-700">{guide.wardrobeTips.metals}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Best Fabrics
                </dt>
                <dd className="mt-0.5 text-slate-700">{guide.wardrobeTips.fabrics}</dd>
              </div>
            </dl>
            <a
              href="https://www.stylinghelper.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block text-xs font-semibold text-[#0F172A] underline underline-offset-4 hover:opacity-70"
            >
              Browse Complete In-Stock Lookbooks on StylingHelper &#8599;
            </a>
          </div>
        </section>

        {/* Conversion Banner */}
        <section className="mt-14 rounded-2xl border border-[#0F172A] bg-[#0F172A] p-8 text-white">
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">
            Not 100% sure you are {guide.seasonName}?
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
            Test warm vs. cool drapes live beneath your jawline in your browser. Zero login required
            for instant virtual draping, with an optional 12-season deep report.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/?lang=en"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0F172A] transition hover:bg-slate-100"
            >
              Launch Free Virtual Draping &rarr;
            </Link>
            <a
              href="https://www.stylinghelper.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-slate-600 px-6 py-3 text-sm font-semibold text-white transition hover:border-white"
            >
              Explore StylingHelper Lookbooks &#8599;
            </a>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-14">
          <h2 className="text-xl font-bold tracking-tight text-[#0F172A]">
            Frequently Asked Questions
          </h2>
          <div className="mt-5 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {guide.faq.map((item) => (
              <div key={item.q} className="p-5">
                <h3 className="text-sm font-bold text-[#0F172A]">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Internal Links to Other Seasons */}
        <section className="mt-14 border-t border-slate-200 pt-10">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
            Compare Other Personal Color Seasons
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {otherSeasons.map((other) => (
              <Link
                key={other.slug}
                href={`/colorhelper/${other.slug}`}
                className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 transition hover:border-[#0F172A]"
              >
                <p className="text-xs font-medium text-slate-500">{other.undertone}</p>
                <p className="mt-1 text-sm font-bold text-[#0F172A]">
                  {other.seasonName} Guide &rarr;
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
