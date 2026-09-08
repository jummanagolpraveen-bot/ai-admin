"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getWarranties() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  return await prisma.warranty.findMany({
    where: { userId: session.user.id },
    orderBy: { expiryDate: 'asc' }
  });
}

export async function createWarranty(data: any) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.warranty.create({
    data: {
      ...data,
      expiryDate: new Date(data.expiryDate),
      userId: session.user.id
    }
  });

  revalidatePath("/warranties");
}

export async function deleteWarranty(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.warranty.delete({
    where: { id, userId: session.user.id }
  });

  revalidatePath("/warranties");
}
