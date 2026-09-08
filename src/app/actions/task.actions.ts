"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getTasks() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('due_date', { ascending: true });

  if (error) throw error;
  
  return data.map((t: any) => ({
    ...t,
    dueDate: t.due_date,
    createdAt: t.created_at,
    updatedAt: t.updated_at
  }));
}

export async function createTask(data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from('tasks').insert({
    title: data.title,
    description: data.description || '',
    due_date: data.dueDate ? new Date(data.dueDate).toISOString() : null,
    priority: data.priority || 'medium',
    completed: false,
    user_id: user.id
  });

  if (error) throw error;
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
}

export async function toggleTaskStatus(id: string, currentStatus: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from('tasks')
    .update({ completed: !currentStatus })
    .eq('id', id);

  if (error) throw error;
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
}

export async function deleteTask(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from('tasks').delete().eq('id', id);

  if (error) throw error;
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
}
