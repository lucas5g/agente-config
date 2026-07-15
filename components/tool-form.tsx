'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitButton } from './button';

type Tool = {
  id: string;
  name: string;
  description: string;
  method: string;
  url: string;
  inputSchema: string | null;
  responseMapping: string | null;
  timeoutMs: number;
  enabled: boolean;
};

export function ToolForm({ tool }: { tool?: Tool }) {
  const router = useRouter();
  const [error, setError] = useState('');

  async function onSubmit(formData: FormData) {
    setError('');
    const payload = {
      name: String(formData.get('name') ?? ''),
      description: String(formData.get('description') ?? ''),
      method: String(formData.get('method') ?? 'GET'),
      url: String(formData.get('url') ?? ''),
      headers: String(formData.get('headers') ?? ''),
      inputSchema: String(formData.get('inputSchema') ?? ''),
      responseMapping: String(formData.get('responseMapping') ?? ''),
      timeoutMs: Number(formData.get('timeoutMs') ?? 10000),
      enabled: formData.get('enabled') === 'on',
    };

    const response = await fetch(tool ? `/api/tools/${tool.id}` : '/api/tools', {
      method: tool ? 'PUT' : 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setError('Nao foi possivel salvar a tool. Verifique JSON, URL e campos obrigatorios.');
      return;
    }

    router.push('/tools');
    router.refresh();
  }

  return (
    <form action={onSubmit} className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      {error ? <p className="rounded-lg bg-red-950 p-3 text-sm text-red-200">{error}</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium">
          Nome
          <input name="name" defaultValue={tool?.name} className="mt-2 w-full rounded-lg border border-slate-700 px-3 py-2" />
        </label>
        <label className="block text-sm font-medium">
          Metodo
          <select name="method" defaultValue={tool?.method ?? 'GET'} className="mt-2 w-full rounded-lg border border-slate-700 px-3 py-2">
            {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map(method => <option key={method}>{method}</option>)}
          </select>
        </label>
      </div>
      <label className="block text-sm font-medium">
        Descricao
        <input name="description" defaultValue={tool?.description} className="mt-2 w-full rounded-lg border border-slate-700 px-3 py-2" />
      </label>
      <label className="block text-sm font-medium">
        URL
        <input name="url" defaultValue={tool?.url} placeholder="https://api.exemplo.com/clientes?email={{email}}" className="mt-2 w-full rounded-lg border border-slate-700 px-3 py-2" />
      </label>
      <label className="block text-sm font-medium">
        Headers JSON {tool ? <span className="text-slate-400">(deixe vazio para manter os atuais)</span> : null}
        <textarea name="headers" rows={4} placeholder={'{"Authorization":"Bearer token"}'} className="mt-2 w-full rounded-lg border border-slate-700 px-3 py-2" />
      </label>
      <label className="block text-sm font-medium">
        Input schema JSON
        <textarea
          name="inputSchema"
          defaultValue={tool?.inputSchema ?? ''}
          rows={10}
          placeholder={`{
  "type": "object",
  "properties": {
    "email": {
      "type": "string",
      "description": "E-mail do cliente"
    }
  },
  "required": ["email"]
}`}
          className="mt-2 w-full rounded-lg border border-slate-700 px-3 py-2"
        />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium">
          Timeout ms
          <input name="timeoutMs" type="number" defaultValue={tool?.timeoutMs ?? 10000} className="mt-2 w-full rounded-lg border border-slate-700 px-3 py-2" />
        </label>
        <label className="mt-8 flex items-center gap-2 text-sm font-medium">
          <input name="enabled" type="checkbox" defaultChecked={tool?.enabled ?? true} />
          Ativa
        </label>
      </div>
      <input name="responseMapping" type="hidden" defaultValue={tool?.responseMapping ?? ''} />
      <SubmitButton>Salvar tool</SubmitButton>
    </form>
  );
}
