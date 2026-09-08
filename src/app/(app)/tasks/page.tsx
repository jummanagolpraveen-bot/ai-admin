"use client";

import { useState, useEffect } from "react";
import { getTasks, createTask, toggleTaskStatus, deleteTask } from "@/app/actions/task.actions";
import { Plus, Trash2, CheckCircle, Circle, AlertCircle, Calendar } from "lucide-react";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    await createTask(data);
    setIsAdding(false);
    loadTasks();
  }

  async function handleToggle(id: string, currentStatus: boolean) {
    await toggleTaskStatus(id, currentStatus);
    loadTasks();
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    await deleteTask(id);
    loadTasks();
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Tasks</h1>
          <p className="text-neutral-400">Manage your daily action items and priorities.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all font-medium"
        >
          <Plus className="w-4 h-4" />
          {isAdding ? "Cancel" : "Add Task"}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreate} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-8 space-y-4 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Title</label>
              <input name="title" required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Task title..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Due Date</label>
              <input name="dueDate" type="datetime-local" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-300 mb-1">Description</label>
              <textarea name="description" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Task description..." rows={3}></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Priority</label>
              <select name="priority" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors">Save Task</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12 text-neutral-500">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-24 bg-neutral-900/50 rounded-2xl border border-neutral-800 border-dashed">
          <div className="w-16 h-16 bg-neutral-800 text-neutral-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No tasks found</h3>
          <p className="text-neutral-400">You're all caught up! Add a task to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task.id} className={`flex items-start gap-4 bg-neutral-900 border border-neutral-800 p-5 rounded-2xl transition-all ${task.completed ? 'opacity-60' : 'hover:border-indigo-500/50'}`}>
              <button onClick={() => handleToggle(task.id, task.completed)} className="mt-1 flex-shrink-0">
                {task.completed ? (
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                ) : (
                  <Circle className="w-6 h-6 text-neutral-500 hover:text-indigo-400 transition-colors" />
                )}
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className={`text-lg font-medium ${task.completed ? 'text-neutral-400 line-through' : 'text-white'}`}>
                    {task.title}
                  </h3>
                  {task.priority === 'high' && !task.completed && (
                    <span className="flex items-center gap-1 text-xs font-medium text-rose-400 bg-rose-500/10 px-2 py-1 rounded-full">
                      <AlertCircle className="w-3 h-3" /> High
                    </span>
                  )}
                </div>
                {task.description && (
                  <p className="text-sm text-neutral-400 mb-3">{task.description}</p>
                )}
                {task.dueDate && (
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(task.dueDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                  </div>
                )}
              </div>

              <button onClick={() => handleDelete(task.id)} className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
