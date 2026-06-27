import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/firebase-session";
import { getFirebaseFirestore } from "@/lib/firebase-admin";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard | Nexus Media Student Portal",
  description: "Your Nexus Media student learning dashboard.",
};

export default async function DashboardPage() {
  const session = await getAuthenticatedUser();
  if (!session) {
    redirect("/login");
  }

  const firestore = getFirebaseFirestore();
  if (!firestore) {
    return (
      <div className="text-center py-20 text-slate-400">
        Firebase configuration is missing on the server.
      </div>
    );
  }

  // Fetch student profile from Firestore
  let role = "student";
  let hasEnrollment = false;

  try {
    const userSnap = await firestore.collection("users").doc(session.uid).get();
    if (userSnap.exists) {
      const data = userSnap.data();
      role = data?.role || "student";
      hasEnrollment = Boolean(data?.hasEnrollment);
    }
  } catch (error) {
    console.error("Error fetching user role on dashboard page load:", error);
  }

  // Redirect based on role and enrollment
  if (role === "admin") {
    redirect("/admin");
  }

  if (!hasEnrollment) {
    redirect("/courses");
  }

  return (
    <main className="nexus-page-glow pb-24 pt-10">
      <DashboardShell
        user={{
          uid: session.uid,
          email: session.email,
          name: session.name,
        }}
        isAdmin={false}
      />
    </main>
  );
}
