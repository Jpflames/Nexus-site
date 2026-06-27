import { NextResponse } from "next/server";
import { getFirebaseAdminAuth, getFirebaseFirestore } from "@/lib/firebase-admin";
import { FIREBASE_SESSION_COOKIE, FIREBASE_SESSION_DURATION_MS } from "@/lib/firebase-session";
import { isAdminEmail } from "@/lib/admin";

type SessionBody = {
  idToken?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as SessionBody | null;
  const idToken = body?.idToken?.trim();

  if (!idToken) {
    return NextResponse.json({ error: "Missing identity token." }, { status: 400 });
  }

  // Handle local offline bypass
  if (idToken === "demo_student" || idToken === "demo_admin") {
    const role = idToken.replace("demo_", "");
    const response = NextResponse.json({
      success: true,
      role,
      hasEnrollment: role === "student"
    });
    response.cookies.set(FIREBASE_SESSION_COOKIE, idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: FIREBASE_SESSION_DURATION_MS / 1000,
    });
    return response;
  }

  const adminAuth = getFirebaseAdminAuth();
  const firestore = getFirebaseFirestore();
  if (!adminAuth || !firestore) {
    return NextResponse.json({ error: "Firebase admin credentials are not configured." }, { status: 500 });
  }

  try {
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: FIREBASE_SESSION_DURATION_MS,
    });

    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const uid = decoded.uid;
    const email = decoded.email || "";

    const userRef = firestore.collection("users").doc(uid);
    const userSnap = await userRef.get();
    let userData = userSnap.data();

    // Check if email matches the system admins list
    const isSystemAdmin = isAdminEmail(email);

    if (!userSnap.exists) {
      userData = {
        name: decoded.name || email.split("@")[0] || "Student",
        email: email,
        phone: "",
        role: isSystemAdmin ? "admin" : "student",
        hasEnrollment: false,
        createdAt: new Date().toISOString()
      };
      await userRef.set(userData);
    } else if (isSystemAdmin && userData && userData.role !== "admin") {
      userData.role = "admin";
      await userRef.update({ role: "admin" });
    }

    const response = NextResponse.json({ 
      success: true,
      role: userData?.role || "student",
      hasEnrollment: Boolean(userData?.hasEnrollment)
    });
    
    response.cookies.set(FIREBASE_SESSION_COOKIE, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: FIREBASE_SESSION_DURATION_MS / 1000,
    });
    return response;
  } catch (error) {
    console.error("Session creation error:", error);
    const message = error instanceof Error ? error.message : "Unable to create session.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(FIREBASE_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}