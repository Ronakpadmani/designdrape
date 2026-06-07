import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let adminApp: App | null = null;

export function getFirebaseAdmin() {
  if (adminApp) {
    return {
      auth: getAuth(adminApp),
      db: getFirestore(adminApp),
    };
  }

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) {
    return null;
  }

  try {
    const serviceAccount = JSON.parse(raw);
    adminApp =
      getApps().length > 0
        ? getApps()[0]
        : initializeApp({ credential: cert(serviceAccount) });

    return {
      auth: getAuth(adminApp),
      db: getFirestore(adminApp),
    };
  } catch {
    return null;
  }
}
