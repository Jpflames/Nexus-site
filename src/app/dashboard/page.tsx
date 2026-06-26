import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, FileText, GraduationCap, MessageSquareText, ShieldCheck, Sparkles, Lock, Unlock } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { getFirebaseFirestore } from "@/lib/firebase-admin";
import { getAuthenticatedUser } from "@/lib/firebase-session";
import { getActivePurchase, getUnlockedPhaseSlugs } from "@/lib/payments";
import { phases } from "@/lib/nea";

export const metadata = {
  title: "Dashboard | Nexus Media Student Portal",
  description: "Your Nexus Media student dashboard with progress tracking, enrolled phases, deadlines, and mentor feedback.",
  openGraph: {
    title: "Nexus Media Dashboard",
    description: "Your Nexus Media student dashboard with progress tracking, enrolled phases, deadlines, and mentor feedback.",
  },
};

const deadlines = [
  { title: "Phase 2 project review", date: "May 24" },
  { title: "Interview prep session", date: "May 28" },
  { title: "Phase 3 application review", date: "June 2" },
];

const nextSteps = [
  { title: "Review your enrolled phase", description: "Open the lessons that are already unlocked for you and start your first task." },
  { title: "Join the live cohort", description: "Keep an eye on the upcoming live session and be ready with your questions." },
  { title: "Share your progress", description: "Send updates to the mentor desk so your growth stays visible and supported." },
];

export default async function DashboardPage() {
  const session = await getAuthenticatedUser();
  const firestore = getFirebaseFirestore();

  if (!session) {
    redirect("/login");
  }

  let unlockedPhaseSlugs: string[] = [];
  let purchase: any = null;
  let hasPurchasedAny = false;
  let dbError = null;

  try {
    unlockedPhaseSlugs = firestore ? await getUnlockedPhaseSlugs(firestore, session.uid) : [];
    purchase = firestore ? await getActivePurchase(firestore, session.uid) : null;
    hasPurchasedAny = unlockedPhaseSlugs.length > 0 || Boolean(purchase);
  } catch (error) {
    console.error("Failed to query Firestore data for dashboard:", error);
    dbError = error instanceof Error ? error.message : String(error);
  }

  if (dbError) {
    return (
      <main className="nexus-page-glow pb-24 pt-20">
        <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-[2rem] border border-red-500/20 bg-black/70 p-10 shadow-[0_40px_120px_rgba(239,68,68,0.14)] text-center">
            <h2 className="font-display text-3xl font-semibold text-white">Database Connection Error</h2>
            <p className="mt-4 text-slate-300">
              The application encountered an error while trying to connect to Google Cloud Firestore:
            </p>
            <div className="mt-4 rounded-xl bg-red-950/40 border border-red-500/30 p-4 text-left font-mono text-sm text-red-300 overflow-x-auto">
              {dbError}
            </div>
            <p className="mt-6 text-sm text-slate-400">
              This typically means the Firestore Database has not been created/enabled yet in the Firebase Console for your project <strong>nexus-media-global</strong>.
            </p>
            <div className="mt-6 text-left max-w-md mx-auto">
              <p className="text-sm font-semibold text-white">How to fix this:</p>
              <ol className="mt-3 text-sm text-slate-300 list-decimal list-inside space-y-2">
                <li>Open the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline font-semibold hover:text-cyan-200">Firebase Console</a>.</li>
                <li>Select your project <strong>nexus-media-global</strong>.</li>
                <li>Go to <strong>Build &gt; Firestore Database</strong> in the left sidebar.</li>
                <li>Click <strong>Create database</strong> and follow the prompts (select default database ID, choose database location, and start in production or test mode).</li>
              </ol>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!hasPurchasedAny) {
    redirect("/checkout");
  }

  const learnerPhases = phases.map((phase, index) => {
    const isUnlocked = unlockedPhaseSlugs.includes(phase.slug);
    return {
      ...phase,
      isUnlocked,
      progress: isUnlocked ? (index === 0 ? 85 : index === 1 ? 40 : 10) : 0,
      status: isUnlocked ? "Unlocked" : phase.premium ? "Premium" : "Locked",
    };
  });

  const firstUnlockedPhase = learnerPhases.find((phase) => phase.isUnlocked);
  const displayName = session.name?.split(" ")[0] || "learner";

  return (
    <main className="nexus-page-glow pb-24 pt-20">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="rounded-[2rem] border border-white/10 bg-black/70 p-10 shadow-[0_40px_120px_rgba(16,185,129,0.14)]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">Student dashboard</p>
                <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Welcome back, {displayName}. Your learning portal is ready.
                </h1>
                <p className="mt-4 text-base leading-8 text-slate-300">
                  Your paid access unlocks the next steps of your acceleration journey with live support, milestone tracking, and curated phase content.
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-cyan-400/20 bg-cyan-400/10 p-5 text-sm text-cyan-100">
                <p className="font-semibold text-white">Access status</p>
                <p className="mt-2">Payment confirmed. Your dashboard is now live for your enrolled phase.</p>
                <Link href="/profile" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition hover:text-cyan-200">
                  Review profile <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="mx-auto mt-12 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <FadeIn>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { title: "Unlocked Phases", value: `${unlockedPhaseSlugs.length} / ${phases.length}`, icon: Sparkles },
                  { title: "Enrollment Plan", value: purchase?.plan || "Active access", icon: FileText },
                  { title: "Account Status", value: "Verified learner", icon: ShieldCheck },
                  { title: "Next Focus", value: firstUnlockedPhase?.title || "Complete enrollment", icon: GraduationCap },
                ].map((stat) => (
                  <div key={stat.title} className="glass-card rounded-[2rem] border border-white/10 p-6">
                    <div className="flex items-center gap-3 text-cyan-300">
                      <stat.icon className="h-5 w-5" />
                      <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">{stat.title}</p>
                    </div>
                    <p className="mt-5 text-2xl font-semibold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <div className="glass-card rounded-[2rem] border border-white/10 p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">Your learning plan</p>
                    <h2 className="mt-3 text-2xl font-semibold text-white">What to do next</h2>
                  </div>
                  <span className="inline-flex rounded-full bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.26em] text-slate-300">Paid learner</span>
                </div>
                <div className="mt-6 space-y-4">
                  {nextSteps.map((step) => (
                    <div key={step.title} className="rounded-[1.5rem] border border-white/10 bg-black/40 p-5">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 rounded-full bg-cyan-400/10 p-2 text-cyan-300">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{step.title}</p>
                          <p className="mt-2 text-sm leading-7 text-slate-400">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="glass-card rounded-[2rem] border border-white/10 p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">Acceleration phases</p>
                    <h2 className="mt-3 text-2xl font-semibold text-white">Your syllabus access</h2>
                  </div>
                  <span className="inline-flex rounded-full bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.26em] text-slate-300">Cohort 2026</span>
                </div>
                <div className="mt-8 space-y-5">
                  {learnerPhases.map((phase) => (
                    <div key={phase.slug} className={`rounded-[1.75rem] border p-5 transition ${phase.isUnlocked ? "border-emerald-500/20 bg-emerald-950/5" : "border-white/10 bg-black/40"}`}>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">{phase.label}</span>
                            {phase.isUnlocked ? <Unlock className="h-4 w-4 text-emerald-400" /> : <Lock className="h-4 w-4 text-slate-400" />}
                          </div>
                          <p className="mt-2 text-lg font-semibold text-white">{phase.title}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${phase.isUnlocked ? "bg-emerald-500/10 text-emerald-300" : "bg-slate-800 text-slate-400"}`}>
                            {phase.status}
                          </span>
                          <Link
                            href={`/courses/${phase.slug}`}
                            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${phase.isUnlocked ? "bg-cyan-400 text-black hover:bg-cyan-300" : "border border-white/10 bg-white/5 text-white hover:bg-white/10"}`}
                          >
                            {phase.isUnlocked ? "Open course" : "Unlock phase"}
                          </Link>
                        </div>
                      </div>
                      {phase.isUnlocked && (
                        <>
                          <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/5">
                            <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" style={{ width: `${phase.progress}%` }} />
                          </div>
                          <p className="mt-3 text-xs text-slate-400">Cohort progression status: {phase.progress}% completed</p>
                        </>
                      )}
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
                  <MessageSquareText className="h-5 w-5" />
                  <p className="text-sm uppercase tracking-[0.28em]">Mentor support</p>
                </div>
                <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-black/40 p-6">
                  <p className="text-sm leading-7 text-slate-400">
                    Your mentor desk is ready to help you refine your work, answer questions, and keep your cohort momentum strong.
                  </p>
                  <div className="mt-6 space-y-4 text-sm text-slate-300">
                    <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-cyan-300" /> Weekly feedback windows are now active.</p>
                    <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-cyan-300" /> Cohort sessions are scheduled for the next available slot.</p>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <div className="glass-card rounded-[2rem] border border-white/10 p-8">
                <div className="flex items-center gap-3 text-cyan-300">
                  <CheckCircle2 className="h-5 w-5" />
                  <p className="text-sm uppercase tracking-[0.28em]">Certificate path</p>
                </div>
                <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-black/40 p-6">
                  <p className="text-sm text-slate-400">Once your acceleration path is complete, you will receive a verified Nexus Media certificate and a portfolio-ready summary.</p>
                  <div className="mt-6 space-y-4 text-sm text-slate-300">
                    <p>• Verified skill endorsement.</p>
                    <p>• Cohort completion badge.</p>
                    <p>• Showcase-ready certificate asset.</p>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="glass-card rounded-[2rem] border border-white/10 p-8">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">Upcoming milestones</p>
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
