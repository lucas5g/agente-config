import { notFound } from 'next/navigation';
import { ChatPanel } from '@/components/chat-panel';
import { prisma } from '@/lib/prisma';

type Params = { params: Promise<{ agentId: string }> };

export default async function ChatPage({ params }: Params) {
  const { agentId } = await params;
  const agent = await prisma.agent.findUnique({ where: { id: agentId } });
  if (!agent) notFound();

  const conversation = await prisma.conversation.findFirst({
    where: { agentId },
    orderBy: { updatedAt: 'desc' },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  });

  const initialMessages =
    conversation?.messages.map(message => ({
      id: message.id,
      role: message.role as 'user' | 'assistant' | 'system',
      parts: message.partsJson ? JSON.parse(message.partsJson) : [{ type: 'text', text: message.content }],
    })) ?? [];

  return <ChatPanel agent={agent} conversationId={conversation?.id} initialMessages={initialMessages} />;
}
