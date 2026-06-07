import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

const AUTH_EMAIL_DOMAIN = "designdrape.app";

export function normalizePhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");

  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return digits.slice(1);
  }
  if (digits.length === 10) {
    return digits;
  }

  return null;
}

export function phoneToAuthEmail(phone: string): string {
  return `${phone}@${AUTH_EMAIL_DOMAIN}`;
}

export function validatePin(pin: string): boolean {
  return /^\d{6}$/.test(pin);
}

export function formatPhoneDisplay(phone: string): string {
  const normalized = normalizePhone(phone) || phone.replace(/\D/g, "");
  if (normalized.length === 10) {
    return `+91 ${normalized.slice(0, 5)} ${normalized.slice(5)}`;
  }
  return phone;
}

export async function isPhoneInUse(
  phone: string,
  excludeUid?: string
): Promise<boolean> {
  const q = query(collection(db, "users"), where("phoneNumber", "==", phone));
  const snap = await getDocs(q);

  for (const docSnap of snap.docs) {
    const uid = (docSnap.data().uid as string) || docSnap.id;
    if (excludeUid && uid === excludeUid) continue;
    return true;
  }

  return false;
}

export function mapAuthError(error: unknown): string {
  const code =
    error && typeof error === "object" && "code" in error
      ? String((error as { code: string }).code)
      : "";

  switch (code) {
    case "auth/email-already-in-use":
      return "Mobile number already used";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-login-credentials":
      return "Invalid mobile number or PIN";
    case "auth/weak-password":
      return "PIN must be exactly 6 digits";
    default:
      return error instanceof Error ? error.message : "Something went wrong";
  }
}
