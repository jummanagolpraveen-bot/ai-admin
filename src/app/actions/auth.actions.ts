"use server";

import { createClient } from "@/utils/supabase/server";
import { signupSchema } from "@/lib/validations/auth";

export async function signupUser(formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const parsedData = signupSchema.safeParse(data);

    if (!parsedData.success) {
      return { error: "Invalid form data", details: parsedData.error.flatten().fieldErrors };
    }

    const { email, password, name } = parsedData.data;

    const supabase = await createClient();

    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      console.error("Signup error:", error);
      return { error: error.message || "Failed to create account" };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Signup exception:", error);
    return { error: `Failed to create account: ${error?.message || "Unknown error"}` };
  }
}

export async function loginUser(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      return { error: error.message || "Invalid login credentials." };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Login exception:", error);
    return { error: `Login failed: ${error?.message || "Unknown error"}` };
  }
}

export async function logoutUser() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
