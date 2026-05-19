'use client';

import { updateTask } from '@/app/actions';
import { Repeat } from '@/generated/prisma';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useRef, useState, useTransition } from 'react';

export type EditableTask = {
  id: number;
  title: string;
  description: string | null;
  deadline: Date | null;
  repeat: Repeat;
};

type EditTaskDialogProps = {
  task: EditableTask | null;
  onClose?: () => void;
};

const repeatOptions: Array<{ value: Repeat; label: string }> = [
  { value: Repeat.No, label: 'Sem repetição' },
  { value: Repeat.Daily, label: 'Diária' },
  { value: Repeat.Weekly, label: 'Semanal' },
  { value: Repeat.Monthly, label: 'Mensal' },
  { value: Repeat.Yearly, label: 'Anual' },
];

function padDatePart(value: number) {
  return String(value).padStart(2, '0');
}

function formatDeadlineInput(deadline: Date | null) {
  if (!deadline) {
    return '';
  }

  const year = deadline.getFullYear();
  const month = padDatePart(deadline.getMonth() + 1);
  const day = padDatePart(deadline.getDate());
  const hours = padDatePart(deadline.getHours());
  const minutes = padDatePart(deadline.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function EditTaskDialog({ task, onClose }: EditTaskDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (task && !dialogRef.current?.open) {
      setError(null);
      dialogRef.current?.showModal();
    }
  }, [task]);

  function closeDialog() {
    dialogRef.current?.close();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await updateTask(formData);

      if (result?.error) {
        setError(result.error);
        return;
      }

      router.refresh();
      closeDialog();
    });
  }

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      onClose={onClose}
      className="m-auto w-[min(92vw,32rem)] rounded-md bg-white p-0 text-gray-900 shadow-xl backdrop:backdrop-blur-xs backdrop:bg-gray-900/60 dark:backdrop:bg-gray-100/40 dark:bg-gray-800 dark:text-gray-100"
    >
      {task && (
        <form key={task.id} onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-2xl font-bold">Editar tarefa</h2>
            <button
              type="button"
              onClick={closeDialog}
              className="rounded-md px-2 py-1 text-sm font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              aria-label="Fechar"
            >
              Fechar
            </button>
          </div>

          <input type="hidden" name="id" value={task.id} />

          <div className="flex flex-col gap-1.5">
            <label htmlFor={`title-${task.id}`} className="text-sm font-medium">
              Título
            </label>
            <input
              id={`title-${task.id}`}
              name="title"
              type="text"
              required
              defaultValue={task.title}
              className="rounded-md bg-gray-100 px-3 py-2 text-gray-900 outline-1 outline-gray-300 focus:outline-gray-900 dark:bg-white/5 dark:text-gray-100 dark:outline-white/10 dark:focus:outline-gray-100"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={`description-${task.id}`} className="text-sm font-medium">
              Descrição
            </label>
            <textarea
              id={`description-${task.id}`}
              name="description"
              defaultValue={task.description ?? ''}
              rows={4}
              className="resize-none rounded-md bg-gray-100 px-3 py-2 text-gray-900 outline-1 outline-gray-300 focus:outline-gray-900 dark:bg-white/5 dark:text-gray-100 dark:outline-white/10 dark:focus:outline-gray-100"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={`deadline-${task.id}`} className="text-sm font-medium">
              Prazo
            </label>
            <input
              id={`deadline-${task.id}`}
              name="deadline"
              type="datetime-local"
              defaultValue={formatDeadlineInput(task.deadline)}
              className="rounded-md bg-gray-100 px-3 py-2 text-gray-900 outline-1 outline-gray-300 focus:outline-gray-900 dark:bg-white/5 dark:text-gray-100 dark:outline-white/10 dark:focus:outline-gray-100"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={`repeat-${task.id}`} className="text-sm font-medium">
              Repetição
            </label>
            <select
              id={`repeat-${task.id}`}
              name="repeat"
              defaultValue={task.repeat}
              className="rounded-md bg-gray-100 px-3 py-2 text-gray-900 outline-1 outline-gray-300 focus:outline-gray-900 dark:bg-white/5 dark:text-gray-100 dark:outline-white/10 dark:focus:outline-gray-100"
            >
              {repeatOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={closeDialog}
              className="rounded-md px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-gray-100 hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
            >
              {isPending ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      )}
    </dialog>
  );
}
