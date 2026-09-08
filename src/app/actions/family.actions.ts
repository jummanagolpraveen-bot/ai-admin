"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getFamily() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { family: { include: { members: true } } }
  });

  return user?.family || null;
}

export async function createFamily(name: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const family = await prisma.family.create({
    data: {
      name,
      members: {
        connect: { id: session.user.id }
      }
    }
  });

  revalidatePath("/family");
  return family;
}
