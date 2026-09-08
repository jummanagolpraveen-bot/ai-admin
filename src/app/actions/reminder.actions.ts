"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getReminders() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: reminders, error } = await supabase
    .from('reminders')
    .select('*')
    .order('reminder_date', { ascending: true });
  
  if (error) throw error;
  
  return reminders.map((r: any) => ({
    ...r,
    dueDate: r.reminder_date,
    status: r.completed ? "COMPLETED" : "ACTIVE"
  }));
}

export async function createReminder(data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from('reminders').insert({
    title: data.title,
    description: data.notes || '',
    reminder_date: new Date(data.dueDate).toISOString(),
    completed: false,
    user_id: user.id
  });

  if (error) throw error;

  revalidatePath("/dashboard");
  revalidatePath("/reminders");
}

export async function toggleReminderStatus(id: string, currentStatus: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const isCompleted = currentStatus === "COMPLETED";

  const { error } = await supabase.from('reminders')
    .update({ completed: !isCompleted })
    .eq('id', id);

  if (error) throw error;

  revalidatePath("/dashboard");
  revalidatePath("/reminders");
}
