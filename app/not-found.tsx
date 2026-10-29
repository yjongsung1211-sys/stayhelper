import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFCFB] text-neutral-900 px-4">
      <h2 className="text-4xl font-black">404 - Page Not Found</h2>
      <p className="mt-2 text-sm text-neutral-500">The look or piece you are looking for does not exist.</p>
      <Link
        href="/"
        className="mt-6 px-6 py-3 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition"
      >
        Return Home
      </Link>
    </div>
  );
}
