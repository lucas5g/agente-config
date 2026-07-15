import { AgentForm } from '@/components/agent-form';
import { prisma } from '@/lib/prisma';

export default async function NewAgentPage() {
  const tools = await prisma.tool.findMany({ where: { enabled: true }, orderBy: { name: 'asc' } });
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Novo agente</h1>
      <AgentForm tools={tools} />
    </div>
  );
}
