import { z } from 'zod';

type JsonSchema = {
  type?: string;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  description?: string;
  enum?: unknown[];
  items?: JsonSchema;
};

function schemaToZod(schema: JsonSchema | undefined): z.ZodTypeAny {
  if (!schema) return z.object({}).passthrough();

  if (schema.enum?.length) {
    return z.enum(schema.enum.map(String) as [string, ...string[]]);
  }

  switch (schema.type) {
    case 'string':
      return z.string();
    case 'number':
      return z.number();
    case 'integer':
      return z.number().int();
    case 'boolean':
      return z.boolean();
    case 'array':
      return z.array(schemaToZod(schema.items));
    case 'object': {
      const required = new Set(schema.required ?? []);
      const shape = Object.fromEntries(
        Object.entries(schema.properties ?? {}).map(([key, value]) => {
          const field = schemaToZod(value);
          return [key, required.has(key) ? field : field.optional()];
        }),
      );
      return z.object(shape).passthrough();
    }
    default:
      return z.object({}).passthrough();
  }
}

export function parseInputSchema(value?: string | null) {
  if (!value) return z.object({}).passthrough();

  try {
    return schemaToZod(JSON.parse(value));
  } catch {
    return z.object({}).passthrough();
  }
}
