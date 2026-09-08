"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getSubscriptions() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: subscriptions, error } = await supabase
    .from('subscriptions')
    .select('*')
    .order('next_billing_date', { ascending: true });

  if (error) throw error;
  
  return subscriptions.map((s: any) => ({
    ...s,
    billingCycle: s.billing_cycle,
    nextBillingDate: s.next_billing_date
  }));
}

export async function createSubscription(data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from('subscriptions').insert({
    name: data.name,
    cost: parseFloat(data.cost),
    billing_cycle: data.billingCycle,
    next_billing_date: new Date(data.nextBillingDate).toISOString(),
    user_id: user.id
  });

  if (error) throw error;
  revalidatePath("/subscriptions");
}

export async function deleteSubscription(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from('subscriptions')
    .delete()
    .eq('id', id); // RLS handles ensuring the user owns the record

  if (error) throw error;
  revalidatePath("/subscriptions");
}
