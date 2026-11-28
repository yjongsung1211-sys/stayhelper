import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Korea VAT Tax Refund Guide 2026: Olive Young, Myeongdong & Incheon Airport | SeoulHelper',
  description:
    'Complete 2026 Korea Tax-Free shopping guide for foreign travelers: ₩15,000 minimum spend, instant in-store VAT refund at Olive Young, refund chart, and Incheon Airport kiosk steps.',
  alternates: {
    canonical: 'https://personalcolorhelper.com/seoulhelper/korea-tax-refund-guide',
  },
  openGraph: {
    title: 'Korea VAT Tax Refund Guide 2026 (Olive Young & Incheon Airport)',
    description:
      'How to get instant 6–8% VAT refunds in Seoul with your passport. Includes exact KRW refund brackets and airport tips.',
    url: 'https://personalcolorhelper.com/seoulhelper/korea-tax-refund-guide',
    type: 'article',
  },
};

const REFUND_TABLE = [
  { spend: '₩15,000 – ₩29,999', refund: '₩1,000', note: 'Minimum threshold (Olive Young, Daiso, skincare)' },
  { spend: '₩30,000 – ₩49,999', refund: '₩2,000', note: 'Instant tax deduction at register with passport' },
  { spend: '₩50,000 – ₩74,999', refund: '₩3,500', note: 'Most common K-Beauty haul bracket' },
  { spend: '₩100,000 – ₩199,999', refund: '~₩6,500 – ₩13,500', note: 'Approx. 6.8% net refund after handling fee' },
  { spend: '₩200,000 – ₩1,000,000', refund: '~₩15,000 – ₩75,000', note: 'Up to ₩1,000,000 per single instant-refund receipt' },
];

const FAQ_ITEMS = [
  {
    q: 'What is the minimum spend for Korea Tax Refund in 2026?',
    a: 'The minimum eligible purchase per receipt is ₩15,000 KRW (approx. $11 USD) at participating Tax-Free stores such as Olive Young, Musinsa, and major department stores.',
  },
  {
    q: 'Do I need my physical passport for Instant Tax Refund at Olive Young?',
    a: 'Yes! Always carry your physical passport (photos of your passport are not accepted for instant deduction). Present it at checkout before paying so the VAT is deducted immediately.',
  },
  {
    q: 'What is the limit for Instant Tax Refund in Korea?',
    a: 'Foreign tourists can receive instant tax-free deduction up to ₩1,000,000 per single transaction and up to ₩5,000,000 total per trip. Larger purchases can be refunded at Incheon Airport kiosks.',
  },
];

export default function KoreaTaxRefundGuidePage() {
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
          <Link
            href="/seoulhelper"
            className="rounded-full bg-[#1A1A1A] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#B83B2A]"
          >
            Open Live Refund Calculator &rarr;
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1F5C4E]">
          KOREA SHOPPING &amp; TAX-FREE GUIDE 2026
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#1A1A1A] md:text-5xl md:leading-[1.12]">
          Korea VAT Tax Refund Guide 2026: Olive Young, Myeongdong &amp; Incheon Airport
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#4A4640] md:text-base">
          Foreign visitors to South Korea can claim back roughly 6%–8% of their shopping spend in VAT refunds.
          Here is the exact 2026 step-by-step playbook so you never miss an instant discount at Olive Young or get stuck in airport lines.
        </p>

        {/* 3-Step Summary */}
        <section className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              step: 'STEP 01',
              title: 'Spend ₩15,000+ & Show Physical Passport',
              desc: 'Look for the "Tax Free" logo at Olive Young, Seongsu boutiques, or Myeongdong flagship stores. Show your physical passport before paying.',
            },
            {
              step: 'STEP 02',
              title: 'Instant Deduction vs Airport Receipt',
              desc: 'Instant Tax-Free stores subtract VAT on the spot (up to ₩1M per receipt). Other stores print a Tax Refund slip to scan at the airport.',
            },
            {
              step: 'STEP 03',
              title: 'Scan at Incheon Airport Kiosks (Before Check-in)',
              desc: 'If you have paper refund slips, scan your passport & receipts at the automated kiosk before luggage drop, then collect cash/card refund airside.',
            },
          ].map((s) => (
            <div key={s.step} className="rounded-2xl border border-[#E6DDD0] bg-white p-6">
              <p className="text-[11px] font-bold tracking-widest text-[#B83B2A]">{s.step}</p>
              <h2 className="mt-2 text-base font-bold text-[#1A1A1A]">{s.title}</h2>
              <p className="mt-2 text-xs leading-relaxed text-[#4A4640]">{s.desc}</p>
            </div>
          ))}
        </section>

        {/* Refund Table */}
        <section className="mt-10 overflow-x-auto rounded-2xl border border-[#E6DDD0] bg-white">
          <div className="border-b border-[#E6DDD0] bg-[#F5EFE6] px-5 py-3.5">
            <h2 className="text-sm font-bold text-[#1A1A1A]">2026 Korea VAT Tax Refund Reference Table</h2>
          </div>
          <table className="w-full min-w-[540px] text-left text-sm">
            <thead className="border-b border-[#EFE8DC] text-xs uppercase tracking-wider text-[#6B6359]">
              <tr>
                <th className="px-5 py-3">Purchase Amount (KRW)</th>
                <th className="px-5 py-3">Est. Net Refund</th>
                <th className="px-5 py-3">Traveler Tip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE8DC]">
              {REFUND_TABLE.map((row) => (
                <tr key={row.spend} className="hover:bg-[#FCF9F4]">
                  <td className="px-5 py-3.5 font-semibold text-[#1A1A1A]">{row.spend}</td>
                  <td className="px-5 py-3.5 font-bold text-[#1F5C4E]">{row.refund}</td>
                  <td className="px-5 py-3.5 text-xs text-[#4A4640]">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Interactive Calculator CTA */}
        <section className="mt-10 rounded-2xl border border-[#D8CEBE] bg-[#1A1A1A] p-6 text-white md:p-8">
          <h2 className="text-xl font-bold">Calculate Your Exact Seoul Shopping Refund Now</h2>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-neutral-300">
            Enter your KRW receipt total in our free interactive calculator—and compare Olive Young Global vs YesStyle vs Amazon US prices before you fly.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/seoulhelper"
              className="rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-[#1A1A1A] transition hover:bg-[#F5EFE6]"
            >
              Open Tax-Free Calculator &rarr;
            </Link>
            <Link
              href="/beautyhelper"
              className="rounded-full border border-neutral-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:border-white"
            >
              Compare K-Beauty Prices &rarr;
            </Link>
            <Link
              href="/seoulhelper/best-5-star-hotels-seoul"
              className="rounded-full border border-neutral-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:border-white"
            >
              Best 5-Star Hotels in Seoul &rarr;
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-12 rounded-2xl border border-[#E6DDD0] bg-white p-6 md:p-8">
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
      </main>
    </div>
  );
}
