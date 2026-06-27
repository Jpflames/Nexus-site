"use client";

import { useEffect, useState } from "react";
import { CreditCard, ExternalLink, Calendar, Search } from "lucide-react";
import {
  collection,
  getDocs,
  query,
  orderBy
} from "firebase/firestore";
import { getFirebaseFirestoreClient } from "@/lib/firebase-client";

export default function AdminPaymentsPage() {
  const db = getFirebaseFirestoreClient();

  const [payments, setPayments] = useState<any[]>([]);
  const [studentsMap, setStudentsMap] = useState<Record<string, any>>({});
  const [coursesMap, setCoursesMap] = useState<Record<string, any>>({});
  const [phasesMap, setPhasesMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    if (!db) return;
    setLoading(true);
    try {
      // 1. Fetch payments
      const paySnap = await getDocs(query(collection(db, "payments"), orderBy("createdAt", "desc")));
      const paymentsList = paySnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPayments(paymentsList);

      // 2. Fetch students to resolve uid
      const usersSnap = await getDocs(collection(db, "users"));
      const uMap: Record<string, any> = {};
      usersSnap.docs.forEach((d) => {
        uMap[d.id] = d.data();
      });
      setStudentsMap(uMap);

      // 3. Fetch courses
      const coursesSnap = await getDocs(collection(db, "courses"));
      const cMap: Record<string, any> = {};
      coursesSnap.docs.forEach((d) => {
        cMap[d.id] = d.data();
      });
      setCoursesMap(cMap);

      // 4. Fetch phases
      const pMap: Record<string, any> = {};
      for (const courseId of Object.keys(cMap)) {
        const phasesSnap = await getDocs(collection(db, "courses", courseId, "phases"));
        phasesSnap.docs.forEach((doc) => {
          pMap[doc.id] = doc.data();
        });
      }
      setPhasesMap(pMap);
    } catch (err) {
      console.error("Error loading payment ledger:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [db]);

  // Filter payments by student name, email, or transaction reference
  const filteredPayments = payments.filter((payment) => {
    const student = studentsMap[payment.uid] || {};
    const studentName = String(student.name || "").toLowerCase();
    const studentEmail = String(student.email || "").toLowerCase();
    const reference = String(payment.transactionReference || "").toLowerCase();
    const queryStr = searchTerm.toLowerCase();

    return (
      studentName.includes(queryStr) ||
      studentEmail.includes(queryStr) ||
      reference.includes(queryStr)
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">Admin</p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Payment Audit Ledger
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Audit Paystack transaction logs, billing references, and student enrollment clearances.
          </p>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md w-full">
        <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="Filter by student name, email, or transaction reference..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-black pl-11 pr-4 py-3 text-slate-200 outline-none focus:border-cyan-400/50 text-sm"
        />
      </div>

      {/* Payments Ledger Table */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cyan-400 border-r-2 border-transparent mx-auto" />
          <p className="text-xs text-slate-400 mt-4">Auditing ledger stream...</p>
        </div>
      ) : (
        <div className="glass-card rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-xs font-bold uppercase tracking-wider bg-white/5">
                  <th className="p-5">Student</th>
                  <th className="p-5">Purchased Phase</th>
                  <th className="p-5">Amount</th>
                  <th className="p-5">Reference</th>
                  <th className="p-5 text-center">Status</th>
                  <th className="p-5">Transaction Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300 text-sm">
                {filteredPayments.map((payment) => {
                  const student = studentsMap[payment.uid] || {};
                  const course = coursesMap[payment.courseId] || {};
                  const phase = phasesMap[payment.phaseId] || {};
                  return (
                    <tr key={payment.id} className="hover:bg-white/5 transition">
                      <td className="p-5">
                        <div className="font-semibold text-white">{student.name || "Student"}</div>
                        <div className="text-xs text-slate-500">{student.email || payment.uid}</div>
                      </td>
                      <td className="p-5">
                        <div className="font-medium text-white">{phase.title || payment.phaseId}</div>
                        <div className="text-xs text-slate-500 truncate max-w-[200px]">
                          {course.title || payment.courseId}
                        </div>
                      </td>
                      <td className="p-5 font-semibold text-white">
                        ₦{payment.amount?.toLocaleString()}
                      </td>
                      <td className="p-5 font-mono text-xs text-slate-400 max-w-[150px] truncate">
                        {payment.transactionReference}
                      </td>
                      <td className="p-5 text-center">
                        <span
                          className={`rounded-full px-3.5 py-1 text-3xs uppercase tracking-wider font-semibold border inline-block ${
                            payment.paymentStatus === "completed"
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                              : payment.paymentStatus === "pending"
                              ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                              : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                          }`}
                        >
                          {payment.paymentStatus}
                        </span>
                      </td>
                      <td className="p-5 text-xs text-slate-400">
                        {payment.createdAt ? new Date(payment.createdAt).toLocaleString() : ""}
                      </td>
                    </tr>
                  );
                })}
                {filteredPayments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-slate-500 text-xs">
                      No payment transaction entries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
