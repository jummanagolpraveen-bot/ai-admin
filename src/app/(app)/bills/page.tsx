"use client";

import { useState, useEffect } from "react";
import { getBills, createBill, toggleBillStatus, deleteBill } from "@/app/actions/bill.actions";
import { Plus, Trash2, CheckCircle, Circle, DollarSign, Calendar } from "lucide-react";

export default function BillsPage() {
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadBills();
  }, []);

  async function loadBills() {
    setLoading(true);
    try {
      const data = await getBills();
      setBills(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    await createBill(data);
    setIsAdding(false);
    loadBills();
  }

  async function handleToggle(id: string, currentStatus: boolean) {
    await toggleBillStatus(id, currentStatus);
    loadBills();
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this bill?")) return;
    await deleteBill(id);
    loadBills();
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Bills</h1>
          <p className="text-neutral-400">Track and manage your upcoming payments.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all font-medium"
        >
          <Plus className="w-4 h-4" />
          {isAdding ? "Cancel" : "Add Bill"}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreate} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-8 space-y-4 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Bill Name</label>
              <input name="name" required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. Electricity, Internet..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Amount ($)</label>
              <input name="amount" type="number" step="0.01" required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Due Date</label>
              <input name="dueDate" type="datetime-local" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button type="submit" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-colors">Save Bill</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12 text-neutral-500">Loading bills...</div>
      ) : bills.length === 0 ? (
        <div className="text-center py-24 bg-neutral-900/50 rounded-2xl border border-neutral-800 border-dashed">
          <div className="w-16 h-16 bg-neutral-800 text-neutral-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No bills found</h3>
          <p className="text-neutral-400">You're all caught up! Add a bill to track your expenses.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bills.map(bill => (
            <div key={bill.id} className={`flex items-start gap-4 bg-neutral-900 border border-neutral-800 p-5 rounded-2xl transition-all ${bill.isPaid ? 'opacity-60' : 'hover:border-emerald-500/50'}`}>
              <button onClick={() => handleToggle(bill.id, bill.isPaid)} className="mt-1 flex-shrink-0">
                {bill.isPaid ? (
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                ) : (
                  <Circle className="w-6 h-6 text-neutral-500 hover:text-emerald-400 transition-colors" />
                )}
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className={`text-lg font-medium ${bill.isPaid ? 'text-neutral-400 line-through' : 'text-white'}`}>
                    {bill.name}
                  </h3>
                  <span className={`flex items-center gap-1 text-sm font-bold ${bill.isPaid ? 'text-neutral-500' : 'text-emerald-400'}`}>
                    ${parseFloat(bill.amount).toFixed(2)}
                  </span>
                </div>
                {bill.dueDate && (
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    Due: {new Date(bill.dueDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                )}
              </div>

              <button onClick={() => handleDelete(bill.id)} className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
