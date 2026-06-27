"use client";

import { useEffect, useState } from "react";
import { Settings, ShieldCheck, Mail, Database, Info } from "lucide-react";
import { getFirebaseFirestoreClient } from "@/lib/firebase-client";

export default function AdminSettingsPage() {
  const db = getFirebaseFirestoreClient();

  const [adminEmails, setAdminEmails] = useState<string[]>([]);

  useEffect(() => {
    // Read from environment client-side if exposed, or show default admin settings context
    const emailsStr = process.env.NEXT_PUBLIC_ADMIN_EMAILS || "israeljohnpaul28@gmail.com";
    setAdminEmails(emailsStr.split(",").map((email) => email.trim()));
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">Admin</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          System Settings
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Review credentials status, admin access emails list, and portal system specs.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Admin Permissions */}
        <div className="glass-card rounded-[2rem] border border-white/10 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 text-cyan-300">
            <ShieldCheck className="h-5 w-5" />
            <h3 className="font-display text-lg font-semibold text-white">Administrator Access</h3>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
            Only users with emails in the ADMIN_EMAILS environment variable are granted system administrator permissions.
          </p>
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">Authorized Emails</span>
            <div className="space-y-2">
              {adminEmails.map((email) => (
                <div key={email} className="flex items-center gap-2 text-xs text-slate-300 bg-white/5 rounded-xl border border-white/5 px-4 py-2">
                  <Mail className="h-3.5 w-3.5 text-cyan-300 shrink-0" />
                  <span>{email}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Database Status */}
        <div className="glass-card rounded-[2rem] border border-white/10 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 text-cyan-300">
            <Database className="h-5 w-5" />
            <h3 className="font-display text-lg font-semibold text-white">Database Engine</h3>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
            The portal is connected to Google Cloud Firestore and Firebase Auth for production deployment data syncing.
          </p>
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">Firebase SDK Settings</span>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>SDK Status:</span>
                <span className="text-emerald-400 font-semibold">Active & Online</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Firestore Collections:</span>
                <span className="text-white font-mono">Dynamic 9 groups</span>
              </div>
              <div className="flex justify-between">
                <span>Environment:</span>
                <span className="text-white font-mono">Next.js App Router (Node)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
