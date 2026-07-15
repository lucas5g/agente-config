import Link from 'next/link';
import { ButtonLink } from '@/components/button';
import { DeleteButton } from '@/components/delete-button';
import { prisma } from '@/lib/prisma';

export default async function AgentsPage() {
  const agents = await prisma.agent.findMany({ orderBy: { updatedAt: 'desc' }, include: { tools: true } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Agentes</h1>
        <ButtonLink href="/agents/new">Novo agente</ButtonLink>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {agents.map(agent => (
          <article key={agent.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h2 className="text-xl font-semibold">{agent.name}</h2>
            <p className="mt-2 text-sm text-slate-400">{agent.description || 'Sem descricao'}</p>
            <p className="mt-4 text-xs text-slate-500">{agent.tools.length} tool(s) associada(s)</p>
            <div className="mt-5 flex gap-3 text-sm">
              <Link className="text-cyan-300 hover:text-cyan-200" href={`/chat/${agent.id}`}>Chat</Link>
              <Link className="text-slate-300 hover:text-white" href={`/agents/${agent.id}/edit`}>Editar</Link>
              <DeleteButton endpoint={`/api/agents/${agent.id}`} label={agent.name} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
