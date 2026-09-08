import { getReminders, toggleReminderStatus } from "@/app/actions/reminder.actions";
import Link from "next/link";
import { Plus, Search, Filter } from "lucide-react";
import { format } from "date-fns";

export default async function RemindersPage() {
  const reminders = await getReminders();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">All Reminders</h1>
          <p className="text-neutral-400 mt-1">Manage your tasks, bills, and deadlines.</p>
        </div>
        <Link 
          href="/reminders/new"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Reminder
        </Link>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-neutral-800 flex gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input 
              type="text" 
              placeholder="Search reminders..." 
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm font-medium text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
        
        <table className="w-full text-left text-sm text-neutral-400">
          <thead className="bg-neutral-950/50 text-xs uppercase font-semibold text-neutral-500">
            <tr>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Due Date</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Priority</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {reminders.map((reminder) => (
              <tr key={reminder.id} className="hover:bg-neutral-800/50 transition-colors">
                <td className="px-6 py-4">
                  <form action={async () => {
                    "use server";
                    await toggleReminderStatus(reminder.id, reminder.status);
                  }}>
                    <button className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      reminder.status === 'COMPLETED' 
                        ? 'bg-indigo-500 border-indigo-500 text-white' 
                        : 'border-neutral-600 hover:border-indigo-400'
                    }`}>
                      {reminder.status === 'COMPLETED' && <div className="w-2 h-2 bg-white rounded-full" />}
                    </button>
                  </form>
                </td>
                <td className="px-6 py-4 font-medium text-neutral-200">{reminder.title}</td>
                <td className="px-6 py-4">{format(new Date(reminder.dueDate), "MMM d, yyyy")}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-neutral-800 text-neutral-300 rounded-md text-xs font-medium">
                    {reminder.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                    reminder.priority === 'HIGH' ? 'bg-red-500/10 text-red-400' :
                    reminder.priority === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-green-500/10 text-green-400'
                  }`}>
                    {reminder.priority}
                  </span>
                </td>
              </tr>
            ))}
            {reminders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                  No reminders found. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
