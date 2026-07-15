import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { agentSchema } from '@/lib/schemas';

export async function GET() {
  const agents = await prisma.agent.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { tools: { include: { tool: true } } },
  });

  return NextResponse.json(agents);
}

export async function POST(req: Request) {
  const parsed = agentSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { toolIds, ...data } = parsed.data;
  const agent = await prisma.agent.create({
    data: {
      ...data,
      tools: { create: toolIds.map(toolId => ({ toolId })) },
    },
  });

  return NextResponse.json(agent, { status: 201 });
}
