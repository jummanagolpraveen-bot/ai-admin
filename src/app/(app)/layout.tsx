import { createClient } from "@/utils/supabase/server";
import { logoutUser } from "@/app/actions/auth.actions";
import Link from "next/link";
import { redirect } from "next/navigation";
import { 
  LayoutDashboard, 
  ListTodo, 
  FileText, 
  CreditCard, 
  ShieldCheck, 
  Car, 
  Users, 
  Settings,
  LogOut
} from "lucide-react";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col fixed inset-y-0 left-0">
        <div className="p-6 border-b border-neutral-800">
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            LifePilot AI
          </h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem href="/reminders" icon={ListTodo} label="Reminders" />
          <NavItem href="/documents" icon={FileText} label="Documents" />
          
          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Life Areas</p>
          </div>
          <NavItem href="/subscriptions" icon={CreditCard} label="Subscriptions" />
          <NavItem href="/warranties" icon={ShieldCheck} label="Warranties" />
          <NavItem href="/vehicles" icon={Car} label="Vehicles" />
          <NavItem href="/family" icon={Users} label="Family Sharing" />
          
          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">System</p>
          </div>
          <NavItem href="/settings" icon={Settings} label="Settings" />
        </nav>

        <div className="p-4 border-t border-neutral-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-medium">
              {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user.user_metadata?.full_name || "User"}</p>
              <p className="text-xs text-neutral-400 truncate">{user.email}</p>
            </div>
          </div>
          <form action={async () => {
            "use server";
            await logoutUser();
            redirect("/login");
          }}>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-400 rounded-lg hover:text-white hover:bg-neutral-800 transition-colors">
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}

function NavItem({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  return (
    <Link 
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all"
    >
      <Icon className="w-5 h-5 text-neutral-400" />
      {label}
    </Link>
  );
}
