import Link from "next/link";
import { ArrowRight, Bot, ShieldCheck, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-indigo-500/30">
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-neutral-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            LifePilot AI
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/pricing" className="text-sm text-neutral-400 hover:text-white transition-colors">Pricing</Link>
            <Link href="/login" className="text-sm font-medium hover:text-indigo-400 transition-colors">Sign in</Link>
            <Link href="/signup" className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-neutral-200 transition-colors">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center mt-16">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
              Your life, <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">perfectly orchestrated.</span>
            </h1>
            <p className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              LifePilot AI automatically extracts deadlines from your documents, tracks your subscriptions, and schedules reminders so you never drop the ball again.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-full font-medium hover:bg-indigo-500 transition-all hover:scale-105">
                Start for free <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 px-6 bg-neutral-900/30 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12">
              <FeatureCard 
                icon={<Bot />}
                title="AI Intelligence"
                description="Just upload a bill or forward an email. Our AI instantly extracts due dates, amounts, and vendor details."
              />
              <FeatureCard 
                icon={<ShieldCheck />}
                title="Total Organization"
                description="Manage your vehicles, family subscriptions, home warranties, and daily tasks in one unified dashboard."
              />
              <FeatureCard 
                icon={<Zap />}
                title="Proactive Alerts"
                description="Get notified before a trial expires, a warranty ends, or a bill is due. Save money and avoid late fees."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-neutral-500 text-sm">
            © 2026 LifePilot AI. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-neutral-500 hover:text-white">Privacy</Link>
            <Link href="/terms" className="text-sm text-neutral-500 hover:text-white">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <div className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-3xl">
      <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-neutral-400 leading-relaxed">{description}</p>
    </div>
  )
}
