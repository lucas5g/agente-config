import { NextResponse } from 'next/server';
import { encryptSecret, maskSecret } from '@/lib/crypto';
import { prisma } from '@/lib/prisma';
import { toolSchema } from '@/lib/schemas';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const tool = await prisma.tool.findUnique({ where: { id } });

  if (!tool) return NextResponse.json({ error: 'Tool nao encontrada' }, { status: 404 });
  return NextResponse.json({ ...tool, encryptedHeaders: undefined, headersMasked: maskSecret(tool.encryptedHeaders) });
}

export async function PUT(req: Request, { params }: Params) {
  const { id } = await params;
  const parsed = toolSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { headers, ...data } = parsed.data;
  const updateData = {
    ...data,
    ...(headers ? { encryptedHeaders: encryptSecret(headers) } : {}),
  };
  const tool = await prisma.tool.update({ where: { id }, data: updateData });

  return NextResponse.json({ ...tool, encryptedHeaders: undefined });
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  await prisma.tool.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
