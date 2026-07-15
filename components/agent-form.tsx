'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitButton } from './button';

type Tool = { id: string; name: string; description: string };
type Agent = {
  id: string;
  name: string;
  description: string | null;
  systemPrompt: string;
  tools: { toolId: string }[];
};

export function AgentForm({ agent, tools }: { agent?: Agent; tools: Tool[] }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const selectedTools = new Set(agent?.tools.map(item => item.toolId) ?? []);

  async function onSubmit(formData: FormData) {
    setError('');
    const toolIds = formData.getAll('toolIds').map(String);
    const payload = {
      name: String(formData.get('name') ?? ''),
      description: String(formData.get('description') ?? ''),
      systemPrompt: String(formData.get('systemPrompt') ?? ''),
      toolIds,
    };

    const response = await fetch(agent ? `/api/agents/${agent.id}` : '/api/agents', {
      method: agent ? 'PUT' : 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setError('Nao foi possivel salvar o agente. Verifique os campos.');
      return;
    }

    router.push('/agents');
    router.refresh();
  }

  return (
    <form action={onSubmit} className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      {error ? <p className="rounded-lg bg-red-950 p-3 text-sm text-red-200">{error}</p> : null}
      <label className="block text-sm font-medium">
        Nome
        <input name="name" defaultValue={agent?.name} className="mt-2 w-full rounded-lg border border-slate-700 px-3 py-2" />
      </label>
      <label className="block text-sm font-medium">
        Descricao
        <input name="description" defaultValue={agent?.description ?? ''} className="mt-2 w-full rounded-lg border border-slate-700 px-3 py-2" />
      </label>
      <label className="block text-sm font-medium">
        System prompt
        <textarea name="systemPrompt" defaultValue={agent?.systemPrompt} rows={8} className="mt-2 w-full rounded-lg border border-slate-700 px-3 py-2" />
      </label>
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">Tools associadas</legend>
        {tools.length ? (
          tools.map(tool => (
            <label key={tool.id} className="flex items-start gap-3 rounded-lg border border-slate-800 p-3 text-sm">
              <input name="toolIds" value={tool.id} type="checkbox" defaultChecked={selectedTools.has(tool.id)} className="mt-1" />
              <span>
                <span className="block font-semibold">{tool.name}</span>
                <span className="text-slate-400">{tool.description}</span>
              </span>
            </label>
          ))
        ) : (
          <p className="text-sm text-slate-400">Nenhuma tool cadastrada ainda.</p>
        )}
      </fieldset>
      <SubmitButton>Salvar agente</SubmitButton>
    </form>
  );
}
