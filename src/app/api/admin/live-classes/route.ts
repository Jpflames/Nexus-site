import { NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/admin";
import { phases } from "@/lib/nea";
import { getAuthenticatedUser } from "@/lib/firebase-session";
import { getFirebaseFirestore } from "@/lib/firebase-admin";

function asOptionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function GET() {
  const session = await getAuthenticatedUser();
  const firestore = getFirebaseFirestore();

  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if (!firestore) {
    return NextResponse.json({ error: "Firebase admin is not configured." }, { status: 500 });
  }

  try {
    const snapshot = await firestore
      .collection("live_classes")
      .orderBy("scheduled_at", "asc")
      .get();

    const classes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, classes });
  } catch (error) {
    console.error("Failed to fetch live classes:", error);
    return NextResponse.json({ error: "Failed to fetch live classes." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAuthenticatedUser();
  const firestore = getFirebaseFirestore();

  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if (!isAdminEmail(session.email)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  if (!firestore) {
    return NextResponse.json({ error: "Firebase admin credentials are not configured." }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const id = asOptionalString(body?.id);
  const phaseSlug = asOptionalString(body?.phaseSlug);
  const title = asOptionalString(body?.title);
  const description = asOptionalString(body?.description);
  const meetUrl = asOptionalString(body?.meetUrl);
  const scheduledAt = asOptionalString(body?.scheduledAt);

  if (!phaseSlug || !phases.some((phase) => phase.slug === phaseSlug)) {
    return NextResponse.json({ error: "Select a valid course phase." }, { status: 400 });
  }

  if (!title) {
    return NextResponse.json({ error: "Class title is required." }, { status: 400 });
  }

  if (!meetUrl || !meetUrl.startsWith("http")) {
    return NextResponse.json({ error: "A valid meeting URL is required." }, { status: 400 });
  }

  if (!scheduledAt) {
    return NextResponse.json({ error: "Meeting date and time are required." }, { status: 400 });
  }

  try {
    const classData = {
      phase_slug: phaseSlug,
      title,
      description,
      meet_url: meetUrl,
      scheduled_at: scheduledAt,
      updated_at: new Date().toISOString(),
      updated_by: session.uid,
    };

    if (id) {
      // Update existing live class
      const docRef = firestore.collection("live_classes").doc(id);
      await docRef.update(classData);
      return NextResponse.json({
        success: true,
        liveClass: { id, ...classData },
      });
    } else {
      // Create new live class
      const docRef = firestore.collection("live_classes").doc();
      const newClassData = {
        ...classData,
        created_at: new Date().toISOString(),
        created_by: session.uid,
      };
      await docRef.set(newClassData);
      return NextResponse.json({
        success: true,
        liveClass: { id: docRef.id, ...newClassData },
      });
    }
  } catch (error) {
    console.error("Failed to save live class:", error);
    return NextResponse.json({ error: "Unable to save live class." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getAuthenticatedUser();
  const firestore = getFirebaseFirestore();

  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if (!isAdminEmail(session.email)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  if (!firestore) {
    return NextResponse.json({ error: "Firebase admin credentials are not configured." }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Class ID is required." }, { status: 400 });
  }

  try {
    await firestore.collection("live_classes").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete live class:", error);
    return NextResponse.json({ error: "Unable to delete live class." }, { status: 500 });
  }
}
