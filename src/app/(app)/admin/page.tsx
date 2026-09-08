import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user?.user_metadata?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-4">Admin Dashboard (Phase 5)</h1>
      <p className="text-neutral-400">System-wide metrics and user management.</p>
    </div>
  );
}
