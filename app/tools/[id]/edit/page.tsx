import { notFound } from 'next/navigation';
import { ToolForm } from '@/components/tool-form';
import { prisma } from '@/lib/prisma';

type Params = { params: Promise<{ id: string }> };

export default async function EditToolPage({ params }: Params) {
  const { id } = await params;
  const tool = await prisma.tool.findUnique({ where: { id } });
  if (!tool) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Editar tool</h1>
      <ToolForm tool={tool} />
    </div>
  );
}
