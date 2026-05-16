import Link from "next/link";

export const metadata = {
  title: "Payment Cancelled | Nexus Media",
  description: "Your payment was not completed. Return to enrollment and try again with a secure payment option.",
};

export default function CancelPage() {
  return (
    <main className="nexus-page-glow min-h-[calc(100vh-6rem)] py-24">
      <section className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="glass-card rounded-[2rem] border border-white/10 bg-black/70 p-12 shadow-[0_40px_120px_rgba(16,185,129,0.14)]">
          <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">Payment cancelled</p>
          <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">Your checkout was interrupted.</h1>
          <p className="mt-6 text-base leading-8 text-slate-300">
            No payment was completed. If you want to continue the Nexus Media enrollment, return to checkout or review your selected plan.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/checkout" className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-8 py-3.5 text-sm font-semibold text-black transition hover:bg-cyan-300">
              Retry checkout
            </Link>
            <Link href="/courses" className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-white/10">
              Explore phases
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
