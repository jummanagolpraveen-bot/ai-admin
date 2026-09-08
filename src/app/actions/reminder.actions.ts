"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getReminders() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const reminders = await prisma.reminder.findMany({
    where: { userId: session.user.id },
    orderBy: { dueDate: 'asc' }
  });
  
  return reminders;
}

export async function createReminder(data: any) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.reminder.create({
    data: {
      ...data,
      userId: session.user.id
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/reminders");
}

export async function toggleReminderStatus(id: string, currentStatus: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const newStatus = currentStatus === "COMPLETED" ? "ACTIVE" : "COMPLETED";

  await prisma.reminder.update({
    where: { id, userId: session.user.id },
    data: { status: newStatus as any }
  });

  revalidatePath("/dashboard");
  revalidatePath("/reminders");
}
