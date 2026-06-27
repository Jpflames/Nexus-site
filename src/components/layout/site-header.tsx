"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, UserPlus, X } from "lucide-react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { getFirebaseAuth, syncFirebaseSession } from "@/lib/firebase-client";
import { company, navLinks } from "@/lib/site";

/** Sticky header — premium Nexus Media navigation with floating mobile menu and conversion CTA */
export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [auth] = useState(() => getFirebaseAuth());
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      try {
        await syncFirebaseSession(currentUser);
      } catch {
        // Ignore sync failures here; the forms handle visible feedback.
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSignOut = async () => {
    if (!auth) {
      return;
    }

    await signOut(auth);
    await syncFirebaseSession(null);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
      <div className="relative mx-auto flex h-[72px] max-w-6xl items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="relative z-10 flex shrink-0 items-center gap-2.5">
          <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden">
            <Image src="/nexus%20icon.png" alt="Nexus Media icon" fill className="object-contain" sizes="40px" priority />
          </span>
          <span className="font-display text-sm font-bold tracking-tight text-white sm:text-base">{company.shortName}</span>
        </Link>

        <nav
          className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 md:flex"
          aria-label="Primary"
        >
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium transition ${
                  active ? "text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-lime-400"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="relative z-10 ml-auto flex items-center gap-3">
          {user?.email ? (
            <>
              <Link
                href="/dashboard"
                className="hidden rounded-full px-5 py-2.5 text-sm font-semibold text-white btn-gradient md:inline-flex md:items-center md:gap-1.5"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="hidden rounded-full bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 md:inline-flex"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-full bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 md:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden rounded-full px-5 py-2.5 text-sm font-semibold text-white btn-gradient md:inline-flex md:items-center md:gap-1.5"
              >
                <UserPlus className="h-4 w-4" />
                Sign up
              </Link>
            </>
          )}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-white/10 bg-black/95 md:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobile primary">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * index }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-xl px-3 py-3 text-base font-medium ${
                      pathname === link.href ? "text-emerald-200" : "text-zinc-400"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              {user?.email ? (
                <div className="mt-3 space-y-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="block rounded-full bg-white/5 px-4 py-3 text-sm font-semibold text-white text-center hover:bg-white/10"
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      handleSignOut();
                      setOpen(false);
                    }}
                    className="w-full rounded-full bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="mt-3 space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="block rounded-full bg-white/5 px-4 py-3 text-sm font-semibold text-white text-center hover:bg-white/10"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="block rounded-full py-3 text-sm font-semibold text-white text-center btn-gradient"
                  >
                    Sign up
                  </Link>
                </div>
              )}
              <Link
                href="/checkout"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white btn-gradient"
              >
                Enroll Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}