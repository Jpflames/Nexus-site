import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Lock } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { getAuthenticatedUser } from "@/lib/firebase-session";
import { getFirebaseFirestore } from "@/lib/firebase-admin";
import { getPublishedCoursesForPhase, type CourseContent, type CourseLesson } from "@/lib/courses";
import { coursePaths, faqItems, getPhaseBySlug, mentorProfiles, testimonials } from "@/lib/nea";
import { hasPhaseAccess } from "@/lib/payments";

export function generateStaticParams() {
  return coursePaths.map((phase) => ({ slug: phase.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const phase = getPhaseBySlug(params.slug);
  if (!phase) {
    return {
      title: "Phase not found",
      description: "This course phase could not be found.",
    };
  }

  return {
    title: `${phase.title} | Nexus Media Phase Details`,
    description: phase.description,
    openGraph: {
      title: phase.title,
      description: phase.description,
    },
  };
}

export default async function CoursePhasePage({ params }: { params: { slug: string } }) {
  const phase = getPhaseBySlug(params.slug);

  if (!phase) {
    notFound();
  }

  const session = await getAuthenticatedUser();
  const firestore = getFirebaseFirestore();
  const hasAccess = session ? await hasPhaseAccess(firestore, session.uid, phase.slug) : false;
  const courses = hasAccess ? await getPublishedCoursesForPhase(firestore, phase.slug) : [];

  const projectShowcase = [
    "Portfolio case study with real hiring context.",
    "Industry-ready deliverable for employer review.",
    "Presentation-ready project narrative.",
  ];

  return (
    <main className="nexus-page-glow pb-24 pt-20">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="rounded-[2rem] border border-white/10 bg-black/60 p-8 shadow-[0_40px_120px_rgba(16,185,129,0.12)]">
            <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">{phase.label}</p>
                <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  {phase.title}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">{phase.description}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white">{phase.duration}</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white">₦{phase.price}</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">{phase.unlockState} access</span>
                </div>
              </div>
              <div className="space-y-4 rounded-[2rem] border border-white/10 bg-slate-950/70 p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">Quick launch metrics</p>
                <div className="space-y-3">
                  <p className="text-sm text-slate-300">Employer-synced curriculum for faster hiring alignment.</p>
                  <p className="text-sm text-slate-300">Mentor-led feedback to refine your portfolio and interview presence.</p>
                </div>
                <Link href={session ? "/checkout" : "/signup"} className="inline-flex w-full items-center justify-center rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-cyan-300">
                  {hasAccess ? "Open phase content" : "Enroll in this phase"}
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_0.9fr]">
          <div className="space-y-10">
            <FadeIn>
              <div className="glass-card rounded-[2rem] border border-white/10 p-8">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="rounded-3xl bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200">Curriculum</div>
                  <p className="text-sm text-slate-400">A modern phase flow with lessons, review, and employer-facing execution.</p>
                </div>
                {hasAccess ? (
                  <div className="mt-8 space-y-4">
                    {courses.length ? (
                      courses.map((course: CourseContent) => (
                        <div key={course.id} className="rounded-3xl border border-white/10 bg-black/40 p-5">
                          <p className="font-semibold text-white">{course.title}</p>
                          {course.description && <p className="mt-3 text-sm leading-7 text-slate-300">{course.description}</p>}
                          {course.course_lessons?.length ? (
                            <div className="mt-4 space-y-3">
                              {course.course_lessons.map((lesson: CourseLesson) => (
                                <div key={lesson.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                  <p className="text-sm font-semibold text-white">{lesson.title}</p>
                                  {lesson.content && <p className="mt-2 text-sm leading-6 text-slate-300">{lesson.content}</p>}
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ))
                    ) : (
                      <div className="rounded-3xl border border-white/10 bg-black/40 p-5">
                        <p className="font-semibold text-white">Courses are being prepared by the admin team.</p>
                        <p className="mt-3 text-sm leading-7 text-slate-300">Your payment is confirmed for this phase. Published lessons will appear here once uploaded.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-8 rounded-3xl border border-white/10 bg-black/40 p-6">
                    <div className="flex items-center gap-3 text-cyan-300">
                      <Lock className="h-5 w-5" />
                      <p className="font-semibold text-white">Phase content is locked</p>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      Courses for this phase are uploaded by admin and unlock only after your payment has been confirmed.
                    </p>
                    <Link href={session ? "/checkout" : "/signup"} className="mt-5 inline-flex items-center justify-center rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-cyan-300">
                      {session ? "Pay for access" : "Create account to enroll"}
                    </Link>
                  </div>
                )}
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <div className="glass-card rounded-[2rem] border border-white/10 p-8">
                <h2 className="font-display text-2xl font-semibold text-white">Progress path</h2>
                <p className="mt-4 text-sm leading-7 text-slate-300">The phase path moves from core discovery to polished career-ready outputs.</p>
                <div className="mt-8 space-y-4">
                  {phase.outcomes.map((outcome) => (
                    <div key={outcome} className="flex items-start gap-3 rounded-3xl border border-white/10 bg-white/5 p-4">
                      <Check className="mt-1 h-5 w-5 text-cyan-300" />
                      <p className="text-sm text-slate-300">{outcome}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.16}>
              <div className="glass-card rounded-[2rem] border border-white/10 p-8">
                <h2 className="font-display text-2xl font-semibold text-white">Mentors on this phase</h2>
                <div className="mt-6 space-y-4">
                  {mentorProfiles.map((mentor) => (
                    <div key={mentor.name} className="flex items-center gap-4 rounded-3xl border border-white/10 bg-black/40 p-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-300">{mentor.name[0]}</div>
                      <div>
                        <p className="font-semibold text-white">{mentor.name}</p>
                        <p className="text-sm text-slate-400">{mentor.role}</p>
                        <p className="mt-1 text-sm text-slate-400">{mentor.speciality}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.24}>
              <div className="glass-card rounded-[2rem] border border-white/10 p-8">
                <h2 className="font-display text-2xl font-semibold text-white">Project showcase</h2>
                <div className="mt-6 space-y-4">
                  {projectShowcase.map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-3xl border border-white/10 bg-white/5 p-4">
                      <ArrowRight className="mt-1 h-4 w-4 text-cyan-300" />
                      <p className="text-sm text-slate-300">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.32}>
              <div className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  {faqItems.slice(0, 2).map((item) => (
                    <div key={item.question} className="glass-card rounded-[2rem] border border-white/10 p-6">
                      <p className="font-semibold text-white">{item.question}</p>
                      <p className="mt-3 text-sm leading-7 text-slate-300">{item.answer}</p>
                    </div>
                  ))}
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                  {testimonials.slice(0, 2).map((item) => (
                    <div key={item.name} className="glass-card rounded-[2rem] border border-white/10 p-6">
                      <p className="text-sm leading-7 text-slate-300">“{item.quote}”</p>
                      <p className="mt-5 font-semibold text-white">{item.name}</p>
                      <p className="text-sm text-slate-400">{item.role}, {item.company}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>

          <aside className="space-y-6">
            <FadeIn>
              <div className="sticky top-24 space-y-4 rounded-[2rem] border border-white/10 bg-slate-950/70 p-6">
                <div className="rounded-3xl border border-white/10 bg-black/40 p-5">
                  <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">Enrollment summary</p>
                  <div className="mt-5 space-y-3 text-sm text-slate-300">
                    <p>Phase price: ₦{phase.price}</p>
                    <p>Duration: {phase.duration}</p>
                    <p>Status: {phase.unlockState}</p>
                  </div>
                </div>
                <Link href={session ? "/checkout" : "/signup"} className="inline-flex w-full items-center justify-center rounded-full bg-cyan-400 px-4 py-3 text-sm font-semibold text-black transition hover:bg-cyan-300">
                  {hasAccess ? "Access granted" : "Enroll now"}
                </Link>
                <Link href="/courses" className="inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-white/10">
                  Back to catalog
                </Link>
              </div>
            </FadeIn>
            <FadeIn delay={0.16}>
              <div className="glass-card rounded-[2rem] border border-white/10 p-6">
                <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">Program trust</p>
                <div className="mt-5 space-y-4">
                  <div className="rounded-3xl bg-black/40 p-4 text-sm text-slate-300">Trusted by hiring teams in fintech, consulting, enterprise, and education.</div>
                  <div className="rounded-3xl bg-black/40 p-4 text-sm text-slate-300">Premium candidate experience for ambitious professionals.</div>
                </div>
              </div>
            </FadeIn>
          </aside>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-6xl items-center justify-center bg-black/85 px-4 py-4 backdrop-blur-xl sm:px-6 lg:hidden">
        <Link href={session ? "/checkout" : "/signup"} className="inline-flex w-full max-w-3xl items-center justify-center gap-2 rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-black shadow-[0_20px_60px_rgba(34,211,238,0.18)] transition hover:bg-cyan-300">
          {hasAccess ? "Open phase content" : "Enroll in this phase"}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}
