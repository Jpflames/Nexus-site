import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { FadeIn } from "@/components/motion/fade-in";
import { Sparkles } from "lucide-react";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getAuthenticatedUser } from "@/lib/firebase-session";

export const metadata: Metadata = {
  title: "Checkout | Nexus Media Enrollment",
  description: "Secure checkout for Nexus Media enrollment with Paystack integration.",
  openGraph: {
    title: "Nexus Media Checkout",
    description: "Secure checkout for Nexus Media enrollment with Paystack integration.",
  },
};

export default async function CheckoutPage() {
  const session = await getAuthenticatedUser();

  if (!session) {
    redirect("/signup");
  }

  return (
    <main className="nexus-page-glow pb-24 pt-20">
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="glass-card rounded-[2rem] border border-white/10 bg-black/70 p-10 shadow-[0_40px_120px_rgba(16,185,129,0.14)]">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_0.6fr] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-cyan-200">
                  <Sparkles className="h-4 w-4" /> Secure checkout
                </span>
                <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Enroll in the Nexus Media accelerator with secure payment.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
                  Choose the plan that fits your career journey and complete checkout with Paystack.
                </p>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-black/40 p-6">
                <h2 className="text-sm font-semibold uppercase tracking-[0.26em] text-cyan-300/80">Payment details</h2>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  Payments are processed through Paystack and validated with server-side webhooks.
                </p>
                <div className="mt-6 space-y-3 text-sm text-slate-300">
                  <p>All checkout processing happens on the server.</p>
                  <p>No secret keys are exposed in the browser.</p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="mx-auto mt-12 max-w-5xl px-4 sm:px-6 lg:px-8">
        <CheckoutForm />
      </section>
    </main>
  );
}
