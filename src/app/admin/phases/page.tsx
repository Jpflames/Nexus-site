"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit, Save, Lock, Unlock, X } from "lucide-react";
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
import { getFirebaseFirestoreClient } from "@/lib/firebase-client";
import { FadeIn } from "@/components/motion/fade-in";

export default function AdminPhasesPage() {
  const db = getFirebaseFirestoreClient();

  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [phases, setPhases] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(12000);
  const [duration, setDuration] = useState("");
  const [locked, setLocked] = useState(true);
  const [sortOrder, setSortOrder] = useState(1);
  const [formOpen, setFormOpen] = useState(false);

  // Fetch all courses
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

  // Fetch phases for selected course
  const fetchPhases = async () => {
    if (!db || !selectedCourseId) return;
    setLoading(true);
    try {
      const snap = await getDocs(
        query(collection(db, "courses", selectedCourseId, "phases"), orderBy("sortOrder", "asc"))
      );
      setPhases(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Error fetching phases:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhases();
    resetForm();
  }, [selectedCourseId]);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setPrice(12000);
    setDuration("");
    setLocked(true);
    setSortOrder(phases.length + 1 || 1);
    setFormOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !selectedCourseId) return;

    const payload = {
      title,
      price: Number(price),
      duration,
      locked,
      sortOrder: Number(sortOrder),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, "courses", selectedCourseId, "phases", editingId), payload);
      } else {
        await addDoc(collection(db, "courses", selectedCourseId, "phases"), {
          ...payload,
          createdAt: new Date().toISOString(),
        });
      }
      resetForm();
      fetchPhases();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleEdit = (phase: any) => {
    setEditingId(phase.id);
    setTitle(phase.title || "");
    setPrice(phase.price || 0);
    setDuration(phase.duration || "");
    setLocked(phase.locked !== false);
    setSortOrder(phase.sortOrder || 1);
    setFormOpen(true);
  };

  const handleDelete = async (phaseId: string) => {
    if (!db || !selectedCourseId || !window.confirm("Are you sure you want to delete this phase? Lessons will be orphaned.")) return;
    try {
      await deleteDoc(doc(db, "courses", selectedCourseId, "phases", phaseId));
      fetchPhases();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">Admin</p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Syllabus Phase Management
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Define pricing, durations, lock controls, and progression order for course phases.
          </p>
        </div>
        {selectedCourseId && !formOpen && (
          <button
            onClick={() => setFormOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-cyan-400 hover:bg-cyan-300 px-6 py-3 text-sm font-semibold text-black transition shrink-0 h-fit"
          >
            <Plus className="h-4 w-4" /> Add Phase
          </button>
        )}
      </div>

      {/* Course Selection */}
      <div className="glass-card rounded-2xl border border-white/10 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <label className="block text-sm font-medium text-slate-300 shrink-0">
          Selected Course:
        </label>
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="w-full sm:max-w-xs rounded-xl border border-white/10 bg-black px-4 py-2.5 text-slate-200 outline-none focus:border-cyan-400/50 text-sm"
        >
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      {/* Form Container */}
      {formOpen && (
        <FadeIn>
          <form onSubmit={handleSubmit} className="glass-card rounded-[2rem] border border-white/10 p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingId ? "Edit Phase Details" : "Create Course Phase"}
              </h3>
              <button type="button" onClick={resetForm} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-200">
                Phase Title
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Phase 1 - Employability Foundation"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 outline-none focus:border-cyan-400/50"
                />
              </label>

              <label className="block text-sm font-medium text-slate-200">
                Price (NGN)
                <input
                  type="number"
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                  placeholder="e.g. 12000"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 outline-none focus:border-cyan-400/50"
                />
              </label>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-200">
                Duration Description
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                  placeholder="e.g. 3 weeks"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 outline-none focus:border-cyan-400/50"
                />
              </label>

              <label className="block text-sm font-medium text-slate-200">
                Sort / Progression Order
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

            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={locked}
                onChange={(e) => setLocked(e.target.checked)}
              />
              Lock phase by default (requires Paystack checkout to unlock for students)
            </label>

            <div className="flex gap-4">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-cyan-400 hover:bg-cyan-300 px-6 py-3 text-sm font-semibold text-black transition"
              >
                <Save className="h-4 w-4" /> Save Phase
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

      {/* Phases List */}
      {!selectedCourseId ? (
        <p className="text-sm text-slate-500 py-10 text-center">Create a course before managing phases.</p>
      ) : loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cyan-400 border-r-2 border-transparent mx-auto" />
          <p className="text-xs text-slate-400 mt-4">Loading course phases...</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {phases.map((phase, index) => (
            <div
              key={phase.id}
              className="glass-card rounded-2xl border border-white/10 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-cyan-400/10 transition"
            >
              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="text-2xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-slate-400">
                    Phase {phase.sortOrder || index + 1}
                  </span>
                  {phase.locked !== false ? (
                    <span className="inline-flex items-center gap-1 text-2xs text-slate-400">
                      <Lock className="h-3 w-3" /> Locked (Paid)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-2xs text-cyan-300">
                      <Unlock className="h-3 w-3" /> Unlocked (Free)
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-white text-lg truncate">
                  {phase.title}
                </h3>
                <div className="flex gap-4 text-xs text-slate-400">
                  <span>Duration: {phase.duration}</span>
                  <span className="font-semibold text-white">₦{phase.price?.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2 sm:justify-end shrink-0">
                <button
                  onClick={() => handleEdit(phase)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition"
                >
                  <Edit className="h-4 w-4 text-cyan-300" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(phase.id)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 hover:bg-rose-500/10 hover:text-rose-400 px-4 py-2.5 text-xs font-semibold text-white transition"
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            </div>
          ))}
          {phases.length === 0 && (
            <p className="text-sm text-slate-500 py-10 text-center">No phases added to this course yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
