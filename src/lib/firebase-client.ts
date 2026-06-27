import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth, type User } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

type ClientFirebaseConfig = {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
};

const clientConfig: ClientFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let clientApp: FirebaseApp | null = null;

export function hasFirebaseClientConfig() {
  return Boolean(clientConfig.apiKey && clientConfig.authDomain && clientConfig.projectId && clientConfig.appId);
}

export function getFirebaseClientApp() {
  if (!hasFirebaseClientConfig()) {
    return null;
  }

  if (!clientApp) {
    clientApp = getApps().length ? getApp() : initializeApp(clientConfig);
  }

  return clientApp;
}

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseClientApp();
  return app ? getAuth(app) : null;
}

export function getFirebaseFirestoreClient(): Firestore | null {
  const app = getFirebaseClientApp();
  return app ? getFirestore(app) : null;
}

export function getFirebaseStorageClient(): FirebaseStorage | null {
  const app = getFirebaseClientApp();
  return app ? getStorage(app) : null;
}

export async function syncFirebaseSession(user: User | null): Promise<{ success: boolean; role?: string; hasEnrollment?: boolean; error?: string }> {
  if (!user) {
    const res = await fetch("/api/auth/session", {
      method: "DELETE",
    });
    return { success: res.ok };
  }

  try {
    const idToken = await user.getIdToken();
    const res = await fetch("/api/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });
    
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: false, error: data.error || `Server responded with status ${res.status}` };
    }
    
    const data = await res.json().catch(() => ({}));
    return { 
      success: true, 
      role: data.role || "student", 
      hasEnrollment: Boolean(data.hasEnrollment) 
    };
  } catch (err) {
    console.error("Error syncing Firebase session:", err);
    return { success: false, error: err instanceof Error ? err.message : "Network error during session sync" };
  }
}