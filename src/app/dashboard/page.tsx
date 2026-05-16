import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, Clock3, FileText, ShieldCheck, Sparkles } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getActivePurchase } from "@/lib/payments";
import { phases } from "@/lib/nea";

export const metadata = {
  title: "Dashboard | Nexus Media Student Portal",
  description: "Your Nexus Media student dashboard with progress tracking, enrolled phases, deadlines, and mentor feedback.",
  openGraph: {
    title: "Nexus Media Dashboard",
    description: "Your Nexus Media student dashboard with progress tracking, enrolled phases, deadlines, and mentor feedback.",
  },
};

const learnerPhases = phases.map((phase, index) => ({
  ...phase,
  progress: index < 2 ? 85 - index * 20 : index === 2 ? 40 : 10,
  status: index < 2 ? "In progress" : index === 2 ? "Unlocked" : "Locked",
}));

const deadlines = [
  { title: "Phase 2 project review", date: "May 24" },
  { title: "Interview prep session", date: "May 28" },
  { title: "Phase 3 application review", date: "June 2" },
];

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const purchase = await getActivePurchase(supabase, session.user.id);
  if (!purchase) {
    redirect("/checkout");
  }

  return (
    <main className="nexus-page-glow pb-24 pt-20">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="rounded-[2rem] border border-white/10 bg-black/70 p-10 shadow-[0_40px_120px_rgba(16,185,129,0.14)]">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">Student dashboard</p>
                <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Your career acceleration command center.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
                  Track your enrolled phases, view upcoming deadlines, upload assignments, and follow mentor feedback from one polished workspace.
                </p>
              </div>
              <Link href="/profile" className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-white/10">
                View profile
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="mx-auto mt-12 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <FadeIn>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { title: "Active phases", value: "3", icon: Sparkles },
                  { title: "Lessons completed", value: "18", icon: FileText },
                  { title: "Mentor feedback", value: "5 reviews", icon: ShieldCheck },
                  { title: "Next deadline", value: "May 24", icon: Clock3 },
                ].map((stat) => (
                  <div key={stat.title} className="glass-card rounded-[2rem] border border-white/10 p-6">
                    <div className="flex items-center gap-3 text-cyan-300">
                      <stat.icon className="h-5 w-5" />
                      <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">{stat.title}</p>
                    </div>
                    <p className="mt-5 text-3xl font-semibold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <div className="glass-card rounded-[2rem] border border-white/10 p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">Enrolled phases</p>
                    <h2 className="mt-3 text-2xl font-semibold text-white">Current phase progress</h2>
                  </div>
                  <span className="inline-flex rounded-full bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.26em] text-slate-300">Live cohort</span>
                </div>
                <div className="mt-8 space-y-5">
                  {learnerPhases.map((phase) => (
                    <div key={phase.slug} className="rounded-[1.75rem] border border-white/10 bg-black/40 p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">{phase.label}</p>
                          <p className="mt-2 text-lg font-semibold text-white">{phase.title}</p>
                        </div>
                        <span className="rounded-full bg-white/5 px-3 py-1 text-sm text-slate-300">{phase.status}</span>
                      </div>
                      <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/5">
                        <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" style={{ width: `${phase.progress}%` }} />
                      </div>
                      <p className="mt-3 text-sm text-slate-400">Progress: {phase.progress}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>

          <div className="space-y-6">
            <FadeIn>
              <div className="glass-card rounded-[2rem] border border-white/10 p-8">
                <div className="flex items-center gap-3 text-cyan-300">
                  <CheckCircle2 className="h-5 w-5" />
                  <p className="text-sm uppercase tracking-[0.28em]">Certificate preview</p>
                </div>
                <div className="mt-6 rounded-[2rem] border border-white/10 bg-black/40 p-6">
                  <p className="text-sm text-slate-400">On completion, you’ll receive an Nexus Media certificate and a curated profile summary for employers.</p>
                  <div className="mt-6 space-y-4 text-sm text-slate-300">
                    <p>• Verified career skills endorsement.</p>
                    <p>• Cohort completion badge.</p>
                    <p>• Showcase-ready certificate asset.</p>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <div className="glass-card rounded-[2rem] border border-white/10 p-8">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">Upcoming deadlines</p>
                    <h2 className="mt-3 text-2xl font-semibold text-white">Keep your momentum</h2>
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  {deadlines.map((item) => (
                    <div key={item.title} className="rounded-[1.75rem] border border-white/10 bg-black/40 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-semibold text-white">{item.title}</p>
                        <span className="text-sm text-slate-400">{item.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </main>
  );
}
