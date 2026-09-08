"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signupSchema } from "@/lib/validations/auth";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function signupUser(formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const parsedData = signupSchema.safeParse(data);

    if (!parsedData.success) {
      return { error: "Invalid form data", details: parsedData.error.flatten().fieldErrors };
    }

    const { email, password, name } = parsedData.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "User already exists with this email" };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Signup error:", error);
    return { error: `Failed to create account: ${error?.message || "Unknown error"}` };
  }
}

export async function loginUser(formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    await signIn("credentials", { ...data, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." }
        default:
          return { error: "Something went wrong." }
      }
    }
    throw error;
  }
}
