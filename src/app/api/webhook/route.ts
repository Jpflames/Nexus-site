import { NextResponse } from "next/server";
import { getFirebaseFirestore } from "@/lib/firebase-admin";
import { verifyPaystackWebhookSignature } from "@/lib/paystack";
import { markPaymentComplete } from "@/lib/payments";

export async function POST(request: Request) {
  const signature = request.headers.get("x-paystack-signature") || request.headers.get("verif-hash");
  const body = await request.text();

  if (!signature || !verifyPaystackWebhookSignature(body, signature)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  let payload: { event?: string; data?: { status?: string; reference?: string; metadata?: Record<string, unknown> } } = {};
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid webhook payload." }, { status: 400 });
  }

  if (payload.event !== "charge.success" || payload.data?.status !== "success") {
    return NextResponse.json({ success: true, message: "Webhook event ignored." });
  }

  const reference = payload.data.reference;
  if (!reference) {
    return NextResponse.json({ error: "Missing payment reference." }, { status: 400 });
  }

  const firestore = getFirebaseFirestore();
  try {
    await markPaymentComplete(firestore, reference, payload.data.metadata || null);
  } catch (error) {
    console.error("Error confirming payment in webhook:", error);
    return NextResponse.json({ error: "Internal database error." }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: "Payment recorded successfully." });
}
