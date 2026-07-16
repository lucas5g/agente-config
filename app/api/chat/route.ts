import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  type ToolSet,
  type UIMessage,
} from 'ai';
import { decryptSecret } from '@/lib/crypto';
import { executeHttpTool } from '@/lib/http-tool';
import { parseInputSchema } from '@/lib/json-schema';
import { prisma } from '@/lib/prisma';
import { chatRequestSchema } from '@/lib/schemas';

export const maxDuration = 60;

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

function getMessageContent(message: UIMessage) {
  return message.parts
    .filter(part => part.type === 'text')
    .map(part => part.text)
    .join('\n');
}

async function persistMessages(conversationId: string, messages: UIMessage[]) {
  await prisma.$transaction(async tx => {
    await tx.message.deleteMany({ where: { conversationId } });
    await tx.message.createMany({
      data: messages.map(message => ({
        conversationId,
        role: message.role,
        content: getMessageContent(message),
        partsJson: JSON.stringify(message.parts),
      })),
    });
    await tx.conversation.update({ where: { id: conversationId }, data: {} });
  });
}

export async function POST(req: Request) {
  const parsed = chatRequestSchema.safeParse(await req.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { agentId, messages } = parsed.data as {
    agentId: string;
    conversationId?: string;
    messages: UIMessage[];
  };
  let { conversationId } = parsed.data as { conversationId?: string };

  const agent = await prisma.agent.findUnique({
    where: { id: agentId },
    include: {
      tools: {
        where: { enabled: true, tool: { enabled: true } },
        include: { tool: true },
      },
    },
  });

  if (!agent) return Response.json({ error: 'Agente nao encontrado' }, { status: 404 });

  if (!conversationId) {
    const conversation = await prisma.conversation.create({
      data: { agentId, title: getMessageContent(messages[messages.length - 1])?.slice(0, 80) },
    });
    conversationId = conversation.id;
  }

  const tools = Object.fromEntries(
    agent.tools.map(agentTool => {
      const dbTool = agentTool.tool;
      return [
        dbTool.name,
        tool({
          description: dbTool.description,
          inputSchema: parseInputSchema(dbTool.inputSchema),
          execute: async args => {
            console.log('[tool:call]', {
              toolName: dbTool.name,
              method: dbTool.method,
              urlTemplate: dbTool.url,
              args,
            });

            const decryptedHeaders = decryptSecret(dbTool.encryptedHeaders);
            const headers = decryptedHeaders ? JSON.parse(decryptedHeaders) : undefined;
            const result = await executeHttpTool({
              method: dbTool.method,
              url: dbTool.url,
              headers,
              args: args as Record<string, unknown>,
              timeoutMs: dbTool.timeoutMs,
            });

            return result;
          },
        }),
      ];
    }),
  ) satisfies ToolSet;

  const result = streamText({
    model: openrouter(process.env.OPENROUTER_MODEL ?? 'openai/gpt-4o-mini'),
    system: agent.systemPrompt,
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: async ({ messages: finishedMessages }) => {
      if (conversationId) await persistMessages(conversationId, finishedMessages);
    },
    headers: conversationId ? { 'x-conversation-id': conversationId } : undefined,
  });
}
