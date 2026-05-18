'use server';

import { auth } from '@/lib/auth/server';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Repeat } from '@/generated/prisma';

const repeatValues = Object.values(Repeat);

export async function signOut() {
  await auth.signOut();
  redirect('/');
}

export async function updateTask(formData: FormData) {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    return { error: 'Você precisa estar autenticado para editar tarefas.' };
  }

  const taskId = Number(formData.get('id'));
  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const deadlineValue = String(formData.get('deadline') ?? '');
  const repeat = formData.get('repeat');

  if (!Number.isInteger(taskId)) {
    return { error: 'Tarefa inválida.' };
  }

  if (!title) {
    return { error: 'O título deve ser informado.' };
  }

  if (typeof repeat !== 'string' || !repeatValues.includes(repeat as Repeat)) {
    return { error: 'Repetição inválida.' };
  }

  const deadline = deadlineValue ? new Date(`${deadlineValue}T00:00:00`) : null;

  if (deadline && Number.isNaN(deadline.getTime())) {
    return { error: 'Prazo inválido.' };
  }

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId: session.user.id,
    },
    select: {
      id: true,
    },
  });

  if (!task) {
    return { error: 'Tarefa não encontrada.' };
  }

  await prisma.task.update({
    where: {
      id: task.id,
    },
    data: {
      title,
      description: description || null,
      deadline,
      repeat: repeat as Repeat,
    },
  });

  revalidatePath('/');

  return { success: true };
}
