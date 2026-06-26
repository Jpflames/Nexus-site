import Link from "next/link";
import { getFirebaseFirestore } from "@/lib/firebase-admin";
import { verifyPaystackTransaction } from "@/lib/paystack";
import { markPaymentComplete } from "@/lib/payments";
import { getPaymentPlan } from "@/lib/payment-plans";

export const metadata = {
  title: "Payment Success | Nexus Media",
  description: "Your Nexus Media enrollment payment was successful. Access your dashboard and begin your career acceleration journey.",
};

type SuccessPageProps = {
  searchParams?: Promise<{
    reference?: string;
    trxref?: string;
    plan?: string;
    provider?: string;
  }>;
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const reference = params?.reference || params?.trxref;
  const selectedPlan = params?.plan ? getPaymentPlan(params.plan) : null;
  let confirmationMessage = reference
    ? "We are checking your payment confirmation with Paystack."
    : "Your payment response was received. If you completed payment, confirmation may still be processing.";

  if (reference) {
    try {
      const transaction = await verifyPaystackTransaction(reference);
      if (transaction.status === "success" && transaction.reference) {
        const firestore = getFirebaseFirestore();
        await markPaymentComplete(firestore, transaction.reference, transaction.metadata || null);
        confirmationMessage = selectedPlan
          ? `Your payment for ${selectedPlan.title} is confirmed. Published admin-uploaded courses for that phase are now unlocked.`
          : "Your payment is confirmed. Published admin-uploaded courses for your paid phase are now unlocked.";
      } else {
        confirmationMessage = "Paystack has not confirmed this payment yet. Once it is successful, your paid phase courses will unlock automatically.";
      }
    } catch {
      confirmationMessage =
        "Your payment was received. If your courses are not visible yet, Paystack confirmation may still be processing.";
    }
  }

  const phaseHref = selectedPlan?.phaseSlugs.length === 1 ? `/courses/${selectedPlan.phaseSlugs[0]}` : "/courses";

  return (
    <main className="nexus-page-glow min-h-[calc(100vh-6rem)] py-24">
      <section className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="glass-card rounded-[2rem] border border-white/10 bg-black/70 p-12 shadow-[0_40px_120px_rgba(16,185,129,0.14)]">
          <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">Payment complete</p>
          <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">You&apos;re officially enrolled.</h1>
          <p className="mt-6 text-base leading-8 text-slate-300">{confirmationMessage}</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href={phaseHref} className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-8 py-3.5 text-sm font-semibold text-black transition hover:bg-cyan-300">
              View unlocked courses
            </Link>
            <Link href="/dashboard" className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-white/10">
              View dashboard
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
