import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/firebase-session";
import { getFirebaseFirestore } from "@/lib/firebase-admin";
import { initializePaystackTransaction } from "@/lib/paystack";
import { assertPaymentsTableReady, createPendingPayment, PaymentSchemaMissingError } from "@/lib/payments";
import { getPaymentPlan } from "@/lib/payment-plans";

export async function POST(request: Request) {
  const session = await getAuthenticatedUser();
  const firestore = getFirebaseFirestore();

  if (!session || !session.email || !session.uid) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const plan = body?.plan;
  const provider = body?.provider;

  if (!plan || provider !== "paystack") {
    return NextResponse.json({ error: "Invalid checkout request." }, { status: 400 });
  }

  const selectedPlan = getPaymentPlan(plan);
  if (!selectedPlan) {
    return NextResponse.json({ error: "Selected plan is not supported." }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const reference = `nexus_${session.uid}_${Date.now()}`;
  const callbackUrl = `${appUrl}/success?provider=paystack&plan=${encodeURIComponent(selectedPlan.title)}&reference=${encodeURIComponent(reference)}`;

  try {
    await assertPaymentsTableReady(firestore);
  } catch (error) {
    if (error instanceof PaymentSchemaMissingError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    throw error;
  }

  const transaction = await initializePaystackTransaction({
    email: session.email,
    amount: selectedPlan.price,
    reference,
    plan: selectedPlan.title,
    phaseSlugs: selectedPlan.phaseSlugs,
    paymentType: selectedPlan.paymentType,
    callbackUrl,
  });

  try {
    await createPendingPayment(
      firestore,
      session.uid,
      selectedPlan.title,
      selectedPlan.price,
      provider,
      transaction.reference,
      selectedPlan.phaseSlugs,
      selectedPlan.paymentType,
    );
  } catch (error) {
    if (error instanceof PaymentSchemaMissingError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    throw error;
  }

  return NextResponse.json({
    success: true,
    provider,
    plan: selectedPlan.title,
    redirectUrl: transaction.authorization_url,
    reference: transaction.reference,
  });
}
