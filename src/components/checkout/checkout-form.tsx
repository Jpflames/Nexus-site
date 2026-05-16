"use client";

import { useState } from "react";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { paymentPlans } from "@/lib/payment-plans";

export function CheckoutForm() {
  const [selectedPlan, setSelectedPlan] = useState(paymentPlans[0].title);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handlePurchase = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan, provider: "paystack" }),
      });
      const data = await response.json();
      if (data?.redirectUrl) {
        window.location.assign(data.redirectUrl);
        return;
      }
      setMessage(data?.error || "Unable to complete checkout. Please try again.");
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
      <div className="rounded-[2rem] border border-white/10 bg-black/60 p-8">
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-semibold text-white">Select your plan</h2>
            <p className="mt-3 text-sm text-slate-400">Review pricing and choose where you want to accelerate your career.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {paymentPlans.map((plan) => (
              <button
                key={plan.title}
                type="button"
                onClick={() => setSelectedPlan(plan.title)}
                className={`rounded-[1.75rem] border p-5 text-left transition ${
                  selectedPlan === plan.title
                    ? "border-cyan-400/50 bg-cyan-500/10"
                    : "border-white/10 bg-white/5 hover:border-cyan-400/20"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">{plan.title}</p>
                    <p className="mt-2 text-2xl font-semibold text-white">₦{plan.price}</p>
                  </div>
                  {plan.badge && (
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.26em] text-slate-200">{plan.badge}</span>
                  )}
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300">{plan.description}</p>
              </button>
            ))}
          </div>

          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
            <p className="font-semibold text-white">Installment plan</p>
            <p className="mt-3 leading-7">Most learners choose the phased enrollment and split the investment across secure payments. Contact support to request installment arrangements.</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-[2rem] border border-white/10 bg-black/60 p-8">
          <h2 className="font-display text-2xl font-semibold text-white">Payment provider</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Checkout is processed through Paystack for secure NGN payments and webhook-verified enrollment.
          </p>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-black/60 p-8">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">Security</p>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <p>Encrypted checkout with webhook verification and transaction status validation.</p>
            <p>Never expose secret keys in browser code or public assets.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handlePurchase}
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan-400 px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Processing…" : "Proceed to payment"}
          <ArrowRight className="h-4 w-4" />
        </button>
        {message && <p className="text-sm text-rose-400">{message}</p>}
      </div>
    </div>
  );
}
