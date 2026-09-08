"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getDocuments() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return data.map((d: any) => ({
    ...d,
    fileName: d.file_name,
    fileUrl: d.file_url,
    ocrText: d.ocr_text,
    createdAt: d.created_at
  }));
}

export async function uploadDocument(data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from('documents').insert({
    file_name: data.fileName,
    file_url: data.fileUrl,
    ocr_text: data.ocrText || null,
    user_id: user.id
  });

  if (error) throw error;
  revalidatePath("/documents");
}

export async function deleteDocument(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from('documents').delete().eq('id', id);

  if (error) throw error;
  revalidatePath("/documents");
}
