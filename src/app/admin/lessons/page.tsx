"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit, Save, X, ExternalLink, MessageSquare, Check, Upload } from "lucide-react";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirebaseFirestoreClient, getFirebaseStorageClient } from "@/lib/firebase-client";
import { FadeIn } from "@/components/motion/fade-in";

export default function AdminLessonsPage() {
  const db = getFirebaseFirestoreClient();
  const storage = getFirebaseStorageClient();

  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingResource, setUploadingResource] = useState(false);

  const handleUploadVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storage) return;

    setUploadingVideo(true);
    try {
      const fileRef = ref(storage, `courses/lessons/videos/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(fileRef);
      setVideoUrl(downloadUrl);
    } catch (err) {
      console.error("Video upload error:", err);
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleUploadResource = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storage) return;

    setUploadingResource(true);
    try {
      const fileRef = ref(storage, `courses/lessons/resources/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(fileRef);
      setResourceUrl(downloadUrl);
    } catch (err) {
      console.error("Resource upload error:", err);
    } finally {
      setUploadingResource(false);
    }
  };

  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const [phases, setPhases] = useState<any[]>([]);
  const [selectedPhaseId, setSelectedPhaseId] = useState("");

  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Lesson Form states
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [sortOrder, setSortOrder] = useState(1);
  const [formOpen, setFormOpen] = useState(false);

  // Assignment states (optional assignment link)
  const [hasAssignment, setHasAssignment] = useState(false);
  const [asgTitle, setAsgTitle] = useState("");
  const [asgDescription, setAsgDescription] = useState("");

  // Submissions state for grading
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");

  // Fetch Courses
  useEffect(() => {
    const fetchCourses = async () => {
      if (!db) return;
      try {
        const snap = await getDocs(query(collection(db, "courses"), orderBy("createdAt", "desc")));
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setCourses(list);
        if (list.length > 0) {
          setSelectedCourseId(list[0].id);
        }
      } catch (err) {
        console.error("Error loading courses:", err);
      }
    };
    fetchCourses();
  }, [db]);

  // Fetch Phases when Course changes
  useEffect(() => {
    const fetchPhases = async () => {
      if (!db || !selectedCourseId) return;
      try {
        const snap = await getDocs(
          query(collection(db, "courses", selectedCourseId, "phases"), orderBy("sortOrder", "asc"))
        );
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setPhases(list);
        if (list.length > 0) {
          setSelectedPhaseId(list[0].id);
        } else {
          setSelectedPhaseId("");
          setPhases([]);
        }
      } catch (err) {
        console.error("Error loading phases:", err);
      }
    };
    fetchPhases();
  }, [db, selectedCourseId]);

  // Fetch Lessons & Submissions when Phase changes
  const fetchLessonsAndSubmissions = async () => {
    if (!db || !selectedCourseId || !selectedPhaseId) {
      setLessons([]);
      setSubmissions([]);
      return;
    }
    setLoading(true);
    try {
      // Fetch lessons
      const lessonsSnap = await getDocs(
        query(
          collection(db, "courses", selectedCourseId, "phases", selectedPhaseId, "lessons"),
          orderBy("sortOrder", "asc")
        )
      );
      const list = lessonsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setLessons(list);

      // Fetch assignment submissions
      const submissionsSnap = await getDocs(collection(db, "submissions"));
      const allSubs = submissionsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      
      // Filter submissions matching assignments from this phase
      const matchingSubs = allSubs.filter((sub: any) =>
        sub.assignmentId && sub.assignmentId.startsWith(`${selectedCourseId}_${selectedPhaseId}`)
      );
      setSubmissions(matchingSubs);
    } catch (err) {
      console.error("Error fetching phase contents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessonsAndSubmissions();
    resetForm();
  }, [selectedCourseId, selectedPhaseId]);

  const resetForm = () => {
    setEditingLessonId(null);
    setTitle("");
    setVideoUrl("");
    setNotes("");
    setResourceUrl("");
    setSortOrder(lessons.length + 1 || 1);
    setHasAssignment(false);
    setAsgTitle("");
    setAsgDescription("");
    setFormOpen(false);
  };

  const handleEdit = async (lesson: any) => {
    setEditingLessonId(lesson.id);
    setTitle(lesson.title || "");
    setVideoUrl(lesson.videoUrl || "");
    setNotes(lesson.notes || "");
    setResourceUrl(lesson.resourceUrl || "");
    setSortOrder(lesson.sortOrder || 1);

    // Check if assignment exists for this lesson
    const asgId = `${selectedCourseId}_${selectedPhaseId}_${lesson.id}`;
    const asgSnap = await getDocs(
      query(collection(db!, "assignments"), where("courseId", "==", selectedCourseId), where("phaseId", "==", selectedPhaseId))
    );
    const matchedAsg = asgSnap.docs.find((d) => d.id === asgId);
    if (matchedAsg) {
      const data = matchedAsg.data();
      setHasAssignment(true);
      setAsgTitle(data.title || "");
      setAsgDescription(data.description || "");
    } else {
      setHasAssignment(false);
      setAsgTitle("");
      setAsgDescription("");
    }
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !selectedCourseId || !selectedPhaseId) return;

    try {
      let lessonId = editingLessonId;
      const lessonPayload = {
        title,
        videoUrl,
        notes,
        resourceUrl,
        sortOrder: Number(sortOrder),
        updatedAt: new Date().toISOString(),
      };

      if (editingLessonId) {
        await updateDoc(doc(db, "courses", selectedCourseId, "phases", selectedPhaseId, "lessons", editingLessonId), lessonPayload);
      } else {
        const newLessonRef = await addDoc(
          collection(db, "courses", selectedCourseId, "phases", selectedPhaseId, "lessons"),
          {
            ...lessonPayload,
            createdAt: new Date().toISOString(),
          }
        );
        lessonId = newLessonRef.id;
      }

      // Handle assignment creation/update
      const asgId = `${selectedCourseId}_${selectedPhaseId}_${lessonId}`;
      if (hasAssignment) {
        await setDoc(doc(db, "assignments", asgId), {
          title: asgTitle || `Deliverable for ${title}`,
          description: asgDescription,
          courseId: selectedCourseId,
          phaseId: selectedPhaseId,
          lessonId,
          createdAt: new Date().toISOString(),
        });
      } else {
        // If unchecked, delete any legacy assignment if it exists
        await deleteDoc(doc(db, "assignments", asgId));
      }

      resetForm();
      fetchLessonsAndSubmissions();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleDelete = async (lessonId: string) => {
    if (!db || !selectedCourseId || !selectedPhaseId || !window.confirm("Are you sure you want to delete this lesson?")) return;
    try {
      await deleteDoc(doc(db, "courses", selectedCourseId, "phases", selectedPhaseId, "lessons", lessonId));
      await deleteDoc(doc(db, "assignments", `${selectedCourseId}_${selectedPhaseId}_${lessonId}`));
      fetchLessonsAndSubmissions();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Grade/Review Submission
  const handleGradeSubmission = async (subId: string) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, "submissions", subId), {
        status: "Reviewed",
        feedback: feedbackText,
        updatedAt: new Date().toISOString(),
      });
      setGradingId(null);
      setFeedbackText("");
      fetchLessonsAndSubmissions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">Admin</p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Lesson & Deliverables Suite
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Publish syllabus lessons, video links, download resources, and grade student deliverables.
          </p>
        </div>
        {selectedCourseId && selectedPhaseId && !formOpen && (
          <button
            onClick={() => setFormOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-cyan-400 hover:bg-cyan-300 px-6 py-3 text-sm font-semibold text-black transition shrink-0 h-fit"
          >
            <Plus className="h-4 w-4" /> Add Lesson
          </button>
        )}
      </div>

      {/* Selectors */}
      <div className="glass-card rounded-2xl border border-white/10 p-6 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-300">
          Course
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-2.5 text-slate-200 outline-none text-sm"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-slate-300">
          Phase
          <select
            value={selectedPhaseId}
            onChange={(e) => setSelectedPhaseId(e.target.value)}
            disabled={phases.length === 0}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-2.5 text-slate-200 outline-none text-sm disabled:opacity-50"
          >
            {phases.length === 0 ? (
              <option value="">No phases created yet</option>
            ) : (
              phases.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))
            )}
          </select>
        </label>
      </div>

      {/* Lesson Form */}
      {formOpen && (
        <FadeIn>
          <form onSubmit={handleSubmit} className="glass-card rounded-[2rem] border border-white/10 p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingLessonId ? "Edit Lesson Checkpoint" : "Create New Lesson"}
              </h3>
              <button type="button" onClick={resetForm} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-200">
                Lesson Title
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Introduction to LinkedIn Audits"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 outline-none focus:border-cyan-400/50"
                />
              </label>

              <div className="block text-sm font-medium text-slate-200">
                Video Reference Link
                <div className="flex gap-3 items-center mt-2">
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="e.g. YouTube URL or uploaded file URL"
                    className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 outline-none focus:border-cyan-400/50 text-sm"
                  />
                  <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white cursor-pointer transition shrink-0">
                    <Upload className="h-4 w-4 text-cyan-300" />
                    {uploadingVideo ? "Uploading..." : "Upload Video"}
                    <input type="file" className="hidden" disabled={uploadingVideo} onChange={handleUploadVideo} />
                  </label>
                </div>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="block text-sm font-medium text-slate-200">
                Resource Download Link (Optional)
                <div className="flex gap-3 items-center mt-2">
                  <input
                    type="text"
                    value={resourceUrl}
                    onChange={(e) => setResourceUrl(e.target.value)}
                    placeholder="e.g. Dropbox, Drive, or file URL"
                    className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 outline-none focus:border-cyan-400/50 text-sm"
                  />
                  <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white cursor-pointer transition shrink-0">
                    <Upload className="h-4 w-4 text-cyan-300" />
                    {uploadingResource ? "Uploading..." : "Upload File"}
                    <input type="file" className="hidden" disabled={uploadingResource} onChange={handleUploadResource} />
                  </label>
                </div>
              </div>

              <label className="block text-sm font-medium text-slate-200">
                Sort Order
                <input
                  type="number"
                  min={1}
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  required
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 outline-none focus:border-cyan-400/50"
                />
              </label>
            </div>

            <label className="block text-sm font-medium text-slate-200">
              Lesson Text Notes
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Lesson context, notes, and checklist guidelines..."
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 outline-none focus:border-cyan-400/50"
              />
            </label>

            {/* Link Assignment Deliverable Checkbox */}
            <div className="border-t border-white/5 pt-6 space-y-4">
              <label className="flex items-center gap-3 text-sm text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasAssignment}
                  onChange={(e) => setHasAssignment(e.target.checked)}
                />
                Attach Deliverable Assignment Submission for this lesson
              </label>

              {hasAssignment && (
                <FadeIn>
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-5 space-y-4">
                    <label className="block text-sm font-medium text-slate-300">
                      Assignment Deliverable Title
                      <input
                        type="text"
                        value={asgTitle}
                        onChange={(e) => setAsgTitle(e.target.value)}
                        placeholder="e.g. LinkedIn Profile Link & Audit Resume Submission"
                        className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-2.5 text-slate-200 outline-none"
                      />
                    </label>
                    <label className="block text-sm font-medium text-slate-300">
                      Assignment Submission Briefing / Prompt
                      <textarea
                        value={asgDescription}
                        onChange={(e) => setAsgDescription(e.target.value)}
                        rows={3}
                        placeholder="Detail what files/links students need to upload and how they will be reviewed..."
                        className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-2.5 text-slate-200 outline-none"
                      />
                    </label>
                  </div>
                </FadeIn>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-cyan-400 hover:bg-cyan-300 px-6 py-3 text-sm font-semibold text-black transition"
              >
                <Save className="h-4 w-4" /> Save Lesson
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </FadeIn>
      )}

      {/* Grid of Lessons */}
      {!selectedPhaseId ? (
        <p className="text-sm text-slate-500 py-10 text-center">Create a course phase before managing lessons.</p>
      ) : loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cyan-400 border-r-2 border-transparent mx-auto" />
          <p className="text-xs text-slate-400 mt-4">Loading lessons...</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Syllabus Lessons ({lessons.length})</h3>
            <div className="grid gap-6">
              {lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="glass-card rounded-2xl border border-white/10 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-cyan-400/10 transition"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-2xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-slate-400">
                      Step {lesson.sortOrder || index + 1}
                    </span>
                    <h4 className="font-semibold text-white text-base mt-2 truncate">
                      {lesson.title}
                    </h4>
                    {lesson.videoUrl && (
                      <p className="text-xs text-cyan-300 mt-1 truncate">Video: {lesson.videoUrl}</p>
                    )}
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleEdit(lesson)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-3.5 py-2 text-xs font-semibold text-white transition"
                    >
                      <Edit className="h-3.5 w-3.5 text-cyan-300" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(lesson.id)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-rose-500/10 hover:text-rose-400 px-3.5 py-2 text-xs font-semibold text-white transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
              {lessons.length === 0 && (
                <p className="text-sm text-slate-500 py-6 text-center">No checkpoints added to this phase yet.</p>
              )}
            </div>
          </div>

          {/* Submissions Section for Grading */}
          <div className="pt-8 border-t border-white/5 space-y-6">
            <h3 className="text-lg font-bold text-white">Student Deliverables Inbox</h3>
            <div className="grid gap-6">
              {submissions.map((sub) => (
                <div key={sub.id} className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                      <h4 className="font-semibold text-white">{sub.studentName}</h4>
                      <p className="text-xs text-slate-400">{sub.studentEmail}</p>
                    </div>
                    <span
                      className={`rounded-full px-3.5 py-1 text-2xs uppercase tracking-wider font-semibold border text-center ${
                        sub.status === "Reviewed"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : "bg-cyan-500/10 border-cyan-500/20 text-cyan-300"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <a
                      href={sub.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-cyan-300 hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> View Deliverable File
                    </a>
                  </div>

                  {/* Grading Feedback Form */}
                  {gradingId === sub.id ? (
                    <FadeIn>
                      <div className="mt-3 p-4 rounded-xl bg-black border border-white/5 space-y-3">
                        <label className="block text-xs font-semibold text-slate-300">
                          Review Feedback Notes
                          <textarea
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            rows={3}
                            placeholder="Add evaluation, suggestions, or confirmation comments..."
                            className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-slate-200 outline-none text-xs"
                          />
                        </label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleGradeSubmission(sub.id)}
                            className="inline-flex items-center gap-1.5 rounded-full bg-cyan-400 px-4 py-2 text-2xs font-semibold text-black hover:bg-cyan-300"
                          >
                            <Check className="h-3.5 w-3.5" /> Submit Review
                          </button>
                          <button
                            type="button"
                            onClick={() => setGradingId(null)}
                            className="inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-2xs text-white hover:bg-white/5"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </FadeIn>
                  ) : (
                    sub.status === "Submitted" && (
                      <button
                        onClick={() => {
                          setGradingId(sub.id);
                          setFeedbackText(sub.feedback || "");
                        }}
                        className="inline-flex items-center gap-1.5 text-xs text-cyan-300 hover:text-white transition"
                      >
                        <MessageSquare className="h-3.5 w-3.5" /> Review & Add Feedback
                      </button>
                    )
                  )}

                  {sub.status === "Reviewed" && sub.feedback && (
                    <div className="text-xs rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-4 text-slate-300 mt-2">
                      <span className="font-semibold text-emerald-400">Review Feedback:</span>
                      <p className="mt-1 leading-relaxed">{sub.feedback}</p>
                    </div>
                  )}
                </div>
              ))}
              {submissions.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-6">No deliverable files in inbox.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
