'use client';

import { deleteTask } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

export function DeleteTaskButton({ taskId }: { taskId: number }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setError(null);

    startTransition(async () => {
      const result = await deleteTask(taskId);

      if (result?.error) {
        setError(result.error);
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="cursor-pointer rounded-md bg-red-700 px-3 py-1 text-xs font-semibold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-red-500 dark:text-white dark:hover:bg-red-400"
      >
        {isPending ? 'Excluindo...' : 'Excluir'}
      </button>
      {error && <p className="text-xs text-red-600 dark:text-red-300">{error}</p>}
    </div>
  );
}
