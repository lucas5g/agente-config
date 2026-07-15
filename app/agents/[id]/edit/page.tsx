import { notFound } from 'next/navigation';
import { AgentForm } from '@/components/agent-form';
import { prisma } from '@/lib/prisma';

type Params = { params: Promise<{ id: string }> };

export default async function EditAgentPage({ params }: Params) {
  const { id } = await params;
  const [agent, tools] = await Promise.all([
    prisma.agent.findUnique({ where: { id }, include: { tools: true } }),
    prisma.tool.findMany({ orderBy: { name: 'asc' } }),
  ]);

  if (!agent) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Editar agente</h1>
      <AgentForm agent={agent} tools={tools} />
    </div>
  );
}
