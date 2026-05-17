import Image from 'next/image';
import { signOut } from '../actions';

export function Header() {
  return (
    <header className="flex h-24 w-full items-center justify-between bg-gray-400 px-6 text-gray-900 dark:bg-gray-700 dark:text-gray-100">
      <div className="relative h-24 w-24 overflow-hidden rounded-md">
        <Image
          src="/logo-light.png"
          alt="Lista de tarefas"
          fill
          priority
          sizes="112px"
          className="object-cover dark:hidden"
        />
        <Image
          src="/logo-dark.png"
          alt="Lista de tarefas"
          fill
          priority
          sizes="112px"
          className="hidden object-cover dark:block"
        />
      </div>

      <form action={signOut}>
        <button
          type="submit"
          className="rounded-md cursor-pointer px-4 py-2 text-sm font-semibold text-gray-100 bg-gray-900 hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
        >
          Sair
        </button>
      </form>
    </header>
  );
}
