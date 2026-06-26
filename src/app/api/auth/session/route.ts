import { NextResponse } from "next/server";
import { getFirebaseAdminAuth } from "@/lib/firebase-admin";
import { FIREBASE_SESSION_COOKIE, FIREBASE_SESSION_DURATION_MS } from "@/lib/firebase-session";

type SessionBody = {
  idToken?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as SessionBody | null;
  const idToken = body?.idToken?.trim();

  if (!idToken) {
    return NextResponse.json({ error: "Missing identity token." }, { status: 400 });
  }

  const adminAuth = getFirebaseAdminAuth();
  if (!adminAuth) {
    return NextResponse.json({ error: "Firebase admin credentials are not configured." }, { status: 500 });
  }

  try {
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: FIREBASE_SESSION_DURATION_MS,
    });

    const response = NextResponse.json({ success: true });
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