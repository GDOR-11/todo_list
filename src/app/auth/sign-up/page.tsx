'use client';

import { useActionState } from 'react';
import { signUpWithEmail } from './actions';

export default function SignUpForm() {
  const [state, formAction, isPending] = useActionState(signUpWithEmail, null);

  return (
    <form action={formAction}
      className="flex flex-col gap-5 min-h-screen items-center justify-center bg-gray-200 text-gray-900 dark:bg-gray-900 dark:text-gray-100">

      <div className="w-sm">
        <h1 className="mt-10 text-center text-2xl/9 font-bold">Criar nova conta</h1>
      </div>

      <div className='flex flex-col gap-1.5 w-sm'>
        <label htmlFor="name" className="block text-sm font-medium">Nome</label>
        <input id="name" name="name" type="text" required placeholder="João Silva"
          className="block rounded-md w-full bg-white px-2 py-1.5 text-gray-900 placeholder:text-gray-500 outline-1 outline-gray-400 focus:outline-gray-900 dark:bg-white/5 dark:text-gray-100 dark:outline-white/10 dark:focus:outline-gray-100"
        />
      </div>

      <div className='flex flex-col gap-1.5 w-sm'>
        <label htmlFor="email" className="block text-sm font-medium">Endereço de email</label>
        <input id="email" name="email" type="email" required placeholder="joao@minha-empresa.com"
          className="block rounded-md w-full bg-white px-2 py-1.5 text-gray-900 placeholder:text-gray-500 outline-1 outline-gray-400 focus:outline-gray-900 dark:bg-white/5 dark:text-gray-100 dark:outline-white/10 dark:focus:outline-gray-100"/>
      </div>

      <div className='flex flex-col gap-1.5 w-sm'>
        <label htmlFor="password" className="block text-sm font-medium">Senha</label>
        <input id="password" name="password" type="password" required placeholder="*****"
          className="block rounded-md w-full bg-white px-2 py-1.5 text-gray-900 placeholder:text-gray-500 outline-1 outline-gray-400 focus:outline-gray-900 dark:bg-white/5 dark:text-gray-100 dark:outline-white/10 dark:focus:outline-gray-100"/>
      </div>

      {state?.error && (
        <div className="rounded-md px-3 py-2 text-sm text-red-500">
          {state.error}
        </div>
      )}

      <button type="submit" disabled={isPending}
        className="cursor-pointer flex w-sm justify-center rounded-md bg-gray-900 px-3 py-1.5 text-sm/6 font-semibold text-gray-100 hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300">
        {isPending ? 'Criando conta...' : 'Criar conta'}
      </button>
    </form>
  );
}
