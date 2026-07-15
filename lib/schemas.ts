import { z } from 'zod';

export const httpMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;

const jsonString = z
  .string()
  .trim()
  .optional()
  .transform(value => value || undefined)
  .refine(
    value => {
      if (!value) return true;
      try {
        JSON.parse(value);
        return true;
      } catch {
        return false;
      }
    },
    { message: 'JSON invalido' },
  );

export const agentSchema = z.object({
  name: z.string().trim().min(1, 'Nome obrigatorio'),
  description: z.string().trim().optional().default(''),
  systemPrompt: z.string().trim().min(1, 'System prompt obrigatorio'),
  toolIds: z.array(z.string()).optional().default([]),
});

export const toolSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nome obrigatorio')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Use apenas letras, numeros, _ ou -'),
  description: z.string().trim().min(1, 'Descricao obrigatoria'),
  method: z.enum(httpMethods),
  url: z.string().trim().url('URL invalida'),
  headers: jsonString,
  inputSchema: jsonString,
  responseMapping: z.string().trim().optional().default(''),
  timeoutMs: z.coerce.number().int().min(500).max(60000).default(10000),
  enabled: z.coerce.boolean().default(true),
});

export const chatRequestSchema = z.object({
  agentId: z.string().min(1),
  conversationId: z.string().optional(),
  messages: z.array(z.unknown()),
});
