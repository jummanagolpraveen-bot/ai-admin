import { getSubscriptions, deleteSubscription } from "@/app/actions/subscription.actions";
import { CreditCard, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default async function SubscriptionsPage() {
  const subscriptions = await getSubscriptions();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Subscriptions</h1>
          <p className="text-neutral-400 mt-1">Manage recurring billing and trials.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Add Subscription
        </button>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-neutral-400">
          <thead className="bg-neutral-950/50 text-xs uppercase font-semibold text-neutral-500">
            <tr>
              <th className="px-6 py-4">Service Name</th>
              <th className="px-6 py-4">Cost</th>
              <th className="px-6 py-4">Billing Cycle</th>
              <th className="px-6 py-4">Next Billing Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {subscriptions.map((sub) => (
              <tr key={sub.id} className="hover:bg-neutral-800/50 transition-colors">
                <td className="px-6 py-4 font-medium text-neutral-200 flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  {sub.name}
                </td>
                <td className="px-6 py-4">${sub.cost.toFixed(2)}</td>
                <td className="px-6 py-4 capitalize">{sub.billingCycle}</td>
                <td className="px-6 py-4">{format(new Date(sub.nextBillingDate), "MMM d, yyyy")}</td>
                <td className="px-6 py-4 text-right">
                  <form action={async () => {
                    "use server";
                    await deleteSubscription(sub.id);
                  }}>
                    <button className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {subscriptions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                  No active subscriptions tracked.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
