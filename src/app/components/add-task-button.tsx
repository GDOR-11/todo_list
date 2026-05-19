'use client';

import { createTask } from '@/app/actions';
import { useState, useTransition } from 'react';
import { EditableTask, EditTaskDialog } from './edit-task-dialog';

export function AddTaskButton() {
  const [createdTask, setCreatedTask] = useState<EditableTask | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setError(null);

    startTransition(async () => {
      const result = await createTask();

      if (result?.error) {
        setError(result.error);
        return;
      }

      if (result?.task) {
        setCreatedTask(result.task);
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-gray-100 hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
      >
        {isPending ? 'Criando...' : 'Nova tarefa'}
      </button>

      {error && <p className="text-sm text-red-600 dark:text-red-300">{error}</p>}

      {createdTask && (
        <EditTaskDialog
          key={createdTask.id}
          task={createdTask}
          openOnMount
          refreshOnClose
          showTrigger={false}
        />
      )}
    </div>
  );
}
