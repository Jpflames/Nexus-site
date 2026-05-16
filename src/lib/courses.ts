import type { SupabaseClient } from "@supabase/supabase-js";

export type CourseContent = {
  id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  resource_url: string | null;
  course_lessons?: {
    id: string;
    title: string;
    content: string | null;
    video_url: string | null;
    resource_url: string | null;
  }[];
};

export async function getPublishedCoursesForPhase(supabase: SupabaseClient, phaseSlug: string) {
  const { data, error } = await supabase
    .from("courses")
    .select("id,title,description,video_url,resource_url,course_lessons(id,title,content,video_url,resource_url)")
    .eq("phase_slug", phaseSlug)
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("sort_order", { referencedTable: "course_lessons", ascending: true });

  if (error) {
    return [];
  }

  return (data || []) as CourseContent[];
}
