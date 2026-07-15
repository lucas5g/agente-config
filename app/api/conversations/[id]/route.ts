import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  });

  if (!conversation) return NextResponse.json({ error: 'Conversa nao encontrada' }, { status: 404 });
  return NextResponse.json(conversation);
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  await prisma.conversation.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
