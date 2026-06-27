"use client";

import { useEffect, useState } from "react";
import { Users, Power, PowerOff, ShieldCheck, ShieldAlert, Plus, X } from "lucide-react";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy
} from "firebase/firestore";
import { getFirebaseFirestoreClient } from "@/lib/firebase-client";
import { FadeIn } from "@/components/motion/fade-in";

export default function AdminStudentsPage() {
  const db = getFirebaseFirestoreClient();

  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [phasesMap, setPhasesMap] = useState<Record<string, any>>({});
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Manual enrollment form states
  const [enrollFormOpen, setEnrollFormOpen] = useState(false);
  const [enrollStudentId, setEnrollStudentId] = useState("");
  const [enrollCourseId, setEnrollCourseId] = useState("");
  const [enrollPhaseId, setEnrollPhaseId] = useState("");
  const [phasesList, setPhasesList] = useState<any[]>([]);

  const fetchData = async () => {
    if (!db) return;
    setLoading(true);
    try {
      // 1. Fetch Students
      const usersSnap = await getDocs(query(collection(db, "users"), where("role", "==", "student")));
      const studentsList = usersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setStudents(studentsList);

      // 2. Fetch Enrollments
      const enrollSnap = await getDocs(collection(db, "enrollments"));
      setEnrollments(enrollSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      // 3. Fetch Courses & Phases
      const coursesSnap = await getDocs(collection(db, "courses"));
      const coursesList = coursesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCourses(coursesList);

      const pMap: Record<string, any> = {};
      for (const course of coursesList) {
        const phasesSnap = await getDocs(collection(db, "courses", course.id, "phases"));
        phasesSnap.docs.forEach((doc) => {
          pMap[doc.id] = { id: doc.id, ...doc.data() };
        });
      }
      setPhasesMap(pMap);
    } catch (err) {
      console.error("Error loading student data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [db]);

  // Load phases for manual enrollment
  useEffect(() => {
    const loadPhases = async () => {
      if (!db || !enrollCourseId) {
        setPhasesList([]);
        return;
      }
      try {
        const snap = await getDocs(collection(db, "courses", enrollCourseId, "phases"));
        setPhasesList(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      }
    };
    loadPhases();
  }, [db, enrollCourseId]);

  // Toggle enrollment active status
  const handleToggleEnrollment = async (enrollment: any) => {
    if (!db) return;
    const newStatus = !enrollment.active;
    try {
      await updateDoc(doc(db, "enrollments", enrollment.id), {
        active: newStatus,
        updatedAt: new Date().toISOString()
      });
      fetchData();
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  // Submit manual enrollment
  const handleManualEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !enrollStudentId || !enrollCourseId || !enrollPhaseId) return;

    try {
      const docId = `${enrollStudentId}_${enrollCourseId}_${enrollPhaseId}`;
      await setDoc(doc(db, "enrollments", docId), {
        uid: enrollStudentId,
        courseId: enrollCourseId,
        phaseId: enrollPhaseId,
        active: true,
        createdAt: new Date().toISOString()
      });

      // Update student profile hasEnrollment flag
      await updateDoc(doc(db, "users", enrollStudentId), {
        hasEnrollment: true
      });

      setEnrollFormOpen(false);
      setEnrollCourseId("");
      setEnrollPhaseId("");
      fetchData();
    } catch (err) {
      console.error("Enrollment error:", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">Admin</p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Student Registrations
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            View cohort profile cards, verify active phase courses, and manually provision enrollments.
          </p>
        </div>
      </div>

      {/* Manual Enrollment Form Dialog */}
      {enrollFormOpen && (
        <FadeIn>
          <form onSubmit={handleManualEnroll} className="glass-card rounded-[2rem] border border-white/10 p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h3 className="text-lg font-bold text-white">Manually Enroll Student</h3>
              <button type="button" onClick={() => setEnrollFormOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-200">
                Select Course
                <select
                  value={enrollCourseId}
                  onChange={(e) => setEnrollCourseId(e.target.value)}
                  required
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-slate-200 outline-none text-sm"
                >
                  <option value="">-- Choose Course --</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium text-slate-200">
                Select Phase
                <select
                  value={enrollPhaseId}
                  onChange={(e) => setEnrollPhaseId(e.target.value)}
                  required
                  disabled={phasesList.length === 0}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-slate-200 outline-none text-sm disabled:opacity-55"
                >
                  <option value="">-- Choose Phase --</option>
                  {phasesList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} - ₦{p.price?.toLocaleString()}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-cyan-400 hover:bg-cyan-300 px-6 py-3 text-sm font-semibold text-black transition"
              >
                Enroll Now
              </button>
              <button
                type="button"
                onClick={() => setEnrollFormOpen(false)}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </FadeIn>
      )}

      {/* Student List */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cyan-400 border-r-2 border-transparent mx-auto" />
          <p className="text-xs text-slate-400 mt-4">Syncing students inbox...</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {students.map((student) => {
            // Find enrollments for this student
            const studentEnrollments = enrollments.filter((e) => e.uid === student.id);
            return (
              <div
                key={student.id}
                className="glass-card rounded-[2rem] border border-white/10 p-6 flex flex-col md:flex-row justify-between gap-6 hover:border-cyan-400/10 transition"
              >
                {/* Profile card info */}
                <div className="flex-1 space-y-4 min-w-0">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-slate-950 overflow-hidden border border-white/10 shrink-0">
                      {student.profileImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={student.profileImage} alt={student.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-cyan-300 font-bold bg-cyan-950/20">
                          {student.name?.[0] || "S"}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg leading-tight truncate">
                        {student.name || "Student"}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">{student.email}</p>
                      {student.phone && <p className="text-xs text-slate-400">Phone: {student.phone}</p>}
                    </div>
                  </div>

                  {/* Enrollments Listing */}
                  <div className="pt-4 border-t border-white/5 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Active Phases</span>
                      <button
                        onClick={() => {
                          setEnrollStudentId(student.id);
                          setEnrollFormOpen(true);
                        }}
                        className="text-xs text-cyan-300 hover:text-white font-semibold transition"
                      >
                        + Grant Enrollment
                      </button>
                    </div>

                    <div className="space-y-2">
                      {studentEnrollments.map((enr) => {
                        const phaseName = phasesMap[enr.phaseId]?.title || enr.phaseId;
                        const courseName = courses.find((c) => c.id === enr.courseId)?.title || enr.courseId;
                        return (
                          <div
                            key={enr.id}
                            className="flex items-center justify-between gap-4 bg-white/5 rounded-xl border border-white/5 px-4 py-2.5 text-xs text-slate-300"
                          >
                            <span className="truncate">
                              {courseName} &rarr; <span className="text-white font-semibold">{phaseName}</span>
                            </span>
                            <button
                              onClick={() => handleToggleEnrollment(enr)}
                              className={`inline-flex items-center gap-1 font-semibold ${
                                enr.active ? "text-emerald-400 hover:text-emerald-300" : "text-rose-400 hover:text-rose-300"
                              }`}
                            >
                              {enr.active ? (
                                <>
                                  <ShieldCheck className="h-4.5 w-4.5" /> Deactivate
                                </>
                              ) : (
                                <>
                                  <ShieldAlert className="h-4.5 w-4.5" /> Activate
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                      {studentEnrollments.length === 0 && (
                        <p className="text-xs text-slate-500 py-1">No active enrollments provisioned.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex md:flex-col justify-between items-end text-right">
                  <span className="text-[10px] text-slate-500 whitespace-nowrap">
                    Registered: {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : ""}
                  </span>
                </div>
              </div>
            );
          })}
          {students.length === 0 && (
            <p className="text-sm text-slate-500 py-10 text-center">No student accounts registered yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
