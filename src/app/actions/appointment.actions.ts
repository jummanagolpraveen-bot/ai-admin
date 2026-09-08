"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getAppointments() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('appointment_date', { ascending: true });

  if (error) throw error;
  
  return data.map((a: any) => ({
    ...a,
    appointmentDate: a.appointment_date,
    createdAt: a.created_at
  }));
}

export async function createAppointment(data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from('appointments').insert({
    title: data.title,
    appointment_date: new Date(data.appointmentDate).toISOString(),
    location: data.location || null,
    notes: data.notes || null,
    user_id: user.id
  });

  if (error) throw error;
  revalidatePath("/appointments");
  revalidatePath("/dashboard");
}

export async function deleteAppointment(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from('appointments').delete().eq('id', id);

  if (error) throw error;
  revalidatePath("/appointments");
  revalidatePath("/dashboard");
}
