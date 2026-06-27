import { redirect } from "next/navigation";
import { FadeIn } from "@/components/motion/fade-in";
import { Sparkles, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getAuthenticatedUser } from "@/lib/firebase-session";
import { getFirebaseFirestore } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

type CheckoutPageProps = {
  searchParams?: Promise<{
    courseId?: string;
    phaseId?: string;
  }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const session = await getAuthenticatedUser();
  if (!session) {
    redirect("/login");
  }

  const params = await searchParams;
  const courseId = params?.courseId;
  const phaseId = params?.phaseId;

  if (!courseId || !phaseId) {
    redirect("/courses");
  }

  const firestore = getFirebaseFirestore();
  if (!firestore) {
    return (
      <div className="text-center py-20 text-slate-400">
        Firebase configuration is missing on the server.
      </div>
    );
  }

  // Fetch course and phase to verify
  let course: any = null;
  let phase: any = null;

  try {
    const courseSnap = await firestore.collection("courses").doc(courseId).get();
    if (!courseSnap.exists) {
      redirect("/courses");
    }
    course = { id: courseSnap.id, ...courseSnap.data() };

    const phaseSnap = await firestore
      .collection("courses")
      .doc(courseId)
      .collection("phases")
      .doc(phaseId)
      .get();

    if (!phaseSnap.exists) {
      redirect(`/courses/${courseId}`);
    }
    phase = { id: phaseSnap.id, ...phaseSnap.data() };
  } catch (error) {
    console.error("Error loading checkout details:", error);
    redirect("/courses");
  }

  return (
    <main className="nexus-page-glow pb-24 pt-12">
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href={`/courses/${courseId}`}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to course phases
          </Link>
        </div>

        <FadeIn>
          <div className="glass-card rounded-[2rem] border border-white/10 bg-black/70 p-8 sm:p-10 shadow-[0_40px_120px_rgba(16,185,129,0.14)]">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-cyan-200">
                  <Sparkles className="h-4 w-4" /> Secure checkout
                </span>
                <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Unlock Your Learning Phase
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-slate-300">
                  Confirm your details, complete payment with Paystack, and unlock the next segment of your training curriculum instantly.
                </p>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-black/40 p-6 space-y-4">
                <div className="flex items-center gap-3 text-cyan-300">
                  <ShieldCheck className="h-5 w-5" />
                  <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Payment Guarantee</h2>
                </div>
                <p className="text-xs leading-relaxed text-slate-400">
                  All transactions are encrypted and secured. Your access is linked directly to your portal profile immediately after confirmation.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="mx-auto mt-12 max-w-5xl px-4 sm:px-6 lg:px-8">
        <CheckoutForm course={course} phase={phase} />
      </section>
    </main>
  );
}
