"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { serviceInterestOptions } from "@/lib/site";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sent");
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-[#ec4899]/50 focus:ring-2 focus:ring-[#ec4899]/20";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-white/10 bg-[#121212] p-6 sm:p-8"
    >
      <h2 className="font-display text-xl font-bold text-white">Send us a Message</h2>
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-zinc-300">
            Name
          </label>
          <input id="name" name="name" required className={inputClass} placeholder="Your full name" />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium text-zinc-300">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={inputClass}
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-medium text-zinc-300">
            Phone
          </label>
          <input id="phone" name="phone" type="tel" className={inputClass} placeholder="+234 (0) 123 456 7890" />
        </div>
        <div>
          <label htmlFor="service" className="text-sm font-medium text-zinc-300">
            Service Interested In
          </label>
          <select id="service" name="service" className={inputClass}>
            <option value="">Select a service</option>
            {serviceInterestOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="message" className="text-sm font-medium text-zinc-300">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className={`${inputClass} resize-y`}
            placeholder="Tell us about your project."
          />
        </div>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white btn-gradient"
        >
          <Send className="h-4 w-4" />
          Send Message
        </button>
        {status === "sent" && (
          <p className="text-center text-sm text-zinc-500" role="status">
            Thanks — connect this form to your backend or form service when you go live.
          </p>
        )}
      </form>
    </motion.div>
  );
}
