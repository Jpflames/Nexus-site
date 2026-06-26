import type { Firestore, QueryDocumentSnapshot } from "firebase-admin/firestore";

export type CourseLesson = {
  id: string;
  title: string;
  content: string | null;
  video_url: string | null;
  resource_url: string | null;
  is_published?: boolean;
};

export type CourseContent = {
  id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  resource_url: string | null;
  course_lessons?: CourseLesson[];
};

export type AdminCourse = {
  id: string;
  title: string;
  phase_slug: string;
  is_published: boolean;
  sort_order: number;
  course_lessons?: { id: string; title: string; is_published: boolean }[];
};

async function getCourseLessons(firestore: Firestore, courseId: string) {
  const lessonsSnapshot = await firestore
    .collection("courses")
    .doc(courseId)
    .collection("lessons")
    .orderBy("sort_order", "asc")
    .get();

  return lessonsSnapshot.docs.map((entry: QueryDocumentSnapshot) => ({
    id: entry.id,
    ...(entry.data() as Omit<CourseLesson, "id">),
  }));
}

export async function getPublishedCoursesForPhase(firestore: Firestore | null, phaseSlug: string) {
  if (!firestore) {
    return [];
  }

  const courseSnapshot = await firestore
    .collection("courses")
    .where("phase_slug", "==", phaseSlug)
    .get();

  const publishedCourses = courseSnapshot.docs
    .map((entry: QueryDocumentSnapshot) => ({ id: entry.id, ...entry.data() } as any))
    .filter((entry) => Boolean(entry.is_published))
    .sort((left, right) => Number(left.sort_order || 0) - Number(right.sort_order || 0));

  return Promise.all(
    publishedCourses.map(async (entry: { id: string; title?: string; description?: string | null; video_url?: string | null; resource_url?: string | null }) => {
      const lessons = await getCourseLessons(firestore, entry.id);
      return {
        id: entry.id,
        title: entry.title || "",
        description: entry.description || null,
        video_url: entry.video_url || null,
        resource_url: entry.resource_url || null,
        course_lessons: lessons.filter((lesson: CourseLesson) => lesson.is_published !== false),
      } as CourseContent;
    }),
  );
}

export async function getAdminCourses(firestore: Firestore | null) {
  if (!firestore) {
    return [];
  }

  const courseSnapshot = await firestore
    .collection("courses")
    .orderBy("created_at", "desc")
    .get();

  return Promise.all(
    courseSnapshot.docs.map(async (entry: QueryDocumentSnapshot) => {
      const lessons = await getCourseLessons(firestore, entry.id);
      const data = entry.data();
      return {
        id: entry.id,
        title: data.title || "",
        phase_slug: data.phase_slug || "",
        is_published: Boolean(data.is_published),
        sort_order: Number(data.sort_order || 0),
        course_lessons: lessons.map((lesson: CourseLesson) => ({
          id: lesson.id,
          title: lesson.title,
          is_published: Boolean(lesson.is_published),
        })),
      } as AdminCourse;
    }),
  );
}