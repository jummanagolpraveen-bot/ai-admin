import { getTasks, toggleTaskStatus } from "@/app/actions/task.actions";
import { getReminders, toggleReminderStatus } from "@/app/actions/reminder.actions";
import { getBills, toggleBillStatus } from "@/app/actions/bill.actions";
import { getAppointments } from "@/app/actions/appointment.actions";
import { Calendar, ListTodo, Receipt, Clock, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

export default async function DashboardPage() {
  const tasks = await getTasks();
  const reminders = await getReminders();
  const bills = await getBills();
  const appointments = await getAppointments();

  const pendingTasks = tasks.filter((t: any) => !t.completed).slice(0, 5);
  const pendingReminders = reminders.filter((r: any) => r.status === 'ACTIVE').slice(0, 5);
  const unpaidBills = bills.filter((b: any) => !b.isPaid).slice(0, 5);
  const upcomingAppointments = appointments.slice(0, 5); // Assumes already sorted ascending

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Bucket title="Tasks" items={pendingTasks} icon={ListTodo} color="text-indigo-400" type="task" />
        <Bucket title="Reminders" items={pendingReminders} icon={Clock} color="text-amber-400" type="reminder" />
        <Bucket title="Bills" items={unpaidBills} icon={Receipt} color="text-emerald-400" type="bill" />
        <Bucket title="Appointments" items={upcomingAppointments} icon={Calendar} color="text-sky-400" type="appointment" />
      </div>
    </div>
  );
}

function Bucket({ title, items, icon: Icon, color, type }: any) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col h-[450px]">
      <div className="flex items-center gap-3 mb-6">
        <Icon className={`w-6 h-6 ${color}`} />
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <span className="ml-auto bg-neutral-800 text-neutral-300 px-2.5 py-0.5 rounded-full text-xs font-medium">
          {items.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
        {items.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-neutral-500 text-center px-4">
            No pending items. You're all caught up!
          </div>
        ) : (
          items.map((item: any) => (
            <div key={item.id} className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors group relative">
              <div className="flex gap-3">
                {type !== 'appointment' && (
                  <form action={async () => {
                    "use server";
                    if (type === 'task') await toggleTaskStatus(item.id, item.completed);
                    if (type === 'reminder') await toggleReminderStatus(item.id, item.status);
                    if (type === 'bill') await toggleBillStatus(item.id, item.isPaid);
                  }}>
                    <button className="mt-0.5 w-5 h-5 rounded-full border-2 border-neutral-600 hover:border-indigo-400 hover:bg-indigo-500/10 flex items-center justify-center transition-colors">
                    </button>
                  </form>
                )}
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-200 truncate">{item.title || item.name}</p>
                  
                  {type === 'bill' && (
                    <p className="text-xs text-emerald-400 mt-1 font-semibold">
                      ${parseFloat(item.amount).toFixed(2)}
                    </p>
                  )}
                  
                  {(item.dueDate || item.appointmentDate) && (
                    <p className="text-xs text-neutral-500 mt-1">
                      {format(new Date(item.dueDate || item.appointmentDate), "MMM d, yyyy h:mm a")}
                    </p>
                  )}
                  
                  {type === 'appointment' && item.location && (
                    <p className="text-xs text-neutral-500 mt-1 truncate">
                      {item.location}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
