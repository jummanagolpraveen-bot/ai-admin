import { getReminders, toggleReminderStatus } from "@/app/actions/reminder.actions";
import { Calendar, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { isBefore, isToday, isThisWeek, format, isAfter } from "date-fns";

export default async function DashboardPage() {
  const reminders = await getReminders();

  const overdue = reminders.filter(r => r.status === 'ACTIVE' && isBefore(new Date(r.dueDate), new Date()) && !isToday(new Date(r.dueDate)));
  const today = reminders.filter(r => r.status === 'ACTIVE' && isToday(new Date(r.dueDate)));
  const thisWeek = reminders.filter(r => r.status === 'ACTIVE' && isThisWeek(new Date(r.dueDate)) && !isToday(new Date(r.dueDate)) && isAfter(new Date(r.dueDate), new Date()));
  const later = reminders.filter(r => r.status === 'ACTIVE' && !isThisWeek(new Date(r.dueDate)) && isAfter(new Date(r.dueDate), new Date()));

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Bucket title="Overdue" items={overdue} icon={AlertCircle} color="text-red-400" />
        <Bucket title="Today" items={today} icon={Clock} color="text-yellow-400" />
        <Bucket title="This Week" items={thisWeek} icon={Calendar} color="text-indigo-400" />
        <Bucket title="Later" items={later} icon={CheckCircle2} color="text-neutral-400" />
      </div>
    </div>
  );
}

function Bucket({ title, items, icon: Icon, color }: any) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col h-[400px]">
      <div className="flex items-center gap-3 mb-6">
        <Icon className={`w-5 h-5 ${color}`} />
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <span className="ml-auto bg-neutral-800 text-neutral-300 px-2.5 py-0.5 rounded-full text-xs font-medium">
          {items.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
        {items.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-neutral-500">
            No items
          </div>
        ) : (
          items.map((item: any) => (
            <div key={item.id} className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors group relative">
              <div className="flex gap-3">
                <form action={async () => {
                  "use server";
                  await toggleReminderStatus(item.id, item.status);
                }}>
                  <button className="mt-0.5 w-5 h-5 rounded-full border-2 border-neutral-600 hover:border-indigo-400 hover:bg-indigo-500/10 flex items-center justify-center transition-colors">
                  </button>
                </form>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-200 truncate">{item.title}</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {format(new Date(item.dueDate), "MMM d, yyyy")} • {item.category}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
