import { auth } from '@/lib/auth/server';
import Link from 'next/link';
import { Header } from './components/header';
import { prisma } from '@/lib/db';
import { TaskList } from './components/task-list';
import { AddTaskButton } from './components/add-task-button';

// Server components using auth methods must be rendered dynamically
export const dynamic = 'force-dynamic';

export default async function Home() {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    return (
      <div className="flex flex-col gap-2 min-h-screen items-center justify-center bg-gray-200 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <h1 className="mb-6 text-4xl font-bold">Não autenticado</h1>
        <div className="flex item-center gap-18">
          <Link
            href="/auth/sign-up"
            className="inline-flex text-lg hover:underline"
          >
            Cadastrar
          </Link>
          <Link
            href="/auth/sign-in"
            className="inline-flex text-lg hover:underline"
          >
            Entrar
          </Link>
        </div>
      </div>
    );
  }

  const tasks = await prisma.task.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: [
      {
        deadline: 'asc',
      },
      {
        id: 'asc',
      },
    ],
  });

  return (
    <div className="flex min-h-screen flex-col bg-gray-200 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Header />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-4xl font-bold">Minhas tarefas</h1>
          <AddTaskButton />
        </div>

        <TaskList tasks={tasks} />
      </main>
    </div>
  );
}
