import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, Clock, User, Layers, ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { getAuthenticatedUser } from "@/lib/firebase-session";
import { getFirebaseFirestore } from "@/lib/firebase-admin";

import { CourseCatalogHero, PhaseRoadmap, PricingSection } from "@/components/course/course-catalog";

export const metadata: Metadata = {
  title: "Courses | Nexus Media Student Portal",
  description: "Explore the Nexus Media premium course catalog and accelerate your career with structured phases, mentorship, and placement support.",
};

export default async function CoursesPage() {
  const session = await getAuthenticatedUser();
  if (!session) {
    return (
      <main className="nexus-page-glow min-h-[calc(100vh-6rem)]">
        <CourseCatalogHero />
        <PhaseRoadmap />
        <PricingSection />
      </main>
    );
  }

  const firestore = getFirebaseFirestore();
  let courses: any[] = [];

  if (firestore) {
    try {
      const coursesSnapshot = await firestore
        .collection("courses")
        .where("enabled", "==", true)
        .get();

      // Retrieve course list
      const coursesList = coursesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // For each course, fetch the number of phases dynamically
      courses = await Promise.all(
        coursesList.map(async (course) => {
          const phasesSnapshot = await firestore
            .collection("courses")
            .doc(course.id)
            .collection("phases")
            .get();
          return {
            ...course,
            numberOfPhases: phasesSnapshot.size || (course as any).numberOfPhases || 0,
          };
        })
      );
    } catch (error) {
      console.error("Error fetching courses from Firestore:", error);
    }
  }

  return (
    <main className="nexus-page-glow min-h-[calc(100vh-6rem)] py-16">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.24em] text-cyan-200">
            <BookOpen className="h-4 w-4 text-cyan-300 animate-pulse" />
            Nexus Media Catalog
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Acquire hire-ready skills.
          </h1>
          <p className="mt-4 text-base leading-8 text-slate-300 sm:text-lg">
            Choose your learning path. Enroll in single phases or select the complete career accelerator to kickstart your professional journey.
          </p>
        </div>

        {courses.length === 0 ? (
          <FadeIn>
            <div className="glass-card rounded-[2rem] border border-white/10 p-12 text-center max-w-2xl mx-auto">
              <Layers className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white">No courses available yet</h3>
              <p className="mt-3 text-slate-300 text-sm leading-relaxed">
                The administrative team is currently uploading course phases, learning tracks, and syllabus resources. Check back shortly.
              </p>
              {session.email?.toLowerCase().includes("admin") && (
                <Link
                  href="/admin/courses"
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-cyan-400 px-6 py-2.5 text-sm font-semibold text-black hover:bg-cyan-300 transition"
                >
                  Go to Course Admin
                </Link>
              )}
            </div>
          </FadeIn>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, index) => (
              <FadeIn key={course.id} delay={index * 0.05}>
                <article className="glass-card flex flex-col h-full rounded-[2rem] border border-white/10 overflow-hidden group hover:border-cyan-400/30 hover:shadow-[0_20px_50px_rgba(34,211,238,0.06)] transition-all duration-300">
                  <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                    {course.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-cyan-950/20 text-cyan-300">
                        <BookOpen className="h-12 w-12 opacity-40" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 rounded-full bg-black/70 border border-white/10 px-3.5 py-1 text-xs font-medium text-white backdrop-blur-md">
                      {course.numberOfPhases} {course.numberOfPhases === 1 ? "Phase" : "Phases"}
                    </div>
                  </div>

                  <div className="flex flex-col flex-1 p-6">
                    <h3 className="font-display text-xl font-semibold leading-tight text-white group-hover:text-cyan-300 transition duration-200">
                      {course.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-300 flex-1">
                      {course.description}
                    </p>

                    <div className="mt-6 pt-5 border-t border-white/5 grid grid-cols-2 gap-4 text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-cyan-300 shrink-0" />
                        <span>{course.duration || "Self-paced"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-cyan-300 shrink-0" />
                        <span className="truncate">{course.instructor || "Nexus Mentor"}</span>
                      </div>
                    </div>

                    <Link
                      href={`/courses/${course.id}`}
                      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white hover:bg-cyan-500/15 hover:border-cyan-400/25 transition-all duration-200"
                    >
                      View Phases
                      <ArrowRight className="h-4 w-4 text-cyan-300" />
                    </Link>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
