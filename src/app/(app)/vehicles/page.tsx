import { getVehicles, deleteVehicle } from "@/app/actions/vehicle.actions";
import { Car, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";

export default async function VehiclesPage() {
  const vehicles = await getVehicles();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Vehicles</h1>
          <p className="text-neutral-400 mt-1">Manage vehicle maintenance and services.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Add Vehicle
        </button>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-neutral-400">
          <thead className="bg-neutral-950/50 text-xs uppercase font-semibold text-neutral-500">
            <tr>
              <th className="px-6 py-4">Vehicle</th>
              <th className="px-6 py-4">Year</th>
              <th className="px-6 py-4">Next Service Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-neutral-800/50 transition-colors">
                <td className="px-6 py-4 font-medium text-neutral-200 flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Car className="w-4 h-4" />
                  </div>
                  {vehicle.make} {vehicle.model}
                </td>
                <td className="px-6 py-4">{vehicle.year}</td>
                <td className="px-6 py-4">
                  {vehicle.nextServiceDate ? format(new Date(vehicle.nextServiceDate), "MMM d, yyyy") : <span className="text-neutral-600">Not set</span>}
                </td>
                <td className="px-6 py-4 text-right">
                  <form action={async () => {
                    "use server";
                    await deleteVehicle(vehicle.id);
                  }}>
                    <button className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {vehicles.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                  No vehicles tracked.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
