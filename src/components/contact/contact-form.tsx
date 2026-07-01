"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { serviceInterestOptions } from "@/lib/site";
import { getFirebaseFirestoreClient } from "@/lib/firebase-client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: (formData.get("phone") as string) || "",
        service: (formData.get("service") as string) || "",
        message: formData.get("message") as string,
        createdAt: serverTimestamp(),
      };

      const firestore = getFirebaseFirestoreClient();
      if (!firestore) {
        throw new Error("Firebase is not initialized");
      }

      await addDoc(collection(firestore, "contacts"), data);
      setStatus("sent");
    } catch (err) {
      console.error("Error saving contact message:", err);
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20";

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
          disabled={status === "submitting" || status === "sent"}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white btn-gradient disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : status === "sent" ? (
            <Send className="h-4 w-4" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {status === "submitting" ? "Sending..." : status === "sent" ? "Message Sent" : "Send Message"}
        </button>
        {status === "sent" && (
          <p className="text-center text-sm text-emerald-400" role="status">
            Thanks! Your message has been sent successfully. We will get back to you shortly.
          </p>
        )}
        {status === "error" && (
          <p className="text-center text-sm text-red-400" role="alert">
            {errorMsg || "Failed to send message. Please try again later."}
          </p>
        )}
      </form>
    </motion.div>
  );
}
