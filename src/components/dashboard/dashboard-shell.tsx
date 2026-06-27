"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { signOut, updatePassword } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  onSnapshot
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  LayoutDashboard,
  BookOpen,
  Bell,
  UserCircle,
  LogOut,
  Play,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Upload,
  AlertCircle,
  FileText,
  User,
  Phone,
  Lock,
  Layers,
  Award
} from "lucide-react";
import {
  getFirebaseFirestoreClient,
  getFirebaseStorageClient,
  getFirebaseAuth,
  syncFirebaseSession
} from "@/lib/firebase-client";

type DashboardShellProps = {
  user: {
    uid: string;
    email: string | null;
    name: string | null;
  };
  isAdmin: boolean;
  unlockedPhaseSlugs?: string[]; // Legacy
  initialLiveClasses?: any[]; // Legacy
  purchase?: any; // Legacy
  isDemo?: boolean; // Legacy
};

export function DashboardShell({ user, isAdmin }: DashboardShellProps) {
  const router = useRouter();
  const db = getFirebaseFirestoreClient();
  const storage = getFirebaseStorageClient();
  const auth = getFirebaseAuth();

  // Sidebar Tabs
  const [activeTab, setActiveTab] = useState("overview");

  // Profile data
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [editingName, setEditingName] = useState("");
  const [editingPhone, setEditingPhone] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Enrollments and Courses data
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [currentCourse, setCurrentCourse] = useState<any>(null);
  const [currentPhase, setCurrentPhase] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [activeLesson, setActiveLesson] = useState<any>(null);

  // Announcements
  const [announcements, setAnnouncements] = useState<any[]>([]);

  // Assignments & Submissions
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, any>>({});
  const [submittingAssignmentId, setSubmittingAssignmentId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  // Feed notifications
  const [activityFeed, setActivityFeed] = useState<any[]>([]);

  // Feedback notifications (Toasts)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // 1. Fetch Profile and dynamic enrollments
  useEffect(() => {
    if (!db || !user.uid) return;

    // Listen to profile updates
    const unsubProfile = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile(data);
        setEditingName(data.name || "");
        setEditingPhone(data.phone || "");
      }
      setProfileLoading(false);
    });

    // Listen to announcements
    const unsubAnnouncements = onSnapshot(
      query(collection(db, "announcements"), orderBy("createdAt", "desc")),
      (snap) => {
        setAnnouncements(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
    );

    // Listen to lesson completions
    const unsubCompletions = onSnapshot(
      query(collection(db, "lesson_progress"), where("uid", "==", user.uid)),
      (snap) => {
        const completedIds = snap.docs
          .filter((d) => d.data().completed)
          .map((d) => d.data().lessonId);
        setCompletedLessons(completedIds);
      }
    );

    // Listen to enrollments
    const unsubEnrollments = onSnapshot(
      query(collection(db, "enrollments"), where("uid", "==", user.uid), where("active", "==", true)),
      async (snap) => {
        const enrolled = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setEnrollments(enrolled);

        if (enrolled.length > 0) {
          // Select the latest enrollment as active course/phase
          const activeEnrollment = enrolled[enrolled.length - 1] as any;
          
          // Fetch course
          const courseRef = doc(db, "courses", activeEnrollment.courseId);
          const courseSnap = await getDoc(courseRef);
          if (courseSnap.exists()) {
            setCurrentCourse({ id: courseSnap.id, ...courseSnap.data() });
          }

          // Fetch phase
          const phaseRef = doc(db, "courses", activeEnrollment.courseId, "phases", activeEnrollment.phaseId);
          const phaseSnap = await getDoc(phaseRef);
          if (phaseSnap.exists()) {
            setCurrentPhase({ id: phaseSnap.id, ...phaseSnap.data() });

            // Fetch lessons for this phase
            const lessonsSnap = await getDocs(
              query(
                collection(db, "courses", activeEnrollment.courseId, "phases", activeEnrollment.phaseId, "lessons"),
                orderBy("sortOrder", "asc")
              )
            );
            const phaseLessons = lessonsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
            setLessons(phaseLessons);
            if (phaseLessons.length > 0 && !activeLesson) {
              setActiveLesson(phaseLessons[0]);
            }

            // Fetch assignments for this phase
            const assignmentsSnap = await getDocs(
              query(
                collection(db, "assignments"),
                where("courseId", "==", activeEnrollment.courseId),
                where("phaseId", "==", activeEnrollment.phaseId)
              )
            );
            setAssignments(assignmentsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
          }
        }
      }
    );

    // Listen to submissions
    const unsubSubmissions = onSnapshot(
      query(collection(db, "submissions"), where("uid", "==", user.uid)),
      (snap) => {
        const subs: Record<string, any> = {};
        snap.docs.forEach((d) => {
          const data = d.data();
          subs[data.assignmentId] = { id: d.id, ...data };
        });
        setSubmissions(subs);
      }
    );

    return () => {
      unsubProfile();
      unsubAnnouncements();
      unsubCompletions();
      unsubEnrollments();
      unsubSubmissions();
    };
  }, [db, user.uid]);

  // Construct Activity Feed
  useEffect(() => {
    if (!profile) return;
    const feed: any[] = [];
    
    // Add completed lessons
    completedLessons.forEach((lessonId) => {
      feed.push({
        id: `completed-${lessonId}`,
        type: "lesson",
        title: "Lesson Completed",
        detail: `You completed a syllabus checkpoint.`,
        date: new Date().toLocaleDateString()
      });
    });

    // Add submitted assignments
    Object.values(submissions).forEach((sub: any) => {
      feed.push({
        id: `submission-${sub.id}`,
        type: "assignment",
        title: `Assignment ${sub.status}`,
        detail: `Submission status is now: ${sub.status}.`,
        date: sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : ""
      });
    });

    setActivityFeed(feed.slice(0, 10));
  }, [profile, completedLessons, submissions]);

  // Handle Lesson Completion Toggle
  const toggleLessonCompletion = async (lessonId: string) => {
    if (!db || !user.uid) return;
    const isCompleted = completedLessons.includes(lessonId);
    const progressRef = doc(db, "lesson_progress", `${user.uid}_${lessonId}`);

    try {
      await setDoc(
        progressRef,
        {
          uid: user.uid,
          lessonId,
          completed: !isCompleted,
          completedAt: new Date().toISOString()
        },
        { merge: true }
      );
      showToast(isCompleted ? "Checkpoint marked incomplete." : "Checkpoint completed!");
    } catch (err) {
      console.error(err);
      showToast("Unable to update progress.", "error");
    }
  };

  // Next Lesson Handler
  const handleNextLesson = () => {
    if (lessons.length === 0 || !activeLesson) return;
    const currentIndex = lessons.findIndex((l) => l.id === activeLesson.id);
    if (currentIndex !== -1 && currentIndex < lessons.length - 1) {
      setActiveLesson(lessons[currentIndex + 1]);
    } else {
      showToast("You have reached the end of this phase!");
    }
  };

  // Profile updates
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user.uid) return;

    try {
      await updateDoc(doc(db, "users", user.uid), {
        name: editingName,
        phone: editingPhone
      });
      showToast("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      showToast("Failed to update profile.", "error");
    }
  };

  // Password update
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth?.currentUser || !passwordInput) return;

    try {
      await updatePassword(auth.currentUser, passwordInput);
      setPasswordInput("");
      showToast("Password updated successfully.");
    } catch (err: any) {
      console.error(err);
      showToast(err?.message || "Failed to update password. You may need to log out and log back in.", "error");
    }
  };

  // Avatar Upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storage || !db || !user.uid) return;

    setAvatarUploading(true);
    try {
      const avatarRef = ref(storage, `portfolios/${user.uid}/avatar.jpg`);
      await uploadBytes(avatarRef, file);
      const downloadUrl = await getDownloadURL(avatarRef);

      await updateDoc(doc(db, "users", user.uid), {
        profileImage: downloadUrl
      });
      showToast("Avatar image updated!");
    } catch (err) {
      console.error(err);
      showToast("Failed to upload image.", "error");
    } finally {
      setAvatarUploading(false);
    }
  };

  // Assignment Upload & Submission
  const handleAssignmentSubmit = async (assignmentId: string, file: File) => {
    if (!storage || !db || !user.uid) return;

    setSubmittingAssignmentId(assignmentId);
    setUploadProgress("Uploading file...");

    try {
      // 1. Upload to storage
      const fileRef = ref(storage, `assignments/${user.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(fileRef);

      // 2. Write submission document
      const docId = `${user.uid}_${assignmentId}`;
      await setDoc(doc(db, "submissions", docId), {
        assignmentId,
        uid: user.uid,
        studentName: profile?.name || user.name || "Student",
        studentEmail: user.email || "",
        fileUrl: downloadUrl,
        status: "Submitted",
        createdAt: new Date().toISOString()
      });

      showToast("Assignment submitted successfully!");
    } catch (err) {
      console.error(err);
      showToast("Failed to submit assignment.", "error");
    } finally {
      setSubmittingAssignmentId(null);
      setUploadProgress(null);
    }
  };

  // Logout
  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    await syncFirebaseSession(null);
    router.replace("/login");
    router.refresh();
  };

  // Calculations
  const totalLessons = lessons.length;
  const completedCount = lessons.filter((l) => completedLessons.includes(l.id)).length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Render Section
  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
      {/* Toast Feedback */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full border px-5 py-3 text-xs sm:text-sm font-semibold shadow-2xl backdrop-blur-md ${
              toast.type === "error"
                ? "border-red-500/30 bg-red-950/90 text-red-200"
                : "border-emerald-500/30 bg-emerald-950/90 text-emerald-200"
            }`}
          >
            {toast.type === "error" ? (
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Sidebar Nav */}
        <aside className="hidden lg:block space-y-6">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500 font-bold px-4">Portal Menu</p>
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === "overview" ? "bg-cyan-500/10 text-cyan-300 border-l-2 border-cyan-400" : "text-slate-400 hover:text-white"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </button>
            <button
              onClick={() => {
                if (enrollments.length === 0) {
                  showToast("You are not enrolled in any course phases yet.", "error");
                  return;
                }
                setActiveTab("my-course");
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                enrollments.length === 0 ? "opacity-50 cursor-not-allowed text-slate-600" : ""
              } ${
                activeTab === "my-course" ? "bg-cyan-500/10 text-cyan-300 border-l-2 border-cyan-400" : "text-slate-400 hover:text-white"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              My Course
            </button>
            <button
              onClick={() => setActiveTab("announcements")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === "announcements" ? "bg-cyan-500/10 text-cyan-300 border-l-2 border-cyan-400" : "text-slate-400 hover:text-white"
              }`}
            >
              <Bell className="h-4 w-4" />
              Announcements
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === "profile" ? "bg-cyan-500/10 text-cyan-300 border-l-2 border-cyan-400" : "text-slate-400 hover:text-white"
              }`}
            >
              <UserCircle className="h-4 w-4" />
              Profile
            </button>
          </div>

          <div className="pt-6 border-t border-white/5 space-y-1">
            {isAdmin && (
              <button
                onClick={() => router.push("/admin")}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-cyan-300 hover:bg-cyan-500/5 transition"
              >
                <Layers className="h-4 w-4" />
                Admin Panel
              </button>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/5 transition"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>

        {/* Mobile Dropdown Menu */}
        <div className="block lg:hidden mb-4">
          <select
            value={activeTab}
            onChange={(e) => {
              if (e.target.value === "my-course" && enrollments.length === 0) {
                showToast("You are not enrolled in any course phases yet.", "error");
                return;
              }
              if (e.target.value === "logout") {
                handleLogout();
                return;
              }
              if (e.target.value === "admin") {
                router.push("/admin");
                return;
              }
              setActiveTab(e.target.value);
            }}
            className="w-full rounded-xl border border-white/10 bg-black/80 px-4 py-3 text-sm text-slate-200 outline-none"
          >
            <option value="overview">Dashboard Overview</option>
            <option value="my-course" disabled={enrollments.length === 0}>
              My Course {enrollments.length === 0 ? "(Locked)" : ""}
            </option>
            <option value="announcements">Announcements</option>
            <option value="profile">Profile Settings</option>
            {isAdmin && <option value="admin">Go to Admin Portal</option>}
            <option value="logout">Logout</option>
          </select>
        </div>

        {/* Main Content Pane */}
        <div className="min-h-[500px]">
          {profileLoading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cyan-400 border-r-2 border-transparent mx-auto" />
              <p className="text-xs text-slate-400 mt-4">Loading student profile...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {/* Tab 1: Overview */}
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8"
                >
                  {/* Banner */}
                  <div className="glass-card rounded-[2rem] border border-white/10 p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white sm:text-3xl">Welcome back, {profile?.name || user.name || "Learner"}!</h2>
                      <p className="text-sm text-slate-300 mt-2">
                        Nexus Media Career Acceleration Portal. Keep executing syllabus tasks to stay hire-ready.
                      </p>
                    </div>
                  </div>

                  {/* Cards Grid */}
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Card 1: Continue Learning */}
                    <div className="glass-card rounded-[1.75rem] border border-white/10 p-6 flex flex-col justify-between h-40">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-300">Continue Learning</span>
                        <h4 className="text-base font-semibold text-white mt-2 truncate">
                          {activeLesson?.title || "No checkpoint active"}
                        </h4>
                      </div>
                      {enrollments.length > 0 && activeLesson && (
                        <button
                          onClick={() => setActiveTab("my-course")}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 hover:text-white transition w-fit mt-3"
                        >
                          Resume checkpoint <ChevronRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    {/* Card 2: Current Course */}
                    <div className="glass-card rounded-[1.75rem] border border-white/10 p-6 flex flex-col justify-between h-40">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Current Course</span>
                        <h4 className="text-base font-semibold text-white mt-2 truncate">
                          {currentCourse?.title || "Not enrolled yet"}
                        </h4>
                      </div>
                      <Link href="/courses" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition mt-3">
                        View catalog <ChevronRight className="h-3 w-3" />
                      </Link>
                    </div>

                    {/* Card 3: Current Phase */}
                    <div className="glass-card rounded-[1.75rem] border border-white/10 p-6 flex flex-col justify-between h-40">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Current Phase</span>
                        <h4 className="text-base font-semibold text-white mt-2 truncate">
                          {currentPhase?.title || "No active phase"}
                        </h4>
                      </div>
                    </div>

                    {/* Card 4: Overall Progress */}
                    <div className="glass-card rounded-[1.75rem] border border-white/10 p-6 flex flex-col justify-between h-40">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Overall Progress</span>
                        <div className="flex items-end justify-between mt-2">
                          <span className="text-2xl font-bold text-white">{progressPercent}%</span>
                          <span className="text-xs text-slate-400">
                            {completedCount}/{totalLessons} Checkpoints
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5 mt-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-cyan-400 to-emerald-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Feed & Announcements */}
                  <div className="grid gap-8 lg:grid-cols-2">
                    {/* Recent Announcements */}
                    <div className="glass-card rounded-[2rem] border border-white/10 p-6 sm:p-8 space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-xl font-semibold text-white">Recent Announcements</h3>
                        <button onClick={() => setActiveTab("announcements")} className="text-xs font-semibold text-cyan-300 hover:text-white transition">
                          View all
                        </button>
                      </div>
                      <div className="space-y-4">
                        {announcements.slice(0, 3).map((ann) => (
                          <div key={ann.id} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                            <h4 className="text-sm font-semibold text-white">{ann.title}</h4>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{ann.body}</p>
                            <span className="text-[10px] text-slate-500 mt-2 block">
                              {ann.createdAt ? new Date(ann.createdAt).toLocaleDateString() : ""}
                            </span>
                          </div>
                        ))}
                        {announcements.length === 0 && (
                          <p className="text-xs text-slate-500 py-4 text-center">No announcements published yet.</p>
                        )}
                      </div>
                    </div>

                    {/* Activity Feed */}
                    <div className="glass-card rounded-[2rem] border border-white/10 p-6 sm:p-8 space-y-6">
                      <h3 className="font-display text-xl font-semibold text-white">Recent Activity</h3>
                      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                        {activityFeed.map((item) => (
                          <div key={item.id} className="flex gap-4 items-start pb-4 border-b border-white/5 last:border-0">
                            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-300">
                              <Check className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-white truncate">{item.title}</p>
                              <p className="text-xs text-slate-400 mt-0.5">{item.detail}</p>
                            </div>
                            <span className="text-[10px] text-slate-500 whitespace-nowrap">{item.date}</span>
                          </div>
                        ))}
                        {activityFeed.length === 0 && (
                          <p className="text-xs text-slate-500 py-10 text-center">No activity recorded yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab 2: My Course */}
              {activeTab === "my-course" && enrollments.length > 0 && (
                <motion.div
                  key="my-course"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="grid gap-8 lg:grid-cols-[300px_1fr]"
                >
                  {/* Left Lessons Sidebar */}
                  <div className="glass-card rounded-[2rem] border border-white/10 p-5 space-y-6 h-fit max-h-[700px] overflow-y-auto">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-300">
                        {currentPhase?.title || "Course Material"}
                      </span>
                      <h3 className="text-base font-semibold text-white mt-1 truncate">Syllabus Directory</h3>
                    </div>

                    <div className="space-y-2">
                      {lessons.map((lesson, idx) => {
                        const isCompleted = completedLessons.includes(lesson.id);
                        const isActive = activeLesson?.id === lesson.id;
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => setActiveLesson(lesson)}
                            className={`w-full flex items-center gap-3 p-3.5 rounded-2xl text-left transition text-xs sm:text-sm ${
                              isActive
                                ? "bg-cyan-500/10 border border-cyan-400/20 text-white font-semibold"
                                : "bg-transparent text-slate-400 hover:text-white"
                            }`}
                          >
                            <span className="shrink-0 flex items-center justify-center h-5 w-5 rounded-full border border-white/15 bg-white/5 font-mono text-[10px]">
                              {idx + 1}
                            </span>
                            <span className="flex-1 min-w-0 truncate">{lesson.title}</span>
                            {isCompleted && (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Main Content Player */}
                  <div className="space-y-6">
                    {activeLesson ? (
                      <div className="glass-card rounded-[2rem] border border-white/10 p-6 sm:p-8 space-y-6">
                        {/* Video Player */}
                        {activeLesson.videoUrl ? (
                          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-white/5 relative">
                            {activeLesson.videoUrl.includes("youtube.com") || activeLesson.videoUrl.includes("youtu.be") ? (
                              <iframe
                                src={activeLesson.videoUrl.replace("watch?v=", "embed/")}
                                className="w-full h-full"
                                allowFullScreen
                                title={activeLesson.title}
                              />
                            ) : activeLesson.videoUrl.includes("vimeo.com") ? (
                              <iframe
                                src={activeLesson.videoUrl.replace("vimeo.com/", "player.vimeo.com/video/")}
                                className="w-full h-full"
                                allowFullScreen
                                title={activeLesson.title}
                              />
                            ) : (
                              <video
                                src={activeLesson.videoUrl}
                                controls
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                        ) : (
                          <div className="aspect-video w-full rounded-2xl bg-slate-950/40 border border-white/10 flex flex-col items-center justify-center text-center p-8 gap-3">
                            <Clock className="h-10 w-10 text-cyan-300/40 animate-pulse" />
                            <p className="text-sm text-slate-400">No video reference linked for this checkpoint.</p>
                          </div>
                        )}

                        {/* Title & Complete Check */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
                          <div>
                            <h2 className="text-2xl font-bold text-white leading-tight">{activeLesson.title}</h2>
                            <p className="text-xs text-slate-400 mt-2">
                              Syllabus Step {lessons.findIndex((l) => l.id === activeLesson.id) + 1} of {totalLessons}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <button
                              type="button"
                              onClick={() => toggleLessonCompletion(activeLesson.id)}
                              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold border transition ${
                                completedLessons.includes(activeLesson.id)
                                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                  : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                              }`}
                            >
                              <Check className="h-4 w-4" />
                              {completedLessons.includes(activeLesson.id) ? "Mark Incomplete" : "Mark as Completed"}
                            </button>
                            <button
                              type="button"
                              onClick={handleNextLesson}
                              className="inline-flex items-center gap-2 rounded-full bg-cyan-400 hover:bg-cyan-300 px-5 py-2.5 text-xs font-semibold text-black transition"
                            >
                              Next Lesson
                            </button>
                          </div>
                        </div>

                        {/* Lesson Notes */}
                        {activeLesson.notes && (
                          <div className="space-y-3">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-300">Notes</h3>
                            <div className="text-sm leading-relaxed text-slate-300 whitespace-pre-wrap rounded-2xl bg-white/5 p-6 border border-white/5">
                              {activeLesson.notes}
                            </div>
                          </div>
                        )}

                        {/* Resources */}
                        {activeLesson.resourceUrl && (
                          <div className="space-y-3">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-300">Resources</h3>
                            <a
                              href={activeLesson.resourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-white/10 border border-white/10 hover:bg-white/15 px-4 py-2.5 rounded-full transition"
                            >
                              <ExternalLink className="h-3.5 w-3.5 text-cyan-300" />
                              Download Lesson Resource
                            </a>
                          </div>
                        )}

                        {/* Assignments Segment */}
                        {assignments.length > 0 && (
                          <div className="pt-6 border-t border-white/5 space-y-6">
                            <h3 className="text-lg font-bold text-white">Syllabus Deliverables</h3>
                            <div className="grid gap-6">
                              {assignments.map((asg) => {
                                const sub = submissions[asg.id];
                                return (
                                  <div key={asg.id} className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                      <div>
                                        <h4 className="font-semibold text-white">{asg.title}</h4>
                                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{asg.description}</p>
                                      </div>
                                      <span
                                        className={`rounded-full px-3.5 py-1 text-2xs uppercase tracking-wider font-semibold border text-center shrink-0 w-fit ${
                                          sub?.status === "Reviewed"
                                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                            : sub?.status === "Submitted"
                                            ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-300"
                                            : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                                        }`}
                                      >
                                        {sub?.status || "Pending Submission"}
                                      </span>
                                    </div>

                                    {/* Upload form */}
                                    {sub?.status !== "Reviewed" && (
                                      <div className="flex flex-col gap-2">
                                        <label className="flex flex-col items-center justify-center border border-dashed border-white/15 rounded-xl p-5 hover:bg-white/5 cursor-pointer transition">
                                          <Upload className="h-5 w-5 text-slate-400 mb-2" />
                                          <span className="text-xs text-slate-300">
                                            {submittingAssignmentId === asg.id ? uploadProgress : "Upload deliverables file"}
                                          </span>
                                          <input
                                            type="file"
                                            className="hidden"
                                            disabled={submittingAssignmentId === asg.id}
                                            onChange={(e) => {
                                              const file = e.target.files?.[0];
                                              if (file) handleAssignmentSubmit(asg.id, file);
                                            }}
                                          />
                                        </label>
                                      </div>
                                    )}

                                    {/* Submission Link & Feedback */}
                                    {sub && (
                                      <div className="text-xs text-slate-400 space-y-2 pt-2 border-t border-white/5">
                                        <div className="flex items-center gap-2">
                                          <FileText className="h-3.5 w-3.5 text-cyan-300" />
                                          <a
                                            href={sub.fileUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-cyan-300 hover:underline inline-flex items-center gap-1"
                                          >
                                            View Submitted File <ExternalLink className="h-3 w-3" />
                                          </a>
                                        </div>
                                        {sub.feedback && (
                                          <div className="rounded-xl bg-cyan-950/20 border border-cyan-500/10 p-3.5 text-slate-300 mt-2">
                                            <p className="font-semibold text-xs text-cyan-300">Mentor Review Feedback:</p>
                                            <p className="mt-1 leading-relaxed">{sub.feedback}</p>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="glass-card rounded-[2rem] border border-white/10 p-12 text-center">
                        <BookOpen className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                        <p className="text-slate-300 text-sm">No checkpoints uploaded for this phase yet.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Tab 3: Announcements */}
              {activeTab === "announcements" && (
                <motion.div
                  key="announcements"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="glass-card rounded-[2rem] border border-white/10 p-6 sm:p-8 space-y-6"
                >
                  <div>
                    <h2 className="font-display text-2xl font-bold text-white">Announcements Board</h2>
                    <p className="text-sm text-slate-400 mt-2">Stay updated with cohort workshops, project briefs, and hiring events.</p>
                  </div>

                  <div className="grid gap-6">
                    {announcements.map((ann) => (
                      <article key={ann.id} className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
                        <div className="flex items-center justify-between gap-4">
                          <h3 className="text-lg font-bold text-white">{ann.title}</h3>
                          <span className="text-xs text-slate-400">
                            {ann.createdAt ? new Date(ann.createdAt).toLocaleDateString() : ""}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">{ann.body}</p>
                      </article>
                    ))}
                    {announcements.length === 0 && (
                      <p className="text-sm text-slate-500 py-12 text-center">No announcements published yet.</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Tab 4: Profile */}
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="grid gap-8 lg:grid-cols-[280px_1fr]"
                >
                  {/* Photo Edit Card */}
                  <div className="glass-card rounded-[2rem] border border-white/10 p-6 text-center space-y-4 h-fit">
                    <div className="relative h-28 w-28 rounded-[2rem] overflow-hidden bg-slate-950 mx-auto border border-white/10">
                      {profile?.profileImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={profile.profileImage} alt="Avatar" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-cyan-300">
                          <User className="h-10 w-10 opacity-40" />
                        </div>
                      )}
                      {avatarUploading && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-cyan-400 border-r-2 border-transparent" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{profile?.name || "Student"}</h4>
                      <p className="text-xs text-slate-400 mt-1">{user.email}</p>
                    </div>

                    <label className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-semibold text-white cursor-pointer transition">
                      <Upload className="h-3.5 w-3.5 text-cyan-300" />
                      Change Picture
                      <input type="file" className="hidden" disabled={avatarUploading} onChange={handleAvatarUpload} />
                    </label>
                  </div>

                  {/* Profile & Password Edit Forms */}
                  <div className="space-y-6">
                    {/* General Settings */}
                    <form onSubmit={handleUpdateProfile} className="glass-card rounded-[2rem] border border-white/10 p-6 sm:p-8 space-y-6">
                      <h3 className="font-display text-xl font-bold text-white">General Information</h3>
                      <div className="grid gap-6 sm:grid-cols-2">
                        <label className="block text-sm font-medium text-slate-200">
                          Full Name
                          <div className="relative mt-2">
                            <User className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              required
                              className="w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 py-3 text-slate-200 outline-none focus:border-cyan-400/50"
                            />
                          </div>
                        </label>
                        <label className="block text-sm font-medium text-slate-200">
                          Phone Number
                          <div className="relative mt-2">
                            <Phone className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                            <input
                              type="tel"
                              value={editingPhone}
                              onChange={(e) => setEditingPhone(e.target.value)}
                              required
                              className="w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 py-3 text-slate-200 outline-none focus:border-cyan-400/50"
                            />
                          </div>
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-full bg-cyan-400 hover:bg-cyan-300 px-6 py-2.5 text-sm font-semibold text-black transition"
                      >
                        Save Info
                      </button>
                    </form>

                    {/* Password Update Settings */}
                    <form onSubmit={handleUpdatePassword} className="glass-card rounded-[2rem] border border-white/10 p-6 sm:p-8 space-y-6">
                      <h3 className="font-display text-xl font-bold text-white">Reset Security Password</h3>
                      <label className="block text-sm font-medium text-slate-200 max-w-md">
                        New Password
                        <div className="relative mt-2">
                          <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                          <input
                            type="password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            required
                            minLength={8}
                            placeholder="Enter new 8+ char password"
                            className="w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 py-3 text-slate-200 outline-none focus:border-cyan-400/50"
                          />
                        </div>
                      </label>

                      <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-6 py-2.5 text-sm font-semibold text-white transition"
                      >
                        Reset Password
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
