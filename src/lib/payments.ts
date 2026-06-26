import type { Firestore, QueryDocumentSnapshot, DocumentData } from "firebase-admin/firestore";

export type PaymentStatus = "pending" | "completed" | "failed";

export class PaymentSchemaMissingError extends Error {
  constructor() {
    super("Payment storage is not set up yet. Configure Firebase Firestore before using checkout.");
    this.name = "PaymentSchemaMissingError";
  }
}

function ensureFirestore(db: Firestore | null): Firestore {
  if (!db) {
    throw new PaymentSchemaMissingError();
  }

  return db;
}

function paymentAccessId(userId: string, phaseSlug: string) {
  return `${userId}_${phaseSlug}`;
}

export async function createPendingPayment(
  firestore: Firestore | null,
  userId: string,
  plan: string,
  amount: number,
  provider: string,
  reference: string,
  phaseSlugs: string[],
  paymentType: string,
) {
  const db = ensureFirestore(firestore);

  await db.collection("payments").doc(reference).set({
    user_id: userId,
    plan,
    amount,
    provider,
    status: "pending" as PaymentStatus,
    reference,
    selected_phases: phaseSlugs,
    payment_type: paymentType,
    metadata: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
}

export async function markPaymentComplete(
  firestore: Firestore | null,
  reference: string,
  metadata: Record<string, unknown> | null,
) {
  const db = ensureFirestore(firestore);
  const paymentRef = db.collection("payments").doc(reference);
  const paymentSnapshot = await paymentRef.get();

  if (!paymentSnapshot.exists) {
    return;
  }

  const paymentData = paymentSnapshot.data() as {
    user_id?: string;
    selected_phases?: string[];
  };

  await paymentRef.set(
    {
      ...paymentData,
      status: "completed" as PaymentStatus,
      metadata,
      updated_at: new Date().toISOString(),
    },
    { merge: true },
  );

  const selectedPhases = Array.isArray(paymentData.selected_phases) ? paymentData.selected_phases.filter(Boolean) : [];
  if (!paymentData.user_id || !selectedPhases.length) {
    return;
  }

  await Promise.all(
    selectedPhases.map((phaseSlug: string) =>
      db.collection("payment_phase_access").doc(paymentAccessId(paymentData.user_id as string, phaseSlug)).set({
        payment_id: reference,
        user_id: paymentData.user_id,
        phase_slug: phaseSlug,
        granted_at: new Date().toISOString(),
      }),
    ),
  );
}

export async function getActivePurchase(firestore: Firestore | null, userId: string) {
  const db = ensureFirestore(firestore);
  const snapshot = await db.collection("payments").where("user_id", "==", userId).get();
  const completedPayments = snapshot.docs
    .map((entry: QueryDocumentSnapshot) => entry.data())
    .filter((payment: DocumentData) => payment.status === "completed")
    .sort((left: DocumentData, right: DocumentData) => String(right.created_at || "").localeCompare(String(left.created_at || "")));

  if (!completedPayments.length) {
    return null;
  }

  const payment = completedPayments[0];
  return {
    plan: payment.plan || null,
    amount: payment.amount || null,
    provider: payment.provider || null,
    reference: payment.reference || null,
    created_at: payment.created_at || null,
  };
}

export function hasDashboardAccess(plan: string | null) {
  return Boolean(plan);
}

export async function assertPaymentsTableReady(firestore: Firestore | null) {
  ensureFirestore(firestore);
}

export async function getUnlockedPhaseSlugs(firestore: Firestore | null, userId: string) {
  const db = ensureFirestore(firestore);
  const snapshot = await db.collection("payment_phase_access").where("user_id", "==", userId).get();
  return snapshot.docs
    .map((entry: QueryDocumentSnapshot) => entry.data().phase_slug as string | undefined)
    .filter((phaseSlug: string | undefined): phaseSlug is string => Boolean(phaseSlug));
}

export async function hasPhaseAccess(firestore: Firestore | null, userId: string, phaseSlug: string) {
  const db = ensureFirestore(firestore);
  const accessSnapshot = await db.collection("payment_phase_access").doc(paymentAccessId(userId, phaseSlug)).get();
  return accessSnapshot.exists;
}