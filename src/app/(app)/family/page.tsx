import { getFamily, createFamily } from "@/app/actions/family.actions";
import { Users, Plus, Mail } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function FamilyPage() {
  const family = await getFamily();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Family Sharing</h1>
          <p className="text-neutral-400 mt-1">Share reminders and subscriptions with your household.</p>
        </div>
      </div>

      {!family ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center max-w-md mx-auto mt-12">
          <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Create a Family Group</h2>
          <p className="text-neutral-400 text-sm mb-8">
            Create a family group to start sharing life administration tasks with your partner or household members.
          </p>
          <form action={async (formData) => {
            "use server";
            await createFamily(formData.get("name") as string);
          }}>
            <div className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">Family Name</label>
                <input required name="name" type="text" placeholder="The Smiths" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500" />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white rounded-lg py-2.5 font-medium hover:bg-indigo-500 transition-colors">
                Create Group
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              {family.name}
            </h2>
            <div className="space-y-4">
              {family.members.map(member => (
                <div key={member.id} className="flex items-center gap-4 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-medium text-white">
                    {member.name?.charAt(0) || member.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-neutral-200">{member.name || "Unknown"}</p>
                    <p className="text-sm text-neutral-500">{member.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 h-fit">
            <h2 className="text-lg font-semibold text-white mb-6">Invite Member</h2>
            <form className="space-y-4" action={async () => { "use server"; console.log("Invite sent"); }}>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input required type="email" placeholder="partner@example.com" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <button type="button" className="w-full bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg py-2.5 font-medium transition-colors">
                Send Invitation
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
