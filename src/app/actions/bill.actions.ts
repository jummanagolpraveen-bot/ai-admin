"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getBills() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from('bills')
    .select('*')
    .order('due_date', { ascending: true });

  if (error) throw error;
  
  return data.map((b: any) => ({
    ...b,
    dueDate: b.due_date,
    isPaid: b.is_paid,
    createdAt: b.created_at
  }));
}

export async function createBill(data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from('bills').insert({
    name: data.name,
    amount: parseFloat(data.amount),
    due_date: data.dueDate ? new Date(data.dueDate).toISOString() : null,
    is_paid: false,
    user_id: user.id
  });

  if (error) throw error;
  revalidatePath("/bills");
  revalidatePath("/dashboard");
}

export async function toggleBillStatus(id: string, currentStatus: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from('bills')
    .update({ is_paid: !currentStatus })
    .eq('id', id);

  if (error) throw error;
  revalidatePath("/bills");
  revalidatePath("/dashboard");
}

export async function deleteBill(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from('bills').delete().eq('id', id);

  if (error) throw error;
  revalidatePath("/bills");
  revalidatePath("/dashboard");
}
