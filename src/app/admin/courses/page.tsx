"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit, Save, Power, PowerOff, X, Upload, BookOpen } from "lucide-react";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirebaseFirestoreClient, getFirebaseStorageClient } from "@/lib/firebase-client";
import { FadeIn } from "@/components/motion/fade-in";

export default function AdminCoursesPage() {
  const db = getFirebaseFirestoreClient();
  const storage = getFirebaseStorageClient();

  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [instructor, setInstructor] = useState("");
  const [duration, setDuration] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  const fetchCourses = async () => {
    if (!db) return;
    setLoading(true);
    try {
      const q = query(collection(db, "courses"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setCourses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [db]);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setThumbnail("");
    setInstructor("");
    setDuration("");
    setEnabled(true);
    setFormOpen(false);
  };

  const handleUploadThumbnail = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storage) return;

    setUploadingImage(true);
    try {
      const fileRef = ref(storage, `courses/thumbnails/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(fileRef);
      setThumbnail(downloadUrl);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    const payload = {
      title,
      description,
      thumbnail,
      instructor,
      duration,
      enabled,
      updatedAt: new Date().toISOString(),
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, "courses", editingId), payload);
      } else {
        await addDoc(collection(db, "courses"), {
          ...payload,
          createdAt: new Date().toISOString(),
        });
      }
      resetForm();
      fetchCourses();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleEdit = (course: any) => {
    setEditingId(course.id);
    setTitle(course.title || "");
    setDescription(course.description || "");
    setThumbnail(course.thumbnail || "");
    setInstructor(course.instructor || "");
    setDuration(course.duration || "");
    setEnabled(course.enabled !== false);
    setFormOpen(true);
  };

  const handleDelete = async (courseId: string) => {
    if (!db || !window.confirm("Are you sure you want to delete this course? All phases and lessons will be orphaned.")) return;
    try {
      await deleteDoc(doc(db, "courses", courseId));
      fetchCourses();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const toggleEnabled = async (course: any) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, "courses", course.id), {
        enabled: !course.enabled,
      });
      fetchCourses();
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
            Course Management
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Create, edit, toggle enabled, and manage structural course tracks.
          </p>
        </div>
        {!formOpen && (
          <button
            onClick={() => setFormOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-cyan-400 hover:bg-cyan-300 px-6 py-3 text-sm font-semibold text-black transition shrink-0 h-fit"
          >
            <Plus className="h-4 w-4" /> Add Course
          </button>
        )}
      </div>

      {/* Form Container */}
      {formOpen && (
        <FadeIn>
          <form onSubmit={handleSubmit} className="glass-card rounded-[2rem] border border-white/10 p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingId ? "Edit Course Details" : "Create New Course"}
              </h3>
              <button type="button" onClick={resetForm} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-200">
                Course Title
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Creative Media Accelerator"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 outline-none focus:border-cyan-400/50"
                />
              </label>

              <label className="block text-sm font-medium text-slate-200">
                Instructor Name
                <input
                  type="text"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  required
                  placeholder="e.g. David Okoye"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 outline-none focus:border-cyan-400/50"
                />
              </label>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-200">
                Course Duration
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                  placeholder="e.g. 12 weeks"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 outline-none focus:border-cyan-400/50"
                />
              </label>

              <div>
                <span className="block text-sm font-medium text-slate-200">Thumbnail Image</span>
                <div className="mt-2 flex gap-4 items-center">
                  <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white cursor-pointer transition">
                    <Upload className="h-4 w-4 text-cyan-300" />
                    {uploadingImage ? "Uploading..." : "Upload File"}
                    <input type="file" className="hidden" disabled={uploadingImage} onChange={handleUploadThumbnail} />
                  </label>
                  {thumbnail && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumbnail} alt="Preview" className="h-11 w-11 rounded-xl object-cover border border-white/10" />
                  )}
                </div>
              </div>
            </div>

            <label className="block text-sm font-medium text-slate-200">
              Short Description
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                placeholder="Give a concise summary for catalog list cards..."
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 outline-none focus:border-cyan-400/50"
              />
            </label>

            <div className="flex gap-4">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-cyan-400 hover:bg-cyan-300 px-6 py-3 text-sm font-semibold text-black transition"
              >
                <Save className="h-4 w-4" /> Save Course
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

      {/* Courses List */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cyan-400 border-r-2 border-transparent mx-auto" />
          <p className="text-xs text-slate-400 mt-4">Loading courses...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {courses.map((course) => (
            <div key={course.id} className="glass-card rounded-[2rem] border border-white/10 p-6 flex gap-6 hover:border-cyan-400/10 transition duration-200">
              <div className="h-24 w-24 rounded-2xl bg-slate-950 overflow-hidden border border-white/5 shrink-0">
                {course.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-600">
                    <BookOpen className="h-8 w-8" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-semibold text-white truncate text-base leading-tight">
                      {course.title}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(course)}
                        className="text-slate-400 hover:text-white transition p-1 hover:bg-white/5 rounded-lg"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="text-slate-400 hover:text-rose-400 transition p-1 hover:bg-white/5 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Instructor: {course.instructor}</p>
                  <p className="text-xs text-slate-400">Duration: {course.duration}</p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                  <button
                    onClick={() => toggleEnabled(course)}
                    className={`inline-flex items-center gap-1 text-2xs font-semibold uppercase tracking-wider ${
                      course.enabled !== false ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {course.enabled !== false ? (
                      <>
                        <Power className="h-3 w-3" /> Enabled
                      </>
                    ) : (
                      <>
                        <PowerOff className="h-3 w-3" /> Disabled
                      </>
                    )}
                  </button>

                  <span className="text-[10px] text-slate-500">
                    {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : ""}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {courses.length === 0 && (
            <p className="text-sm text-slate-500 py-10 col-span-2 text-center">No courses created yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
