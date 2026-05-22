import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "@/firebase/firebaseConfig";

import type { Measurement } from "@/types";

export type MeasurementInput = Omit<
  Measurement,
  "id" | "createdAt" | "updatedAt"
>;

// CREATE
export const saveMeasurement = async (measurementData: MeasurementInput) => {
  return await addDoc(collection(db, "measurements"), {
    ...measurementData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

// READ — ALL (admin)
export const getAllMeasurements = async (): Promise<Measurement[]> => {
  const querySnapshot = await getDocs(collection(db, "measurements"));

  const measurements: Measurement[] = [];

  querySnapshot.forEach((docSnap) => {
    measurements.push({
      id: docSnap.id,
      ...docSnap.data(),
    } as Measurement);
  });

  return measurements.sort((a, b) => {
    const aTime = a.updatedAt || a.createdAt;
    const bTime = b.updatedAt || b.createdAt;
    if (!aTime || !bTime) return 0;
    return new Date(bTime as any).getTime() - new Date(aTime as any).getTime();
  });
};

// READ — BY USER
export const getUserMeasurements = async (userId: string) => {
  const q = query(
    collection(db, "measurements"),
    where("userId", "==", userId)
  );

  const querySnapshot = await getDocs(q);

  const measurements: Measurement[] = [];

  querySnapshot.forEach((docSnap) => {
    measurements.push({
      id: docSnap.id,
      ...docSnap.data(),
    } as Measurement);
  });

  return measurements;
};

// UPDATE
export const updateMeasurement = async (
  id: string,
  measurementData: MeasurementInput
) => {
  await updateDoc(doc(db, "measurements", id), {
    ...measurementData,
    updatedAt: new Date(),
  });
};

// DELETE
export const deleteMeasurement = async (id: string) => {
  await deleteDoc(doc(db, "measurements", id));
};
