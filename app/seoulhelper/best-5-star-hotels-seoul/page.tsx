import type { Metadata } from 'next';
import Link from 'next/link';
import curatedData from '@/data/seoulhelper_curated.json';

export const metadata: Metadata = {
  title: 'Best 5-Star Hotels in Seoul 2026: Free Breakfast & $100 Credit | SeoulHelper',
  description:
    'Compare the top 5 luxury hotels in Seoul (Four Seasons, Park Hyatt, Josun Palace, Fairmont, Signiel) and unlock complimentary daily breakfast, $100 dining credit, and priority upgrades via Fora VIP at $0 advisor fee.',
  alternates: {
    canonical: 'https://personalcolorhelper.com/seoulhelper/best-5-star-hotels-seoul',
  },
  openGraph: {
    title: 'Best 5-Star Hotels in Seoul 2026 (Free Breakfast & $100 Credit)',
    description:
      'Independent comparison of Seoul’s top 5 luxury hotels with real VIP perks, same official hotel rates, and 100% Marriott/Hyatt points.',
    url: 'https://personalcolorhelper.com/seoulhelper/best-5-star-hotels-seoul',
    type: 'article',
  },
};

const FORA_VIP_INTAKE_URL = 'https://secure.foratravel.com/intake/VXwROA88te';

const FAQ_ITEMS = [
  {
    q: 'Does booking a Seoul 5-star hotel through a Fora VIP Advisor cost extra?',
    a: 'No. The advisor fee is $0. You pay the exact same official flexible rate directly to the hotel at check-in, while unlocking free daily breakfast for 2, a $100 hotel credit, and priority room upgrade.',
  },
  {
    q: 'Do I still earn Marriott Bonvoy or World of Hyatt points?',
    a: 'Yes! Because VIP partner bookings (Four Seasons Preferred, Hyatt Privé, Marriott STARS) are booked directly with the hotel chain, you earn 100% of your loyalty points and elite night credits.',
  },
  {
    q: 'Which Seoul luxury hotel is best for first-time visitors?',
    a: 'Four Seasons Hotel Seoul (Gwanghwamun) is ideal for walking to Gyeongbokgung Palace and Bukchon Hanok Village. Park Hyatt Seoul and Josun Palace are top picks for Gangnam luxury shopping and K-beauty clinics.',
  },
];

export default function BestSeoulHotelsGuidePage() {
  const hotels = curatedData.foraHotels;
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1A1A1A]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <header className="border-b border-[#E8DFD1] bg-[#FAF7F2]/95">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link href="/seoulhelper" className="text-sm font-bold tracking-tight text-[#1A1A1A]">
            &larr; SEOULHELPER
          </Link>
          <a
            href={FORA_VIP_INTAKE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#B83B2A] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#992E20]"
          >
            Unlock Free VIP Perks &rarr;
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B83B2A]">
          SEOUL LUXURY HOTEL GUIDE 2026 · $0 ADVISOR FEE
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#1A1A1A] md:text-5xl md:leading-[1.12]">
          Best 5-Star Hotels in Seoul 2026: How to Get Free Breakfast &amp; $100 Credit
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#4A4640] md:text-base">
          Most travelers book Seoul’s top 5-star hotels on standard OTAs and leave $250–$400 in complimentary perks on the table.
          Compare the 5 best luxury hotels in Seoul below—all eligible for official VIP partner perks (Four Seasons Preferred, Hyatt Privé, Marriott STARS) at the exact same hotel rate.
        </p>

        {/* Quick Comparison Table */}
        <section className="mt-10 overflow-x-auto rounded-2xl border border-[#E6DDD0] bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-[#E6DDD0] bg-[#F5EFE6] text-xs uppercase tracking-wider text-[#5C554C]">
              <tr>
                <th className="px-5 py-3.5">Hotel</th>
                <th className="px-5 py-3.5">Best Area</th>
                <th className="px-5 py-3.5">VIP Program</th>
                <th className="px-5 py-3.5">Complimentary Perks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE8DC]">
              {hotels.map((h) => (
                <tr key={h.id} className="hover:bg-[#FCF9F4]">
                  <td className="px-5 py-4 font-bold text-[#1A1A1A]">{h.nameEn}</td>
                  <td className="px-5 py-4 text-[#4A4640]">{h.areaEn}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-[#FDF1EE] px-2.5 py-1 text-xs font-semibold text-[#9A2F20]">
                      {h.program}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-[#4A4640]">{h.perksEn.join(' · ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Detailed Cards */}
        <section className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {hotels.map((h) => (
            <article key={h.id} className="overflow-hidden rounded-2xl border border-[#E6DDD0] bg-white shadow-sm">
              <div className="h-52 w-full overflow-hidden bg-neutral-100">
                <img src={h.image} alt={h.nameEn} className="h-full w-full object-cover" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#B83B2A]">{h.rank}</span>
                  <span className="rounded-full bg-[#F5EFE6] px-2.5 py-0.5 text-[11px] font-semibold text-[#5C554C]">
                    {h.program}
                  </span>
                </div>
                <h2 className="mt-2 text-xl font-bold text-[#1A1A1A]">{h.nameEn}</h2>
                <p className="mt-1 text-xs font-medium text-[#6B6359]">{h.areaEn}</p>
                <ul className="mt-4 space-y-1.5 text-xs text-[#3A3631]">
                  {h.perksEn.map((p) => (
                    <li key={p}>&#10003; {p}</li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-2">
                  <a
                    href={FORA_VIP_INTAKE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-[#1A1A1A] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#B83B2A]"
                  >
                    Request Free VIP Rate &rarr;
                  </a>
                  <Link
                    href="/seoulhelper"
                    className="rounded-full border border-[#D8CEBE] px-4 py-2 text-xs font-semibold text-[#1A1A1A] transition hover:border-[#1A1A1A]"
                  >
                    Compare Live Dates
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* FAQ */}
        <section className="mt-14 rounded-2xl border border-[#E6DDD0] bg-white p-6 md:p-8">
          <h2 className="text-2xl font-bold text-[#1A1A1A]">Frequently Asked Questions</h2>
          <div className="mt-6 space-y-5">
            {FAQ_ITEMS.map((item) => (
              <div key={item.q} className="border-b border-[#EFE8DC] pb-4 last:border-b-0 last:pb-0">
                <h3 className="text-sm font-bold text-[#1A1A1A]">{item.q}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#4A4640]">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Internal Links */}
        <div className="mt-10 flex flex-wrap gap-3 text-xs font-semibold">
          <Link href="/seoulhelper" className="rounded-full border border-[#D8CEBE] bg-white px-4 py-2 hover:border-[#1A1A1A]">
            &larr; Seoul Trip Planner &amp; Tax Refund Calculator
          </Link>
          <Link href="/seoulhelper/korea-tax-refund-guide" className="rounded-full border border-[#D8CEBE] bg-white px-4 py-2 hover:border-[#1A1A1A]">
            Korea VAT Tax Refund Guide 2026 &rarr;
          </Link>
          <Link href="/beautyhelper" className="rounded-full border border-[#D8CEBE] bg-white px-4 py-2 hover:border-[#1A1A1A]">
            K-Beauty Price Compare &rarr;
          </Link>
        </div>
      </main>
    </div>
  );
}
