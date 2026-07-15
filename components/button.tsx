import Link from 'next/link';

export function ButtonLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
    >
      {children}
    </Link>
  );
}

export function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300">
      {children}
    </button>
  );
}
