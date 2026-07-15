import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Agente Config',
  description: 'CRUD de agentes com chat de IA configuravel',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="min-h-screen">
          <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
              <Link href="/" className="text-lg font-semibold tracking-tight">
                Agente Config
              </Link>
              <div className="flex gap-3 text-sm text-slate-300">
                <Link className="hover:text-white" href="/agents">
                  Agentes
                </Link>
                <Link className="hover:text-white" href="/tools">
                  Tools
                </Link>
              </div>
            </nav>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
