"use client";

import { useState } from "react";
import { createReminder } from "@/app/actions/reminder.actions";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function NewReminderPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      notes: formData.get("notes") || null,
      dueDate: new Date(formData.get("dueDate") as string).toISOString(),
      category: formData.get("category"),
      priority: formData.get("priority"),
    };

    await createReminder(data);
    router.push("/reminders");
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <Link href="/reminders" className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to reminders
      </Link>
      
      <div>
        <h1 className="text-3xl font-bold text-white">New Reminder</h1>
        <p className="text-neutral-400 mt-1">Create a new task or deadline.</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Title</label>
            <input 
              required
              name="title"
              type="text" 
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Pay electricity bill"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Due Date</label>
              <input 
                required
                name="dueDate"
                type="datetime-local" 
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 [color-scheme:dark]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Category</label>
              <select 
                name="category"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="GENERAL">General</option>
                <option value="BILL">Bill</option>
                <option value="RENEWAL">Renewal</option>
                <option value="DEADLINE">Deadline</option>
                <option value="SUBSCRIPTION">Subscription</option>
                <option value="WARRANTY">Warranty</option>
                <option value="VEHICLE">Vehicle</option>
                <option value="FAMILY">Family</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Priority</label>
            <div className="flex gap-4">
              {['LOW', 'MEDIUM', 'HIGH'].map(p => (
                <label key={p} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="priority" value={p} defaultChecked={p === 'MEDIUM'} className="text-indigo-600 focus:ring-indigo-500 bg-neutral-950 border-neutral-800" />
                  <span className="text-sm text-neutral-300">{p}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Notes</label>
            <textarea 
              name="notes"
              rows={4}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Any additional details..."
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {isPending ? "Saving..." : "Save Reminder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
