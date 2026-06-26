import { cert, getApp, getApps, initializeApp, type App, type ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

type AdminFirebaseConfig = {
  projectId?: string;
  clientEmail?: string;
  privateKey?: string;
  serviceAccountJson?: string;
};

const adminConfig: AdminFirebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  serviceAccountJson: process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
};

let adminApp: App | null = null;

function createAdminOptions() {
  if (adminConfig.serviceAccountJson) {
    const serviceAccount = JSON.parse(adminConfig.serviceAccountJson) as ServiceAccount;
    return {
      credential: cert(serviceAccount),
      projectId: adminConfig.projectId || serviceAccount.projectId,
    };
  }

  if (adminConfig.projectId && adminConfig.clientEmail && adminConfig.privateKey) {
    return {
      credential: cert({
        projectId: adminConfig.projectId,
        clientEmail: adminConfig.clientEmail,
        privateKey: adminConfig.privateKey,
      }),
      projectId: adminConfig.projectId,
    };
  }

  return null;
}

export function hasFirebaseAdminConfig() {
  return Boolean(adminConfig.serviceAccountJson || (adminConfig.projectId && adminConfig.clientEmail && adminConfig.privateKey));
}

export function getFirebaseAdminApp() {
  if (!hasFirebaseAdminConfig()) {
    return null;
  }

  if (!adminApp) {
    const options = createAdminOptions();
    adminApp = getApps().length ? getApp() : initializeApp(options || undefined);
  }

  return adminApp;
}

export function getFirebaseAdminAuth() {
  const app = getFirebaseAdminApp();
  return app ? getAuth(app) : null;
}

export function getFirebaseFirestore() {
  const app = getFirebaseAdminApp();
  return app ? getFirestore(app) : null;
}