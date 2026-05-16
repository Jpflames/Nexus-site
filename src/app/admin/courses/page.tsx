import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CourseAdminForm } from "@/components/admin/course-admin-form";
import { FadeIn } from "@/components/motion/fade-in";
import { isAdminEmail } from "@/lib/admin";
import { createServerSupabaseClient, createServiceSupabaseClient } from "@/lib/supabase-server";

export const metadata: Metadata = {
  title: "Admin Courses | Nexus Media",
  description: "Upload and manage Nexus Media phase courses.",
};

export default async function AdminCoursesPage() {
  const authSupabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await authSupabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  if (!isAdminEmail(session.user.email)) {
    return (
      <main className="nexus-page-glow pb-24 pt-20">
        <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="rounded-[2rem] border border-white/10 bg-black/70 p-10 text-center">
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">Admin access</p>
              <h1 className="mt-4 text-3xl font-semibold text-white">You do not have course admin access.</h1>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Add your email to the `ADMIN_EMAILS` environment variable to upload courses.
              </p>
            </div>
          </FadeIn>
        </section>
      </main>
    );
  }

  const serviceSupabase = createServiceSupabaseClient();
  const { data } = await serviceSupabase
    .from("courses")
    .select("id,title,phase_slug,is_published,sort_order,course_lessons(id,title,is_published)")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <main className="nexus-page-glow pb-24 pt-20">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="rounded-[2rem] border border-white/10 bg-black/70 p-10 shadow-[0_40px_120px_rgba(16,185,129,0.14)]">
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">Course admin</p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Upload phase courses and lessons.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
              Choose a phase, add course content, publish when ready, and paid learners will see it inside their unlocked phase.
            </p>
          </div>
        </FadeIn>
      </section>

      <section className="mx-auto mt-12 max-w-6xl px-4 sm:px-6 lg:px-8">
        <CourseAdminForm initialCourses={data || []} />
      </section>
    </main>
  );
}
