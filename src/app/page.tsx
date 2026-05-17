import { auth } from '@/lib/auth/server';
import Link from 'next/link';
import { Header } from './components/header';

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

  return (
    <div className="flex min-h-screen flex-col bg-gray-200 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center gap-2">
        <h1 className="mb-4 text-4xl">
          Autenticado como <span className="font-bold underline">{session.user.name}</span>
        </h1>
      </main>
    </div>
  );
}
