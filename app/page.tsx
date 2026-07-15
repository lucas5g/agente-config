import { ButtonLink } from '@/components/button';

export default function HomePage() {
  return (
    <div className="grid gap-8 py-10 md:grid-cols-[1.2fr_0.8fr]">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">MVP</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
          Configure agentes de IA sem alterar codigo.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-slate-300">
          Crie agentes com prompts proprios, associe tools HTTP e converse com streaming usando a Vercel AI SDK.
        </p>
        <div className="mt-8 flex gap-3">
          <ButtonLink href="/agents/new">Criar agente</ButtonLink>
          <ButtonLink href="/tools/new">Criar tool</ButtonLink>
        </div>
      </section>
      <aside className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="text-xl font-semibold">Fluxo principal</h2>
        <ol className="mt-4 space-y-3 text-sm text-slate-300">
          <li>1. Cadastre uma tool HTTP.</li>
          <li>2. Crie um agente e associe tools.</li>
          <li>3. Abra o chat do agente.</li>
          <li>4. A IA chama somente as tools autorizadas.</li>
        </ol>
      </aside>
    </div>
  );
}
