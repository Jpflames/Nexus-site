import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/firebase-session";
import { getFirebaseFirestore } from "@/lib/firebase-admin";
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  GraduationCap,
  Users,
  Bell,
  CreditCard,
  Settings,
  LogOut,
  ShieldAlert
} from "lucide-react";
import { syncFirebaseSession } from "@/lib/firebase-client";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAuthenticatedUser();
  if (!session) {
    redirect("/login");
  }

  const firestore = getFirebaseFirestore();
  let role = "student";

  if (firestore) {
    try {
      const docSnap = await firestore.collection("users").doc(session.uid).get();
      if (docSnap.exists) {
        role = docSnap.data()?.role || "student";
      }
    } catch (error) {
      console.error("Error checking admin role:", error);
    }
  }

  if (role !== "admin") {
    return (
      <main className="nexus-page-glow min-h-[calc(100vh-6rem)] flex items-center justify-center py-20 px-4">
        <div className="glass-card rounded-[2rem] border border-white/10 bg-black/70 p-10 max-w-md w-full text-center space-y-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-white">Access Restricted</h1>
          <p className="text-sm leading-relaxed text-slate-300">
            You do not have administrative privileges. Please log in with an authorized administrator account to access this section.
          </p>
          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="flex-1 inline-flex items-center justify-center rounded-full bg-cyan-400 px-4 py-2.5 text-xs font-semibold text-black hover:bg-cyan-300 transition"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition"
            >
              Back Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const adminMenu = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/courses", label: "Courses", icon: BookOpen },
    { href: "/admin/phases", label: "Phases", icon: Layers },
    { href: "/admin/lessons", label: "Lessons", icon: GraduationCap },
    { href: "/admin/students", label: "Students", icon: Users },
    { href: "/admin/announcements", label: "Announcements", icon: Bell },
    { href: "/admin/payments", label: "Payments", icon: CreditCard },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="nexus-page-glow min-h-[calc(100vh-6rem)] py-10">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          {/* Admin Sidebar */}
          <aside className="hidden lg:block space-y-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-400 font-bold px-4">Admin Suite</p>
              <nav className="mt-4 space-y-1">
                {adminMenu.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition"
                    >
                      <Icon className="h-4 w-4 text-cyan-300" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-6 border-t border-white/5">
              <Link
                href="/login"
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/5 transition"
              >
                <LogOut className="h-4 w-4" />
                Exit Admin
              </Link>
            </div>
          </aside>

          {/* Admin Mobile Selection Menu */}
          <AdminMobileNav menuItems={adminMenu.map(({ href, label }) => ({ href, label }))} />

          {/* Admin Content Area */}
          <main className="space-y-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
