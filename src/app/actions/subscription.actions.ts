"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getSubscriptions() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  return await prisma.subscription.findMany({
    where: { userId: session.user.id },
    orderBy: { nextBillingDate: 'asc' }
  });
}

export async function createSubscription(data: any) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.subscription.create({
    data: {
      ...data,
      cost: parseFloat(data.cost),
      nextBillingDate: new Date(data.nextBillingDate),
      userId: session.user.id
    }
  });

  revalidatePath("/subscriptions");
}

export async function deleteSubscription(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.subscription.delete({
    where: { id, userId: session.user.id }
  });

  revalidatePath("/subscriptions");
}
