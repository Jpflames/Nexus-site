import { NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/admin";
import { phases } from "@/lib/nea";
import { createServerSupabaseClient, createServiceSupabaseClient } from "@/lib/supabase-server";

type LessonPayload = {
  title?: string;
  content?: string | null;
  videoUrl?: string | null;
  resourceUrl?: string | null;
  sortOrder?: number;
  isPublished?: boolean;
};

function asOptionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function POST(request: Request) {
  const authSupabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await authSupabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if (!isAdminEmail(session.user.email)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const phaseSlug = asOptionalString(body?.phaseSlug);
  const title = asOptionalString(body?.title);

  if (!phaseSlug || !phases.some((phase) => phase.slug === phaseSlug)) {
    return NextResponse.json({ error: "Select a valid phase." }, { status: 400 });
  }

  if (!title) {
    return NextResponse.json({ error: "Course title is required." }, { status: 400 });
  }

  const serviceSupabase = createServiceSupabaseClient();
  const { data: course, error } = await serviceSupabase
    .from("courses")
    .insert({
      phase_slug: phaseSlug,
      title,
      description: asOptionalString(body?.description),
      thumbnail_url: asOptionalString(body?.thumbnailUrl),
      video_url: asOptionalString(body?.videoUrl),
      resource_url: asOptionalString(body?.resourceUrl),
      sort_order: Number.isFinite(Number(body?.sortOrder)) ? Number(body.sortOrder) : 0,
      is_published: Boolean(body?.isPublished),
      uploaded_by: session.user.id,
    })
    .select("id,title,phase_slug,is_published,sort_order")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const lessons = Array.isArray(body?.lessons) ? (body.lessons as LessonPayload[]) : [];
  const lessonRows = lessons
    .map((lesson, index) => ({
      course_id: course.id,
      title: asOptionalString(lesson.title),
      content: asOptionalString(lesson.content),
      video_url: asOptionalString(lesson.videoUrl),
      resource_url: asOptionalString(lesson.resourceUrl),
      sort_order: Number.isFinite(Number(lesson.sortOrder)) ? Number(lesson.sortOrder) : index + 1,
      is_published: Boolean(lesson.isPublished),
    }))
    .filter((lesson) => lesson.title);

  if (lessonRows.length) {
    const { error: lessonError } = await serviceSupabase.from("course_lessons").insert(lessonRows);
    if (lessonError) {
      return NextResponse.json({ error: lessonError.message }, { status: 500 });
    }
  }

  return NextResponse.json({
    success: true,
    course: {
      ...course,
      course_lessons: lessonRows.map((lesson, index) => ({
        id: `${course.id}-${index}`,
        title: lesson.title,
        is_published: lesson.is_published,
      })),
    },
  });
}
