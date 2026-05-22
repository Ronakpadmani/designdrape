import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/firebase/firebaseConfig";


// SAVE MEASUREMENTS
export const saveMeasurement =
  async (
    measurementData: any
  ) => {

    return await addDoc(
      collection(
        db,
        "measurements"
      ),
      measurementData
    );
  };


// GET USER MEASUREMENTS
export const getUserMeasurements =
  async (
    userId: string
  ) => {

    const q = query(
      collection(
        db,
        "measurements"
      ),

      where(
        "userId",
        "==",
        userId
      )
    );

    const querySnapshot =
      await getDocs(q);

    const measurements: any[] = [];

    querySnapshot.forEach((doc) => {

      measurements.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return measurements;
  };