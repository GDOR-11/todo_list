'use server';

import { auth } from '@/lib/auth/server';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Repeat } from '@/generated/prisma';

const repeatValues = Object.values(Repeat);

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function addMonthsClamped(date: Date, months: number) {
  const next = new Date(date);
  const targetMonth = next.getMonth() + months;
  const targetYear = next.getFullYear() + Math.floor(targetMonth / 12);
  const normalizedMonth = ((targetMonth % 12) + 12) % 12;
  const targetDay = Math.min(next.getDate(), getDaysInMonth(targetYear, normalizedMonth));

  next.setFullYear(targetYear, normalizedMonth, targetDay);

  return next;
}

function getNextDeadline(deadline: Date | null, repeat: Repeat) {
  const next = new Date(deadline ?? new Date());

  if (repeat === Repeat.Daily) {
    next.setDate(next.getDate() + 1);
    return next;
  }

  if (repeat === Repeat.Weekly) {
    next.setDate(next.getDate() + 7);
    return next;
  }

  if (repeat === Repeat.Monthly) {
    return addMonthsClamped(next, 1);
  }

  if (repeat === Repeat.Yearly) {
    return addMonthsClamped(next, 12);
  }

  return null;
}

export async function signOut() {
  await auth.signOut();
  redirect('/');
}

export async function createTask() {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    return { error: 'Você precisa estar autenticado para criar tarefas.' };
  }

  const task = await prisma.task.create({
    data: {
      userId: session.user.id,
      title: 'Nova tarefa',
      repeat: Repeat.No,
    },
    select: {
      id: true,
      title: true,
      description: true,
      deadline: true,
      repeat: true,
    },
  });

  revalidatePath('/');

  return {
    task,
  };
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

  const deadline = deadlineValue ? new Date(deadlineValue) : null;

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

export async function completeTask(taskId: number) {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    return { error: 'Você precisa estar autenticado para concluir tarefas.' };
  }

  if (!Number.isInteger(taskId)) {
    return { error: 'Tarefa inválida.' };
  }

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId: session.user.id,
    },
    select: {
      id: true,
      deadline: true,
      repeat: true,
    },
  });

  if (!task) {
    return { error: 'Tarefa não encontrada.' };
  }

  if (task.repeat === Repeat.No) {
    await prisma.task.delete({
      where: {
        id: task.id,
      },
    });
  } else {
    await prisma.task.update({
      where: {
        id: task.id,
      },
      data: {
        deadline: getNextDeadline(task.deadline, task.repeat),
      },
    });
  }

  revalidatePath('/');

  return { success: true };
}

export async function deleteTask(taskId: number) {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    return { error: 'Você precisa estar autenticado para excluir tarefas.' };
  }

  if (!Number.isInteger(taskId)) {
    return { error: 'Tarefa inválida.' };
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

  await prisma.task.delete({
    where: {
      id: task.id,
    },
  });

  revalidatePath('/');

  return { success: true };
}
