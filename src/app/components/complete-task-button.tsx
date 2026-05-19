'use client';

import { completeTask } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

export function CompleteTaskButton({ taskId }: { taskId: number }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setError(null);

    startTransition(async () => {
      const result = await completeTask(taskId);

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
        className="cursor-pointer rounded-md bg-green-700 px-3 py-1 text-xs font-semibold text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-green-500 dark:text-white dark:hover:bg-green-400"
      >
        {isPending ? 'Concluindo...' : 'Concluir'}
      </button>
      {error && <p className="text-xs text-red-600 dark:text-red-300">{error}</p>}
    </div>
  );
}
