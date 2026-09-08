"use server";

import { createClient } from "@/utils/supabase/server";

export async function getFamily() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Family features are disabled in this schema
  return null;
}

export async function createFamily(name: string) {
  throw new Error("Family features not currently supported in the new Supabase schema.");
}
