import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { agentSchema } from '@/lib/schemas';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const agent = await prisma.agent.findUnique({
    where: { id },
    include: { tools: { include: { tool: true } } },
  });

  if (!agent) return NextResponse.json({ error: 'Agente nao encontrado' }, { status: 404 });
  return NextResponse.json(agent);
}

export async function PUT(req: Request, { params }: Params) {
  const { id } = await params;
  const parsed = agentSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { toolIds, ...data } = parsed.data;
  const agent = await prisma.$transaction(async tx => {
    await tx.agentTool.deleteMany({ where: { agentId: id } });
    return tx.agent.update({
      where: { id },
      data: {
        ...data,
        tools: { create: toolIds.map(toolId => ({ toolId })) },
      },
    });
  });

  return NextResponse.json(agent);
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  await prisma.agent.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
