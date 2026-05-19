'use client';

import { createTask } from '@/app/actions';
import { Repeat } from '@/generated/prisma';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { CompleteTaskButton } from './complete-task-button';
import { EditableTask, EditTaskDialog } from './edit-task-dialog';

type TaskBoardProps = {
  tasks: EditableTask[];
};

const repeatLabels: Record<Repeat, string> = {
  No: 'Sem repetição',
  Daily: 'Diária',
  Weekly: 'Semanal',
  Monthly: 'Mensal',
  Yearly: 'Anual',
};

function formatDeadline(deadline: Date | null) {
  if (!deadline) {
    return 'Sem prazo';
  }

  const today = new Date();
  const isToday =
    deadline.getDate() === today.getDate() &&
    deadline.getMonth() === today.getMonth() &&
    deadline.getFullYear() === today.getFullYear();
  const isCurrentYear = deadline.getFullYear() === today.getFullYear();

  if (isToday) {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(deadline);
  }

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  };

  if (!isCurrentYear) {
    options.year = 'numeric';
  }

  return new Intl.DateTimeFormat('pt-BR', options).format(deadline);
}

function TaskItem({
  task,
  onEdit,
}: {
  task: EditableTask;
  onEdit: (task: EditableTask) => void;
}) {
  const isOverdue = task.deadline ? task.deadline < new Date() : false;

  return (
    <li
      className={`rounded-md p-5 shadow-sm ring-1 ${
        isOverdue
          ? 'bg-red-100 ring-red-300 dark:bg-red-950/50 dark:ring-red-900'
          : 'bg-white ring-gray-300 dark:bg-gray-800 dark:ring-gray-700'
      }`}
    >
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div className="min-w-0">
          <p className="text-3xl font-semibold">{task.title}</p>
          {task.description && (
            <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">
              {task.description}
            </p>
          )}
        </div>

        <div className="grid shrink-0 grid-cols-2 items-center gap-3 text-xs font-medium sm:gap-y-5">
          <span className="rounded-md bg-gray-300 px-2.5 py-1 text-center text-gray-800 dark:bg-gray-700 dark:text-gray-100">
            {formatDeadline(task.deadline)}
          </span>
          <span className="rounded-md bg-gray-300 px-2.5 py-1 text-center text-gray-800 dark:bg-gray-700 dark:text-gray-100">
            {repeatLabels[task.repeat]}
          </span>
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="cursor-pointer rounded-md bg-gray-900 px-3 py-1 text-xs font-semibold text-gray-100 hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
          >
            Editar
          </button>
          <CompleteTaskButton taskId={task.id} />
        </div>
      </div>
    </li>
  );
}

export function TaskBoard({ tasks }: TaskBoardProps) {
  const router = useRouter();
  const [editingTask, setEditingTask] = useState<EditableTask | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function openEdit(task: EditableTask) {
    setEditingTask({ ...task });
  }

  function createAndEditTask() {
    setError(null);

    startTransition(async () => {
      const result = await createTask();

      if (result?.error) {
        setError(result.error);
        return;
      }

      if (result?.task) {
        setEditingTask(result.task);
      }
    });
  }

  function closeDialog() {
    setEditingTask(null);
    router.refresh();
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-4xl font-bold">Minhas tarefas</h1>
        <div className="flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={createAndEditTask}
            disabled={isPending}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-gray-100 hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
          >
            {isPending ? 'Criando...' : 'Nova tarefa'}
          </button>
          {error && <p className="text-sm text-red-600 dark:text-red-300">{error}</p>}
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-md bg-white p-8 text-center shadow-sm ring-1 ring-gray-300 dark:bg-gray-800 dark:ring-gray-700">
          <h2 className="text-xl font-semibold">Nenhuma tarefa encontrada</h2>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Suas tarefas aparecerão aqui quando forem criadas.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onEdit={openEdit} />
          ))}
        </ul>
      )}

      <EditTaskDialog task={editingTask} onClose={closeDialog} />
    </>
  );
}
