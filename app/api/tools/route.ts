import { NextResponse } from 'next/server';
import { encryptSecret, maskSecret } from '@/lib/crypto';
import { prisma } from '@/lib/prisma';
import { toolSchema } from '@/lib/schemas';

export async function GET() {
  const tools = await prisma.tool.findMany({ orderBy: { updatedAt: 'desc' } });
  return NextResponse.json(
    tools.map(tool => ({
      ...tool,
      encryptedHeaders: undefined,
      headersMasked: maskSecret(tool.encryptedHeaders),
    })),
  );
}

export async function POST(req: Request) {
  const parsed = toolSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { headers, ...data } = parsed.data;
  const tool = await prisma.tool.create({
    data: { ...data, encryptedHeaders: encryptSecret(headers) },
  });

  return NextResponse.json({ ...tool, encryptedHeaders: undefined }, { status: 201 });
}
