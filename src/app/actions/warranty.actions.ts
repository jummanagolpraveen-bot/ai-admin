"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getWarranties() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from('warranties')
    .select('*')
    .order('expiry_date', { ascending: true });

  if (error) throw error;
  
  return data.map((w: any) => ({
    ...w,
    itemName: w.item_name,
    expiryDate: w.expiry_date,
    receiptUrl: w.receipt_url
  }));
}

export async function createWarranty(data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from('warranties').insert({
    item_name: data.itemName,
    expiry_date: new Date(data.expiryDate).toISOString(),
    receipt_url: data.receiptUrl || null,
    user_id: user.id
  });

  if (error) throw error;
  revalidatePath("/warranties");
}

export async function deleteWarranty(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from('warranties').delete().eq('id', id);

  if (error) throw error;
  revalidatePath("/warranties");
}
