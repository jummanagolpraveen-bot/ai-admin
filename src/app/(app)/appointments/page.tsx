"use client";

import { useState, useEffect } from "react";
import { getAppointments, createAppointment, deleteAppointment } from "@/app/actions/appointment.actions";
import { Plus, Trash2, Calendar as CalendarIcon, MapPin, AlignLeft } from "lucide-react";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    setLoading(true);
    try {
      const data = await getAppointments();
      setAppointments(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    await createAppointment(data);
    setIsAdding(false);
    loadAppointments();
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    await deleteAppointment(id);
    loadAppointments();
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Appointments</h1>
          <p className="text-neutral-400">Schedule and keep track of your upcoming events.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl transition-all font-medium"
        >
          <Plus className="w-4 h-4" />
          {isAdding ? "Cancel" : "Add Appointment"}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreate} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-8 space-y-4 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Title / Event Name</label>
              <input name="title" required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-sky-500 outline-none" placeholder="e.g. Dentist Appointment" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Date & Time</label>
              <input name="appointmentDate" type="datetime-local" required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-sky-500 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-300 mb-1">Location</label>
              <input name="location" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-sky-500 outline-none" placeholder="Where is it happening?" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-300 mb-1">Notes</label>
              <textarea name="notes" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-sky-500 outline-none" placeholder="Any extra info..." rows={3}></textarea>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button type="submit" className="px-6 py-2 bg-sky-600 hover:bg-sky-500 text-white font-medium rounded-xl transition-colors">Save Appointment</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12 text-neutral-500">Loading schedule...</div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-24 bg-neutral-900/50 rounded-2xl border border-neutral-800 border-dashed">
          <div className="w-16 h-16 bg-neutral-800 text-neutral-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarIcon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No upcoming appointments</h3>
          <p className="text-neutral-400">Your schedule is clear! Add an event when you're ready.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {appointments.map(app => (
            <div key={app.id} className="flex flex-col bg-neutral-900 border border-neutral-800 p-5 rounded-2xl hover:border-sky-500/50 transition-all">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-medium text-white">{app.title}</h3>
                <button onClick={() => handleDelete(app.id)} className="p-2 -mr-2 -mt-2 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-2 mt-auto">
                <div className="flex items-center gap-2 text-sm text-sky-400 font-medium bg-sky-500/10 px-3 py-2 rounded-lg w-fit">
                  <CalendarIcon className="w-4 h-4" />
                  {new Date(app.appointmentDate).toLocaleString(undefined, { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </div>
                
                {app.location && (
                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{app.location}</span>
                  </div>
                )}
                
                {app.notes && (
                  <div className="flex items-start gap-2 text-sm text-neutral-500 mt-2">
                    <AlignLeft className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p className="line-clamp-2">{app.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
