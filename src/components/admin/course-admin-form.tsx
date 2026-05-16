"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { phases } from "@/lib/nea";

type LessonInput = {
  title: string;
  content: string;
  videoUrl: string;
  resourceUrl: string;
  isPublished: boolean;
};

type AdminCourse = {
  id: string;
  title: string;
  phase_slug: string;
  is_published: boolean;
  sort_order: number;
  course_lessons?: { id: string; title: string; is_published: boolean }[];
};

type CourseAdminFormProps = {
  initialCourses: AdminCourse[];
};

const emptyLesson: LessonInput = {
  title: "",
  content: "",
  videoUrl: "",
  resourceUrl: "",
  isPublished: true,
};

export function CourseAdminForm({ initialCourses }: CourseAdminFormProps) {
  const [courses, setCourses] = useState(initialCourses);
  const [phaseSlug, setPhaseSlug] = useState(phases[0]?.slug || "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [sortOrder, setSortOrder] = useState(1);
  const [isPublished, setIsPublished] = useState(true);
  const [lessons, setLessons] = useState<LessonInput[]>([{ ...emptyLesson }]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const updateLesson = (index: number, patch: Partial<LessonInput>) => {
    setLessons((current) => current.map((lesson, itemIndex) => (itemIndex === index ? { ...lesson, ...patch } : lesson)));
  };

  const removeLesson = (index: number) => {
    setLessons((current) => (current.length === 1 ? [{ ...emptyLesson }] : current.filter((_, itemIndex) => itemIndex !== index)));
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setThumbnailUrl("");
    setVideoUrl("");
    setResourceUrl("");
    setSortOrder(1);
    setIsPublished(true);
    setLessons([{ ...emptyLesson }]);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const lessonPayload = lessons
      .map((lesson, index) => ({
        title: lesson.title.trim(),
        content: lesson.content.trim() || null,
        videoUrl: lesson.videoUrl.trim() || null,
        resourceUrl: lesson.resourceUrl.trim() || null,
        sortOrder: index + 1,
        isPublished: lesson.isPublished,
      }))
      .filter((lesson) => lesson.title);

    try {
      const response = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phaseSlug,
          title,
          description,
          thumbnailUrl,
          videoUrl,
          resourceUrl,
          sortOrder,
          isPublished,
          lessons: lessonPayload,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to upload course.");
      }

      setCourses((current) => [data.course, ...current]);
      resetForm();
      setMessage("Course uploaded successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to upload course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.75fr]">
      <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-black/60 p-8">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">Upload course</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Create phase content</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            Published courses appear only to users who have confirmed payment for the selected phase.
          </p>
        </div>

        <div className="mt-8 grid gap-5">
          <label className="block text-sm font-medium text-slate-200">
            Phase
            <select
              value={phaseSlug}
              onChange={(event) => setPhaseSlug(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-slate-200 outline-none focus:border-cyan-400/50"
            >
              {phases.map((phase) => (
                <option key={phase.slug} value={phase.slug}>
                  {phase.label} - {phase.title}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-200">
            Course title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 outline-none focus:border-cyan-400/50"
            />
          </label>

          <label className="block text-sm font-medium text-slate-200">
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 outline-none focus:border-cyan-400/50"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-200">
              Video URL
              <input
                value={videoUrl}
                onChange={(event) => setVideoUrl(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 outline-none focus:border-cyan-400/50"
              />
            </label>
            <label className="block text-sm font-medium text-slate-200">
              Resource URL
              <input
                value={resourceUrl}
                onChange={(event) => setResourceUrl(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 outline-none focus:border-cyan-400/50"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-200">
              Thumbnail URL
              <input
                value={thumbnailUrl}
                onChange={(event) => setThumbnailUrl(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 outline-none focus:border-cyan-400/50"
              />
            </label>
            <label className="block text-sm font-medium text-slate-200">
              Sort order
              <input
                type="number"
                min={0}
                value={sortOrder}
                onChange={(event) => setSortOrder(Number(event.target.value))}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 outline-none focus:border-cyan-400/50"
              />
            </label>
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
            <input type="checkbox" checked={isPublished} onChange={(event) => setIsPublished(event.target.checked)} />
            Publish course immediately
          </label>
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">Lessons</p>
              <p className="mt-2 text-sm text-slate-400">Add optional lessons under this course.</p>
            </div>
            <button
              type="button"
              onClick={() => setLessons((current) => [...current, { ...emptyLesson }])}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              <Plus className="h-4 w-4" />
              Add lesson
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {lessons.map((lesson, index) => (
              <div key={index} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-white">Lesson {index + 1}</p>
                  <button type="button" onClick={() => removeLesson(index)} className="text-slate-400 hover:text-white">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-4 grid gap-4">
                  <input
                    placeholder="Lesson title"
                    value={lesson.title}
                    onChange={(event) => updateLesson(index, { title: event.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-slate-200 outline-none focus:border-cyan-400/50"
                  />
                  <textarea
                    placeholder="Lesson content"
                    value={lesson.content}
                    onChange={(event) => updateLesson(index, { content: event.target.value })}
                    rows={3}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-slate-200 outline-none focus:border-cyan-400/50"
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      placeholder="Lesson video URL"
                      value={lesson.videoUrl}
                      onChange={(event) => updateLesson(index, { videoUrl: event.target.value })}
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-slate-200 outline-none focus:border-cyan-400/50"
                    />
                    <input
                      placeholder="Lesson resource URL"
                      value={lesson.resourceUrl}
                      onChange={(event) => updateLesson(index, { resourceUrl: event.target.value })}
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-slate-200 outline-none focus:border-cyan-400/50"
                    />
                  </div>
                  <label className="flex items-center gap-3 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={lesson.isPublished}
                      onChange={(event) => updateLesson(index, { isPublished: event.target.checked })}
                    />
                    Publish lesson
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Uploading..." : "Upload course"}
        </button>

        {message && <p className="mt-4 text-sm text-slate-300">{message}</p>}
      </form>

      <aside className="rounded-[2rem] border border-white/10 bg-black/60 p-8">
        <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">Existing courses</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">Published and draft content</h2>
        <div className="mt-6 space-y-4">
          {courses.length ? (
            courses.map((course) => (
              <div key={course.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">{course.title}</p>
                    <p className="mt-1 text-sm text-slate-400">{course.phase_slug}</p>
                  </div>
                  <span className="rounded-full bg-black/40 px-3 py-1 text-xs text-slate-300">
                    {course.is_published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-400">
                  {course.course_lessons?.length || 0} lessons / order {course.sort_order}
                </p>
              </div>
            ))
          ) : (
            <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
              No courses uploaded yet.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
