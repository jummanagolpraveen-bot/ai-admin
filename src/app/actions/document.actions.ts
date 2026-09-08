"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getDocuments() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  return await prisma.document.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });
}

export async function createDocument(data: { fileName: string; fileUrl: string; ocrText?: string; extractedData?: any }) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.document.create({
    data: {
      ...data,
      userId: session.user.id
    }
  });

  revalidatePath("/documents");
}

export async function deleteDocument(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.document.delete({
    where: { id, userId: session.user.id }
  });

  revalidatePath("/documents");
}
