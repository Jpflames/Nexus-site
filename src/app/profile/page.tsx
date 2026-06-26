import Link from "next/link";
import { Mail, User2 } from "lucide-react";
import { redirect } from "next/navigation";
import { FadeIn } from "@/components/motion/fade-in";
import { getFirebaseFirestore } from "@/lib/firebase-admin";
import { getAuthenticatedUser } from "@/lib/firebase-session";
import { getActivePurchase } from "@/lib/payments";

export const metadata = {
  title: "Profile | Nexus Media Member",
  description: "Manage your Nexus Media member profile, account details, and enrollment status.",
  openGraph: {
    title: "Nexus Media Profile",
    description: "Manage your Nexus Media member profile, account details, and enrollment status.",
  },
};

export default async function ProfilePage() {
  const session = await getAuthenticatedUser();
  const firestore = getFirebaseFirestore();

  if (!session) {
    redirect("/login");
  }

  const purchase = await getActivePurchase(firestore, session.uid);

  return (
    <main className="nexus-page-glow pb-24 pt-20">
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="glass-card rounded-[2rem] border border-white/10 bg-black/70 p-10 shadow-[0_40px_120px_rgba(16,185,129,0.14)]">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">Member profile</p>
                <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">Your Nexus Media account</h1>
                <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
                  Manage your learner profile, membership tier, and current enrollment in a secure premium interface.
                </p>
              </div>
              <Link href="/dashboard" className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-cyan-300">
                Open Dashboard
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="mx-auto mt-12 max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_0.95fr]">
          <FadeIn>
            <div className="glass-card rounded-[2rem] border border-white/10 bg-black/60 p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-500/15 text-cyan-300">
                  <User2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">Account info</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{session.email}</p>
                </div>
              </div>
              <div className="mt-8 space-y-4 text-sm text-slate-300">
                <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold text-white">Email</p>
                  <p className="mt-2">{session.email}</p>
                </div>
                <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold text-white">Membership status</p>
                  <p className="mt-2 text-cyan-300">{purchase ? "Active learner" : "Pending enrollment"}</p>
                </div>
                <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold text-white">Current enrollment</p>
                  <p className="mt-2">{purchase ? purchase.plan : "No paid access yet"}</p>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <div className="glass-card rounded-[2rem] border border-white/10 bg-black/60 p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-500/15 text-cyan-300">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">Support access</p>
                  <p className="mt-2 text-2xl font-semibold text-white">Priority support</p>
                </div>
              </div>
              <div className="mt-8 space-y-4 text-sm leading-7 text-slate-300">
                <p>Your account includes preference-based support, quick response for mentor questions, and enrollment updates from the Nexus Media team.</p>
                <p className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">Need help with your payment or resume? Visit the dashboard support panel for direct assistance.</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
