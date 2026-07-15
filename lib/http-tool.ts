type ExecuteHttpToolInput = {
  method: string;
  url: string;
  headers?: Record<string, string>;
  args: Record<string, unknown>;
  timeoutMs: number;
};

function interpolate(value: string, args: Record<string, unknown>) {
  return value.replace(/{{\s*([\w.-]+)\s*}}/g, (_, key: string) => {
    const replacement = args[key];
    return replacement == null ? '' : encodeURIComponent(String(replacement));
  });
}

function interpolateHeaders(headers: Record<string, string>, args: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [key, interpolate(value, args)]),
  );
}

export async function executeHttpTool(input: ExecuteHttpToolInput) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), input.timeoutMs);

  try {
    const url = interpolate(input.url, input.args);
    const headers = input.headers ? interpolateHeaders(input.headers, input.args) : {};
    const method = input.method.toUpperCase();
    const body = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)
      ? JSON.stringify(input.args)
      : undefined;

    console.log('[tool:http] request', {
      method,
      url,
      args: input.args,
      hasHeaders: Object.keys(headers).length > 0,
      hasBody: Boolean(body),
      timeoutMs: input.timeoutMs,
    });

    const response = await fetch(url, {
      method,
      headers: {
        ...(body ? { 'content-type': 'application/json' } : {}),
        ...headers,
      },
      body,
      signal: controller.signal,
    });

    const text = await response.text();

    console.log('[tool:http] response', {
      method,
      url,
      status: response.status,
      ok: response.ok,
    });

    let data: unknown = text;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: `Endpoint retornou HTTP ${response.status}`,
        data,
      };
    }

    return { ok: true, status: response.status, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    return { ok: false, status: 0, error: message, data: null };
  } finally {
    clearTimeout(timeout);
  }
}
