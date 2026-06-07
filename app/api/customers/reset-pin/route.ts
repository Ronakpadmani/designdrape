import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebaseAdmin";
import { validatePin } from "@/lib/phoneAuth";

export async function POST(request: NextRequest) {
  const admin = getFirebaseAdmin();
  if (!admin) {
    return NextResponse.json(
      {
        error:
          "PIN reset is not configured. Add FIREBASE_SERVICE_ACCOUNT_KEY to .env.local",
      },
      { status: 503 }
    );
  }

  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { uid?: string; newPin?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { uid, newPin } = body;

  if (!uid || !newPin) {
    return NextResponse.json(
      { error: "Customer ID and new PIN are required" },
      { status: 400 }
    );
  }

  if (!validatePin(newPin)) {
    return NextResponse.json(
      { error: "PIN must be exactly 6 digits" },
      { status: 400 }
    );
  }

  try {
    const decoded = await admin.auth.verifyIdToken(token);
    const callerDoc = await admin.db.collection("users").doc(decoded.uid).get();

    if (!callerDoc.exists || callerDoc.data()?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await admin.auth.updateUser(uid, { password: newPin });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to reset PIN";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
