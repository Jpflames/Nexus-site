import type { SupabaseClient } from "@supabase/supabase-js";

export type PaymentStatus = "pending" | "completed" | "failed";

type SupabaseErrorLike = {
  code?: string;
  message?: string;
};

export class PaymentSchemaMissingError extends Error {
  constructor() {
    super("Payment storage is not set up yet. Run the Supabase payment schema before using checkout.");
    this.name = "PaymentSchemaMissingError";
  }
}

function isMissingPaymentsTableError(error: SupabaseErrorLike) {
  const message = error.message || "";
  return (
    error.code === "PGRST205" ||
    error.code === "42P01" ||
    message.includes("Could not find the table 'public.payments'") ||
    message.includes("Could not find the table 'public.payment_phase_access'") ||
    message.includes('relation "public.payments" does not exist') ||
    message.includes('relation "public.payment_phase_access" does not exist')
  );
}

function throwPaymentError(error: SupabaseErrorLike) {
  if (isMissingPaymentsTableError(error)) {
    throw new PaymentSchemaMissingError();
  }
  throw new Error(error.message || "Unable to process payment data.");
}

export async function createPendingPayment(
  supabase: SupabaseClient,
  userId: string,
  plan: string,
  amount: number,
  provider: string,
  reference: string,
  phaseSlugs: string[],
  paymentType: string,
) {
  const { error } = await supabase.from("payments").insert([
    {
      user_id: userId,
      plan,
      amount,
      provider,
      status: "pending",
      reference,
      selected_phases: phaseSlugs,
      payment_type: paymentType,
    },
  ]);
  if (error) {
    throwPaymentError(error);
  }
}

export async function markPaymentComplete(
  supabase: SupabaseClient,
  reference: string,
  metadata: Record<string, unknown> | null,
) {
  const { data: pendingPayment, error } = await supabase
    .from("payments")
    .update({
      status: "completed",
      metadata,
    })
    .eq("reference", reference)
    .eq("status", "pending")
    .select("id,user_id,selected_phases")
    .maybeSingle();

  if (error) {
    throwPaymentError(error);
  }

  let data = pendingPayment;

  if (!data) {
    const { data: completedPayment, error: completedPaymentError } = await supabase
      .from("payments")
      .select("id,user_id,selected_phases")
      .eq("reference", reference)
      .eq("status", "completed")
      .maybeSingle();

    if (completedPaymentError) {
      throwPaymentError(completedPaymentError);
    }

    if (!completedPayment) {
      return;
    }

    data = completedPayment;
  }

  const selectedPhases = Array.isArray(data.selected_phases) ? data.selected_phases.filter(Boolean) : [];
  if (!selectedPhases.length) {
    return;
  }

  const { error: accessError } = await supabase.from("payment_phase_access").upsert(
    selectedPhases.map((phaseSlug) => ({
      payment_id: data.id,
      user_id: data.user_id,
      phase_slug: phaseSlug,
    })),
    { onConflict: "user_id,phase_slug" },
  );

  if (accessError) {
    throwPaymentError(accessError);
  }
}

export async function getActivePurchase(
  supabase: SupabaseClient,
  userId: string,
) {
  const { data, error } = await supabase
    .from("payments")
    .select("plan,amount,provider,reference,created_at")
    .eq("user_id", userId)
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    if (isMissingPaymentsTableError(error)) {
      return null;
    }
    throwPaymentError(error);
  }

  return data?.[0] || null;
}

export function hasDashboardAccess(plan: string | null) {
  return Boolean(plan);
}

export async function assertPaymentsTableReady(supabase: SupabaseClient) {
  const { error } = await supabase.from("payment_phase_access").select("id", { count: "exact", head: true });
  if (error) {
    throwPaymentError(error);
  }
}

export async function getUnlockedPhaseSlugs(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("payment_phase_access")
    .select("phase_slug")
    .eq("user_id", userId);

  if (error) {
    if (isMissingPaymentsTableError(error)) {
      return [];
    }
    throwPaymentError(error);
  }

  return data?.map((item) => item.phase_slug).filter(Boolean) || [];
}

export async function hasPhaseAccess(supabase: SupabaseClient, userId: string, phaseSlug: string) {
  const { data, error } = await supabase
    .from("payment_phase_access")
    .select("id")
    .eq("user_id", userId)
    .eq("phase_slug", phaseSlug)
    .limit(1);

  if (error) {
    if (isMissingPaymentsTableError(error)) {
      return false;
    }
    throwPaymentError(error);
  }

  return Boolean(data?.length);
}
