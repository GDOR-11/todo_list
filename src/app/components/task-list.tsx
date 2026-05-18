import type { Task } from '@/generated/prisma';

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

function TaskItem({ task }: { task: Task }) {
  return (
    <li className="rounded-md bg-white p-5 shadow-sm ring-1 ring-gray-300 dark:bg-gray-800 dark:ring-gray-700">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold">{task.title}</h2>
          {task.description && (
            <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">
              {task.description}
            </p>
          )}
        </div>

        <div className="flex sm:flex-col justify-center sm:justify-strech shrink-0 flex-wrap gap-4 text-xs font-medium">
          <span className="text-center rounded-md bg-gray-200 px-2.5 py-1 text-gray-800 dark:bg-gray-700 dark:text-gray-100">
            {formatDeadline(task.deadline)}
          </span>
          <span className="text-center rounded-md bg-gray-900 px-2.5 py-1 text-gray-100 dark:bg-gray-100 dark:text-gray-900">
            {repeatLabels[task.repeat]}
          </span>
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
