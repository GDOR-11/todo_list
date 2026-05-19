import type { Task } from '@/generated/prisma';
import { DeleteTaskButton } from './delete-task-button';
import { EditTaskDialog } from './edit-task-dialog';

const repeatLabels: Record<Task['repeat'], string> = {
  No: 'Sem repetição',
  Daily: 'Diária',
  Weekly: 'Semanal',
  Monthly: 'Mensal',
  Yearly: 'Anual',
};

function formatDeadline(deadline: Task['deadline']) {
  if (!deadline) {
    return 'Sem prazo';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(deadline);
}

function formatDeadlineInput(deadline: Task['deadline']) {
  if (!deadline) {
    return '';
  }

  return deadline.toISOString().slice(0, 10);
}

function TaskItem({ task }: { task: Task }) {
  return (
    <li className="rounded-md bg-white p-5 shadow-sm ring-1 ring-gray-300 dark:bg-gray-800 dark:ring-gray-700">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-3xl font-semibold">{task.title}</p>
          {task.description && (
            <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">
              {task.description}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-stretch justify-center gap-4">
          <div className="flex flex-wrap justify-center gap-3 text-xs font-medium">
            <span className="rounded-md bg-gray-200 px-2.5 py-1 text-center text-gray-800 dark:bg-gray-700 dark:text-gray-100">
              {formatDeadline(task.deadline)}
            </span>
            <span className="rounded-md bg-gray-200 px-2.5 py-1 text-center text-gray-800 dark:bg-gray-700 dark:text-gray-100">
              {repeatLabels[task.repeat]}
            </span>
          </div>
          <div className="flex justify-center gap-3">
            <EditTaskDialog
              task={{
                id: task.id,
                title: task.title,
                description: task.description,
                deadline: formatDeadlineInput(task.deadline),
                repeat: task.repeat,
              }}
            />
            <DeleteTaskButton taskId={task.id} />
          </div>
        </div>
      </div>
    </li>
  );
}

export function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-md bg-white p-8 text-center shadow-sm ring-1 ring-gray-300 dark:bg-gray-800 dark:ring-gray-700">
        <h2 className="text-xl font-semibold">Nenhuma tarefa encontrada</h2>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Suas tarefas aparecerão aqui quando forem criadas.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}
