"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Save, X, Bell } from "lucide-react";
import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy
} from "firebase/firestore";
import { getFirebaseFirestoreClient } from "@/lib/firebase-client";
import { FadeIn } from "@/components/motion/fade-in";

export default function AdminAnnouncementsPage() {
  const db = getFirebaseFirestoreClient();

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  const fetchAnnouncements = async () => {
    if (!db) return;
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "announcements"), orderBy("createdAt", "desc")));
      setAnnouncements(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Error fetching announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [db]);

  const resetForm = () => {
    setTitle("");
    setBody("");
    setFormOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !title.trim() || !body.trim()) return;

    try {
      await addDoc(collection(db, "announcements"), {
        title: title.trim(),
        body: body.trim(),
        createdAt: new Date().toISOString(),
      });
      resetForm();
      fetchAnnouncements();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!db || !window.confirm("Are you sure you want to delete this announcement?")) return;
    try {
      await deleteDoc(doc(db, "announcements", id));
      fetchAnnouncements();
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
            Announcement Broadcaster
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Publish cohort updates, career workshops guidelines, and billing schedules.
          </p>
        </div>
        {!formOpen && (
          <button
            onClick={() => setFormOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-cyan-400 hover:bg-cyan-300 px-6 py-3 text-sm font-semibold text-black transition shrink-0 h-fit"
          >
            <Plus className="h-4 w-4" /> Post Update
          </button>
        )}
      </div>

      {/* Form Container */}
      {formOpen && (
        <FadeIn>
          <form onSubmit={handleSubmit} className="glass-card rounded-[2rem] border border-white/10 p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h3 className="text-lg font-bold text-white">Broadcast New Update</h3>
              <button type="button" onClick={resetForm} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <label className="block text-sm font-medium text-slate-200">
              Announcement Title
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Phase 1 Live Cohort Kickoff Workshop Link"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 outline-none focus:border-cyan-400/50"
              />
            </label>

            <label className="block text-sm font-medium text-slate-200">
              Message Body
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                rows={5}
                placeholder="Compose your announcement details, workshop guidelines, zoom links..."
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 outline-none focus:border-cyan-400/50"
              />
            </label>

            <div className="flex gap-4">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-cyan-400 hover:bg-cyan-300 px-6 py-3 text-sm font-semibold text-black transition"
              >
                <Save className="h-4 w-4" /> Broadcast Announcement
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

      {/* Announcements List */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cyan-400 border-r-2 border-transparent mx-auto" />
          <p className="text-xs text-slate-400 mt-4">Syncing broadcaster stream...</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="glass-card rounded-2xl border border-white/10 p-6 space-y-4 hover:border-cyan-400/10 transition"
            >
              <div className="flex justify-between items-center gap-4 border-b border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-300">
                    <Bell className="h-4 w-4" />
                  </div>
                  <h3 className="font-semibold text-white text-base">
                    {ann.title}
                  </h3>
                </div>
                <button
                  onClick={() => handleDelete(ann.id)}
                  className="text-slate-400 hover:text-rose-400 transition p-1 hover:bg-white/5 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
                {ann.body}
              </p>

              <div className="text-right text-[10px] text-slate-500 pt-2 border-t border-white/5">
                Published: {ann.createdAt ? new Date(ann.createdAt).toLocaleString() : ""}
              </div>
            </div>
          ))}
          {announcements.length === 0 && (
            <p className="text-sm text-slate-500 py-10 text-center">No announcements published yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
