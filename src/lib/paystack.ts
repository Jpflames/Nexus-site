import { createHmac } from "crypto";

export function formatPaystackAmount(amount: number) {
  return amount * 100;
}

export function verifyPaystackWebhookSignature(body: string, signature: string) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return false;
  const hash = createHmac("sha512", secret).update(body).digest("hex");
  return hash === signature;
}

export async function initializePaystackTransaction({
  email,
  amount,
  reference,
  plan,
  phaseSlugs,
  paymentType,
  callbackUrl,
}: {
  email: string;
  amount: number;
  reference: string;
  plan: string;
  phaseSlugs: string[];
  paymentType: string;
  callbackUrl: string;
}) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    throw new Error("Missing Paystack secret key.");
  }

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: formatPaystackAmount(amount),
      currency: "NGN",
      reference,
      callback_url: callbackUrl,
      metadata: { plan, phase_slugs: phaseSlugs, payment_type: paymentType },
    }),
  });

  const data = await response.json();
  if (!data?.status) {
    throw new Error(data?.message || "Unable to initialize Paystack transaction.");
  }

  return data.data;
}

export async function verifyPaystackTransaction(reference: string) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    throw new Error("Missing Paystack secret key.");
  }

  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: {
      Authorization: `Bearer ${secret}`,
    },
    cache: "no-store",
  });

  const data = await response.json();
  if (!data?.status) {
    throw new Error(data?.message || "Unable to verify Paystack transaction.");
  }

  return data.data as {
    status?: string;
    reference?: string;
    metadata?: Record<string, unknown>;
  };
}
