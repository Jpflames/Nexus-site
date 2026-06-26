"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, type User } from "firebase/auth";
import { getFirebaseAuth, hasFirebaseClientConfig, syncFirebaseSession } from "@/lib/firebase-client";

interface AuthFormProps {
  mode: "sign-in" | "sign-up";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [auth] = useState(() => getFirebaseAuth());
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) {
      setMessage("Authentication is unavailable because Firebase credentials are not configured.");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser: User | null) => {
      if (currentUser) {
        setLoading(true);
        setMessage("Syncing session...");
        const result = await syncFirebaseSession(currentUser);
        if (result.success) {
          setUser(currentUser);
          setMessage("Signed in successfully. Redirecting...");
        } else {
          try {
            await auth.signOut();
          } catch (signOutErr) {
            console.error("Sign out error:", signOutErr);
          }
          setUser(null);
          setMessage(`Session sync failed: ${result.error}`);
        }
        setLoading(false);
      } else {
        setUser(null);
        await syncFirebaseSession(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth]);

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [router, user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!auth) {
      setMessage("Authentication is unavailable because Firebase credentials are not configured.");
      setLoading(false);
      return;
    }

    try {
      if (mode === "sign-in") {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage("Signed in successfully. Redirecting...");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setMessage("Account created. Redirecting...");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unable to authenticate.";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!hasFirebaseClientConfig()) {
    return (
      <div className="space-y-6 rounded-[2rem] border border-white/10 bg-black/70 p-10">
        <h1 className="text-3xl font-semibold text-white">{mode === "sign-in" ? "Sign in" : "Create account"}</h1>
        <p className="text-sm text-slate-300">Firebase credentials are not configured yet.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-[2rem] border border-white/10 bg-black/70 p-10">
      <div>
        <h1 className="text-3xl font-semibold text-white">{mode === "sign-in" ? "Sign in" : "Create account"}</h1>
        <p className="mt-3 text-sm text-slate-300">
          {mode === "sign-in"
            ? "Access your Nexus Media dashboard, purchases, and enrollment details."
            : "Create your Nexus Media account and continue to secure checkout."}
        </p>
      </div>

      <div className="grid gap-4">
        <label className="block text-sm font-medium text-slate-200">
          Email address
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="mt-2 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 outline-none transition focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/40"
          />
        </label>
        <label className="block text-sm font-medium text-slate-200">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            className="mt-2 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 outline-none transition focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/40"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Working..." : mode === "sign-in" ? "Sign in" : "Create account"}
      </button>

      {message && <p className="text-sm text-slate-300">{message}</p>}

      <p className="text-center text-sm text-slate-400">
        {mode === "sign-in" ? "New to Nexus Media?" : "Already registered?"}{" "}
        <Link href={mode === "sign-in" ? "/signup" : "/login"} className="font-semibold text-cyan-300 transition hover:text-cyan-200">
          {mode === "sign-in" ? "Create an account" : "Sign in"}
        </Link>
      </p>
    </form>
  );
}