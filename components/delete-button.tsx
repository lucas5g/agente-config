'use client';

import { useRouter } from 'next/navigation';

export function DeleteButton({ endpoint, label }: { endpoint: string; label: string }) {
  const router = useRouter();

  async function onClick() {
    if (!confirm(`Excluir ${label}?`)) return;

    await fetch(endpoint, { method: 'DELETE' });
    router.refresh();
  }

  return (
    <button onClick={onClick} className="text-sm text-red-300 hover:text-red-200">
      Excluir
    </button>
  );
}
