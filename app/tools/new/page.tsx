import { ToolForm } from '@/components/tool-form';

export default function NewToolPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Nova tool</h1>
      <ToolForm />
    </div>
  );
}
