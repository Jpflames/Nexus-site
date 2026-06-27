"use client";

import { useState } from "react";
import { ArrowRight, CreditCard, Sparkles } from "lucide-react";

interface CheckoutFormProps {
  course: {
    id: string;
    title: string;
    description?: string;
  };
  phase: {
    id: string;
    title: string;
    price: number;
    duration?: string;
  };
}

export function CheckoutForm({ course, phase }: CheckoutFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handlePurchase = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course.id,
          phaseId: phase.id,
          provider: "paystack",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to initialize payment.");
      }

      if (data?.redirectUrl) {
        window.location.assign(data.redirectUrl);
        return;
      }
      
      throw new Error("Invalid response from payment server.");
    } catch (error) {
      console.error("Checkout error:", error);
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
      {/* Receipt Info */}
      <div className="rounded-[2rem] border border-white/10 bg-black/60 p-8 space-y-6">
        <div>
          <h2 className="font-display text-2xl font-semibold text-white">Review Selection</h2>
          <p className="mt-2 text-sm text-slate-400">Please review your selected learning course and phase.</p>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 space-y-4">
          <div className="flex justify-between items-start gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                Course
              </span>
              <h3 className="text-lg font-semibold text-white mt-1">{course.title}</h3>
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 flex justify-between items-start gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                Phase
              </span>
              <h4 className="text-base font-semibold text-white mt-1">{phase.title}</h4>
              {phase.duration && (
                <p className="text-xs text-slate-400 mt-1">Duration: {phase.duration}</p>
              )}
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Price
              </span>
              <p className="text-xl font-bold text-white mt-1">₦{phase.price?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
          <div className="flex justify-between items-center font-semibold text-white">
            <span>Total amount to pay:</span>
            <span className="text-2xl text-cyan-300">₦{phase.price?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-white/10 bg-black/60 p-8 space-y-4">
          <div className="flex items-center gap-2 text-white">
            <CreditCard className="h-5 w-5 text-cyan-300" />
            <h3 className="font-display text-lg font-semibold">Payment Details</h3>
          </div>
          <p className="text-sm leading-relaxed text-slate-300">
            Clicking the button below will redirect you to Paystack secure portal where you can make payments via Card, Bank Transfer, USSD, or Bank App.
          </p>
        </div>

        <button
          type="button"
          onClick={handlePurchase}
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan-400 px-6 py-4 text-sm font-semibold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60 shadow-[0_20px_50px_rgba(34,211,238,0.1)]"
        >
          {loading ? "Processing transaction..." : "Proceed to Paystack"}
          <ArrowRight className="h-4 w-4" />
        </button>

        {message && (
          <div className="p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 text-sm text-rose-400 text-center">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
