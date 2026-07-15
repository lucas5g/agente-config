import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const agentId = searchParams.get('agentId');

  const conversations = await prisma.conversation.findMany({
    where: agentId ? { agentId } : undefined,
    orderBy: { updatedAt: 'desc' },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  });

  return NextResponse.json(conversations);
}

export async function POST(req: Request) {
  const { agentId } = (await req.json()) as { agentId?: string };
  if (!agentId) return NextResponse.json({ error: 'agentId obrigatorio' }, { status: 400 });

  const conversation = await prisma.conversation.create({ data: { agentId } });
  return NextResponse.json(conversation, { status: 201 });
}
