import { NextResponse } from "next/server";
import { collection, doc, setDoc } from "firebase-admin/firestore";
import { isAdminEmail } from "@/lib/admin";
import { phases } from "@/lib/nea";
import { getAuthenticatedUser } from "@/lib/firebase-session";
import { getFirebaseFirestore } from "@/lib/firebase-admin";

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
  const session = await getAuthenticatedUser();
  const firestore = getFirebaseFirestore();

  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if (!isAdminEmail(session.email)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  if (!firestore) {
    return NextResponse.json({ error: "Firebase admin credentials are not configured." }, { status: 500 });
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

  const courseRef = doc(collection(firestore, "courses"));
  await setDoc(courseRef, {
    phase_slug: phaseSlug,
    title,
    description: asOptionalString(body?.description),
    thumbnail_url: asOptionalString(body?.thumbnailUrl),
    video_url: asOptionalString(body?.videoUrl),
    resource_url: asOptionalString(body?.resourceUrl),
    sort_order: Number.isFinite(Number(body?.sortOrder)) ? Number(body.sortOrder) : 0,
    is_published: Boolean(body?.isPublished),
    uploaded_by: session.uid,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const lessons = Array.isArray(body?.lessons) ? (body.lessons as LessonPayload[]) : [];
  const lessonRows = lessons
    .map((lesson, index) => ({
      title: asOptionalString(lesson.title),
      content: asOptionalString(lesson.content),
      video_url: asOptionalString(lesson.videoUrl),
      resource_url: asOptionalString(lesson.resourceUrl),
      sort_order: Number.isFinite(Number(lesson.sortOrder)) ? Number(lesson.sortOrder) : index + 1,
      is_published: Boolean(lesson.isPublished),
    }))
    .filter((lesson) => lesson.title);

  const lessonSummaries = await Promise.all(
    lessonRows.map(async (lesson) => {
      const lessonRef = doc(collection(firestore, "courses", courseRef.id, "lessons"));
      await setDoc(lessonRef, {
        course_id: courseRef.id,
        ...lesson,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      return {
        id: lessonRef.id,
        title: lesson.title,
        is_published: lesson.is_published,
      };
    }),
  );

  return NextResponse.json({
    success: true,
    course: {
      id: courseRef.id,
      title,
      phase_slug: phaseSlug,
      is_published: Boolean(body?.isPublished),
      sort_order: Number.isFinite(Number(body?.sortOrder)) ? Number(body.sortOrder) : 0,
      course_lessons: lessonSummaries,
    },
  });
}