import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Check, Lock, Unlock, Play, Clock, Sparkles, Layers } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { getAuthenticatedUser } from "@/lib/firebase-session";
import { getFirebaseFirestore } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ course: string }> }): Promise<Metadata> {
  const { course } = await params;
  const firestore = getFirebaseFirestore();
  if (!firestore) {
    return { title: "Course Details | Nexus Media" };
  }

  // Try fetching by document id first, then fall back to slug lookup
  let courseSnap = await firestore.collection("courses").doc(course).get();
  if (!courseSnap.exists) {
    const q = await firestore.collection("courses").where("slug", "==", course).limit(1).get();
    if (q.empty) {
      return { title: "Course Not Found" };
    }
    courseSnap = q.docs[0];
  }

  const courseData = courseSnap.data();
  return {
    title: `${courseData?.title || "Course"} | Nexus Media`,
    description: courseData?.description || "Course details and learning phases.",
  };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ course: string }> }) {
  const { course } = await params;
  const session = await getAuthenticatedUser();
  if (!session) {
    redirect("/login");
  }

  const firestore = getFirebaseFirestore();
  if (!firestore) {
    return (
      <div className="text-center py-20 text-slate-400">
        Firebase configuration is missing on the server.
      </div>
    );
  }

  // Fetch course by id or slug
  let courseSnap = await firestore.collection("courses").doc(course).get();
  if (!courseSnap.exists) {
    const q = await firestore.collection("courses").where("slug", "==", course).limit(1).get();
    if (q.empty) notFound();
    courseSnap = q.docs[0];
  }
  const courseData = { id: courseSnap.id, ...courseSnap.data() } as any;

  // Fetch phases
  const phasesSnapshot = await firestore
    .collection("courses")
    .doc(courseData.id)
    .collection("phases")
    .orderBy("sortOrder", "asc")
    .get();

  const phases = phasesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as any[];

  // Fetch student's enrollments for this course
  const enrollmentsSnapshot = await firestore
    .collection("enrollments")
    .where("uid", "==", session.uid)
    .where("courseId", "==", courseData.id)
    .where("active", "==", true)
    .get();

  const enrolledPhaseIds = new Set(enrollmentsSnapshot.docs.map((doc) => doc.data().phaseId));

  return (
    <main className="nexus-page-glow min-h-[calc(100vh-6rem)] py-12">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to courses
          </Link>
        </div>

        {/* Course Header Banner */}
        <FadeIn>
          <div className="glass-card rounded-[2rem] border border-white/10 overflow-hidden shadow-[0_40px_120px_rgba(16,185,129,0.12)] mb-12">
            <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="p-8 sm:p-10 flex flex-col justify-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300 w-fit">
                  <Sparkles className="h-4 w-4" />
                  Premium Cohort Course
                </span>
                <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
                  {courseData.title}
                </h1>
                <p className="mt-4 text-base leading-relaxed text-slate-300">
                  {courseData.description}
                </p>
                <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-300">
                  <div className="rounded-full bg-white/5 border border-white/5 px-4 py-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-cyan-300" />
                    <span>{courseData.duration || "Self-paced"}</span>
                  </div>
                  <div className="rounded-full bg-white/5 border border-white/5 px-4 py-2 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-cyan-300" />
                    <span>{phases.length} {phases.length === 1 ? "Phase" : "Phases"}</span>
                  </div>
                  <div className="rounded-full bg-white/5 border border-white/5 px-4 py-2 flex items-center gap-2">
                    <span className="text-cyan-300 font-semibold">Instructor:</span>
                    <span>{courseData.instructor || "Nexus Media"}</span>
                  </div>
                </div>
              </div>

              <div className="relative h-64 lg:h-auto w-full bg-slate-950">
                {courseData.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={courseData.thumbnail}
                    alt={courseData.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-cyan-300">
                    <Play className="h-16 w-16 opacity-40 animate-pulse" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Phase List Section */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="font-display text-2xl font-semibold text-white">Course Syllabus & Phases</h2>
              <p className="mt-2 text-sm text-slate-400">
                Students unlock course content one phase at a time. Lock in your access to progress.
              </p>
            </div>
          </div>

          {phases.length === 0 ? (
            <div className="glass-card rounded-[2rem] border border-white/10 p-10 text-center max-w-xl mx-auto">
              <Layers className="h-10 w-10 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-300 text-sm">
                No syllabus phases have been uploaded for this course yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {phases.map((phase, index) => {
                const isUnlocked = enrolledPhaseIds.has(phase.id);
                return (
                  <FadeIn key={phase.id} delay={index * 0.05}>
                    <div
                      className={`glass-card rounded-[2rem] border p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition duration-300 ${
                        isUnlocked
                          ? "border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/30"
                          : "border-white/10 bg-black/60 hover:border-cyan-400/20"
                      }`}
                    >
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-white/5 border border-white/5 text-slate-300">
                            Phase {phase.sortOrder || index + 1}
                          </span>
                          {isUnlocked ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                              <Unlock className="h-3 w-3" /> Unlocked
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
                              <Lock className="h-3 w-3" /> Locked
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-display text-xl font-semibold text-white">
                            {phase.title}
                          </h3>
                          <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-400">
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-cyan-300" />
                              {phase.duration || "3 weeks"}
                            </span>
                            <span className="font-semibold text-white">₦{phase.price?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 sm:justify-end shrink-0">
                        {isUnlocked ? (
                          <Link
                            href="/dashboard"
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 px-6 py-3 text-sm font-semibold text-black transition duration-200"
                          >
                            Open Learning Dashboard
                            <Check className="h-4 w-4" />
                          </Link>
                        ) : (
                          <Link
                            href={`/checkout?courseId=${courseData.id}&phaseId=${phase.id}`}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 hover:bg-cyan-300 px-6 py-3 text-sm font-semibold text-black transition duration-200"
                          >
                            Buy Phase Now
                            <Lock className="h-4 w-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
