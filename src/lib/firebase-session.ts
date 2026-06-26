import { cookies } from "next/headers";
import { getFirebaseAdminAuth } from "@/lib/firebase-admin";

export const FIREBASE_SESSION_COOKIE = "nexus_firebase_session";
export const FIREBASE_SESSION_DURATION_MS = 5 * 24 * 60 * 60 * 1000;

export type FirebaseSessionUser = {
  uid: string;
  email: string | null;
  name: string | null;
};

export async function getAuthenticatedUser(): Promise<FirebaseSessionUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(FIREBASE_SESSION_COOKIE)?.value;
  if (!sessionCookie) {
    return null;
  }

  const adminAuth = getFirebaseAdminAuth();
  if (!adminAuth) {
    return null;
  }

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    return {
      uid: decoded.uid,
      email: decoded.email || null,
      name: decoded.name || null,
    };
  } catch {
    return null;
  }
}