"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getVehicles() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('next_service_date', { ascending: true });

  if (error) throw error;
  
  return data.map((v: any) => ({
    ...v,
    nextServiceDate: v.next_service_date
  }));
}

export async function createVehicle(data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from('vehicles').insert({
    make: data.make,
    model: data.model,
    year: parseInt(data.year, 10),
    next_service_date: data.nextServiceDate ? new Date(data.nextServiceDate).toISOString() : null,
    user_id: user.id
  });

  if (error) throw error;
  revalidatePath("/vehicles");
}

export async function deleteVehicle(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from('vehicles').delete().eq('id', id);

  if (error) throw error;
  revalidatePath("/vehicles");
}
