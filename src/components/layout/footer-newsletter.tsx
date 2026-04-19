"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

/** Footer newsletter — wire to your ESP or API when ready */
export function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div>
      <p className="font-display text-sm font-semibold tracking-wide text-foreground">Newsletter</p>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Your email"
          className="min-w-0 flex-1 rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
        />
        <button
          type="submit"
          className="inline-flex shrink-0 items-center justify-center gap-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-white btn-gradient"
        >
          Subscribe
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
      {sent && (
        <p className="mt-2 text-xs text-muted" role="status">
          Thanks — connect this form to your newsletter provider.
        </p>
      )}
    </div>
  );
}
