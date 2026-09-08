"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getVehicles() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  return await prisma.vehicle.findMany({
    where: { userId: session.user.id },
    orderBy: { year: 'desc' }
  });
}

export async function createVehicle(data: any) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.vehicle.create({
    data: {
      ...data,
      year: parseInt(data.year, 10),
      nextServiceDate: data.nextServiceDate ? new Date(data.nextServiceDate) : null,
      userId: session.user.id
    }
  });

  revalidatePath("/vehicles");
}

export async function deleteVehicle(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.vehicle.delete({
    where: { id, userId: session.user.id }
  });

  revalidatePath("/vehicles");
}
