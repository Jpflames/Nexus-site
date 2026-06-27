import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/firebase-session";
import { getFirebaseFirestore } from "@/lib/firebase-admin";
import { initializePaystackTransaction } from "@/lib/paystack";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getAuthenticatedUser();
  const firestore = getFirebaseFirestore();

  if (!session || !session.email || !session.uid) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if (!firestore) {
    return NextResponse.json({ error: "Firebase admin credentials are not configured." }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const courseId = body?.courseId;
  const phaseId = body?.phaseId;
  const provider = body?.provider;

  if (!courseId || !phaseId || provider !== "paystack") {
    return NextResponse.json({ error: "Invalid checkout request parameters." }, { status: 400 });
  }

  try {
    // Fetch course & phase details to get the price
    const courseSnap = await firestore.collection("courses").doc(courseId).get();
    if (!courseSnap.exists) {
      return NextResponse.json({ error: "Selected course does not exist." }, { status: 404 });
    }

    const phaseSnap = await firestore
      .collection("courses")
      .doc(courseId)
      .collection("phases")
      .doc(phaseId)
      .get();

    if (!phaseSnap.exists) {
      return NextResponse.json({ error: "Selected course phase does not exist." }, { status: 404 });
    }

    const phase = phaseSnap.data() as { price?: number; title?: string };
    const price = Number(phase.price || 0);

    if (price <= 0) {
      return NextResponse.json({ error: "Invalid phase price." }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const reference = `nexus_${session.uid}_${courseId}_${phaseId}_${Date.now()}`;
    const callbackUrl = `${appUrl}/success?provider=paystack&courseId=${encodeURIComponent(courseId)}&phaseId=${encodeURIComponent(phaseId)}&reference=${encodeURIComponent(reference)}`;

    // Initialize transaction with Paystack
    const transaction = await initializePaystackTransaction({
      email: session.email,
      amount: price,
      reference,
      plan: phase.title || "Nexus Phase",
      phaseSlugs: [phaseId],
      paymentType: "single_phase",
      callbackUrl,
    });

    // Create pending payment in payments collection
    await firestore.collection("payments").doc(reference).set({
      uid: session.uid,
      courseId,
      phaseId,
      amount: price,
      transactionReference: reference,
      paymentStatus: "pending",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      provider,
      redirectUrl: transaction.authorization_url,
      reference,
    });
  } catch (error) {
    console.error("Paystack transaction initialization error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to initialize checkout. Please try again." },
      { status: 500 }
    );
  }
}
