import Link from 'next/link';
import { ButtonLink } from '@/components/button';
import { DeleteButton } from '@/components/delete-button';
import { prisma } from '@/lib/prisma';

export default async function ToolsPage() {
  const tools = await prisma.tool.findMany({ orderBy: { updatedAt: 'desc' } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tools</h1>
        <ButtonLink href="/tools/new">Nova tool</ButtonLink>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {tools.map(tool => (
          <article key={tool.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-xl font-semibold">{tool.name}</h2>
              <span className={tool.enabled ? 'text-xs text-emerald-300' : 'text-xs text-slate-500'}>{tool.enabled ? 'ativa' : 'inativa'}</span>
            </div>
            <p className="mt-2 text-sm text-slate-400">{tool.description}</p>
            <p className="mt-4 break-all rounded-lg bg-slate-950 p-2 text-xs text-slate-300">{tool.method} {tool.url}</p>
            <div className="mt-5 flex gap-3">
              <Link className="text-sm text-cyan-300 hover:text-cyan-200" href={`/tools/${tool.id}/edit`}>Editar</Link>
              <DeleteButton endpoint={`/api/tools/${tool.id}`} label={tool.name} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
