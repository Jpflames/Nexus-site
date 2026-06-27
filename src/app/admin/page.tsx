import type { Metadata } from "next";
import Link from "next/link";
import { getFirebaseFirestore } from "@/lib/firebase-admin";
import {
  Users,
  BookOpen,
  Layers,
  CreditCard,
  Clock,
  ArrowRight,
  TrendingUp,
  UserPlus
} from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard | Nexus Media",
  description: "LMS administrator workspace for Nexus Media Global.",
};

export default async function AdminDashboardPage() {
  const firestore = getFirebaseFirestore();

  const stats = {
    totalStudents: 0,
    totalCourses: 0,
    activeEnrollments: 0,
    revenue: 0,
    pendingPayments: 0,
  };

  let recentStudents: any[] = [];
  let recentPayments: any[] = [];

  if (firestore) {
    try {
      // 1. Fetch Students
      const studentsSnap = await firestore
        .collection("users")
        .where("role", "==", "student")
        .get();
      stats.totalStudents = studentsSnap.size;
      recentStudents = studentsSnap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a: any, b: any) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
        .slice(0, 5);

      // 2. Fetch Courses
      const coursesSnap = await firestore.collection("courses").get();
      stats.totalCourses = coursesSnap.size;

      // 3. Fetch Active Enrollments
      const enrollSnap = await firestore
        .collection("enrollments")
        .where("active", "==", true)
        .get();
      stats.activeEnrollments = enrollSnap.size;

      // 4. Fetch Payments
      const paymentsSnap = await firestore.collection("payments").get();
      paymentsSnap.docs.forEach((doc) => {
        const data = doc.data();
        if (data.paymentStatus === "completed") {
          stats.revenue += Number(data.amount || 0);
        } else if (data.paymentStatus === "pending") {
          stats.pendingPayments += 1;
        }
      });

      recentPayments = paymentsSnap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a: any, b: any) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
        .slice(0, 5);
    } catch (error) {
      console.error("Error loading admin stats:", error);
    }
  }

  const statCards = [
    { title: "Total Students", value: stats.totalStudents, icon: Users, color: "text-cyan-300 bg-cyan-500/10 border-cyan-400/20" },
    { title: "Total Courses", value: stats.totalCourses, icon: BookOpen, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    { title: "Active Enrollments", value: stats.activeEnrollments, icon: Layers, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { title: "Revenue (NGN)", value: `₦${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
    { title: "Pending Payments", value: stats.pendingPayments, icon: Clock, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  ];

  return (
    <div className="space-y-10">
      {/* Page Title */}
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">Overview</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Dashboard Metrics
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Real-time summary of student activity, course catalogs, and paystack revenue logs.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <FadeIn key={card.title} delay={index * 0.04}>
              <div className="glass-card rounded-2xl border border-white/10 p-5 flex flex-col justify-between h-36 hover:border-cyan-400/20 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 truncate">{card.title}</span>
                  <div className={`p-2 rounded-xl border ${card.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mt-4">{card.value}</h3>
              </div>
            </FadeIn>
          );
        })}
      </div>

      {/* Recent Lists */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Students */}
        <div className="glass-card rounded-[2rem] border border-white/10 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-white">Recent Registrations</h3>
            <Link
              href="/admin/students"
              className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 hover:text-white transition"
            >
              Manage students <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentStudents.map((student) => (
              <div key={student.id} className="flex gap-4 items-center pb-4 border-b border-white/5 last:border-0 last:pb-0">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-cyan-300 shrink-0">
                  <UserPlus className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{student.name || "Student"}</p>
                  <p className="text-xs text-slate-400 truncate">{student.email}</p>
                </div>
                <span className="text-[10px] text-slate-500 whitespace-nowrap">
                  {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : ""}
                </span>
              </div>
            ))}
            {recentStudents.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-6">No students registered yet.</p>
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="glass-card rounded-[2rem] border border-white/10 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-white">Recent Payments</h3>
            <Link
              href="/admin/payments"
              className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 hover:text-white transition"
            >
              Audits logs <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentPayments.map((payment) => (
              <div key={payment.id} className="flex gap-4 items-center pb-4 border-b border-white/5 last:border-0 last:pb-0">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-cyan-300 shrink-0">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">₦{payment.amount?.toLocaleString()}</p>
                  <p className="text-xs text-slate-400 truncate">Ref: {payment.transactionReference}</p>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-semibold border ${
                      payment.paymentStatus === "completed"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : payment.paymentStatus === "pending"
                        ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                        : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                    }`}
                  >
                    {payment.paymentStatus}
                  </span>
                  <span className="text-[9px] text-slate-500 mt-1 block">
                    {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : ""}
                  </span>
                </div>
              </div>
            ))}
            {recentPayments.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-6">No payment logs found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
