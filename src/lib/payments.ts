import type { Firestore } from "firebase-admin/firestore";

export type PaymentStatus = "pending" | "completed" | "failed";

export async function markPaymentComplete(
  firestore: Firestore | null,
  reference: string,
  metadata?: Record<string, unknown> | null
) {
  if (!firestore) {
    throw new Error("Firestore instance is required.");
  }

  const paymentRef = firestore.collection("payments").doc(reference);
  const paymentSnap = await paymentRef.get();

  if (!paymentSnap.exists) {
    console.warn(`Payment with reference ${reference} not found in Firestore.`);
    return;
  }

  const paymentData = paymentSnap.data() as {
    uid: string;
    courseId: string;
    phaseId: string;
    amount: number;
    paymentStatus: string;
  };

  if (paymentData.paymentStatus === "completed") {
    return; // Already processed
  }

  // Update payment status
  await paymentRef.update({
    paymentStatus: "completed" as PaymentStatus,
    updatedAt: new Date().toISOString(),
  });

  const { uid, courseId, phaseId } = paymentData;

  // Create enrollment document
  const enrollmentId = `${uid}_${courseId}_${phaseId}`;
  await firestore.collection("enrollments").doc(enrollmentId).set({
    uid,
    courseId,
    phaseId,
    active: true,
    createdAt: new Date().toISOString(),
  });

  // Update users/{uid} hasEnrollment = true
  await firestore.collection("users").doc(uid).update({
    hasEnrollment: true,
  });
}

export async function getStudentEnrollments(firestore: Firestore | null, uid: string) {
  if (!firestore) return [];
  const snapshot = await firestore
    .collection("enrollments")
    .where("uid", "==", uid)
    .where("active", "==", true)
    .get();

  return snapshot.docs.map((doc) => doc.data() as { courseId: string; phaseId: string; active: boolean });
}

export async function hasPhaseAccess(firestore: Firestore | null, uid: string, courseId: string, phaseId: string) {
  if (!firestore) return false;
  const docId = `${uid}_${courseId}_${phaseId}`;
  const docSnap = await firestore.collection("enrollments").doc(docId).get();
  return docSnap.exists && docSnap.data()?.active === true;
}