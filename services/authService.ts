import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";

import { auth, secondaryAuth, db } from "@/firebase/firebaseConfig";

import {
  normalizePhone,
  phoneToAuthEmail,
  validatePin,
  isPhoneInUse,
  mapAuthError,
} from "@/lib/phoneAuth";

import type { Customer } from "@/types";

export const getAllUsers = async () => {
  const querySnapshot = await getDocs(collection(db, "users"));

  const users: any[] = [];

  querySnapshot.forEach((docSnap) => {
    users.push({
      id: docSnap.id,
      ...docSnap.data(),
    });
  });

  return users;
};

export const getCustomers = async (): Promise<Customer[]> => {
  const users = await getAllUsers();
  return users.filter((u) => u.role === "customer") as Customer[];
};

export const createCustomerByAdmin = async (data: {
  name: string;
  phoneNumber: string;
  pin: string;
  address?: string;
  notes?: string;
}) => {
  const phone = normalizePhone(data.phoneNumber);
  if (!phone) {
    throw new Error("Please enter a valid 10-digit mobile number");
  }

  if (!validatePin(data.pin)) {
    throw new Error("PIN must be exactly 6 digits");
  }

  if (await isPhoneInUse(phone)) {
    throw new Error("Mobile number already used");
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      secondaryAuth,
      phoneToAuthEmail(phone),
      data.pin
    );

    await signOut(secondaryAuth);

    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: data.name.trim(),
      email: "",
      phoneNumber: phone,
      address: data.address?.trim() || "",
      notes: data.notes?.trim() || "",
      role: "customer",
      createdAt: new Date(),
      createdByAdmin: true,
    });

    return user.uid;
  } catch (error) {
    throw new Error(mapAuthError(error));
  }
};

export const updateCustomer = async (
  uid: string,
  data: {
    name: string;
    phoneNumber: string;
    address?: string;
    notes?: string;
  }
) => {
  await updateDoc(doc(db, "users", uid), {
    name: data.name.trim(),
    phoneNumber: data.phoneNumber.trim(),
    address: data.address?.trim() || "",
    notes: data.notes?.trim() || "",
    updatedAt: new Date(),
  });
};

export const resetCustomerPin = async (uid: string, newPin: string) => {
  if (!validatePin(newPin)) {
    throw new Error("PIN must be exactly 6 digits");
  }

  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("You must be logged in as admin");
  }

  const token = await currentUser.getIdToken();

  const res = await fetch("/api/customers/reset-pin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ uid, newPin }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to reset PIN");
  }
};

export const deleteCustomer = async (uid: string) => {
  await deleteDoc(doc(db, "users", uid));
};

export const registerUser = async (
  name: string,
  phoneInput: string,
  pin: string
) => {
  const phone = normalizePhone(phoneInput);
  if (!phone) {
    throw new Error("Please enter a valid 10-digit mobile number");
  }

  if (!validatePin(pin)) {
    throw new Error("PIN must be exactly 6 digits");
  }

  if (await isPhoneInUse(phone)) {
    throw new Error("Mobile number already used");
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      phoneToAuthEmail(phone),
      pin
    );

    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: name.trim(),
      email: "",
      phoneNumber: phone,
      address: "",
      notes: "",
      role: "customer",
      createdAt: new Date(),
    });

    return userCredential;
  } catch (error) {
    throw new Error(mapAuthError(error));
  }
};

export const loginUser = async (phoneInput: string, pin: string) => {
  const phone = normalizePhone(phoneInput);
  if (!phone) {
    throw new Error("Please enter a valid 10-digit mobile number");
  }

  if (!validatePin(pin)) {
    throw new Error("PIN must be exactly 6 digits");
  }

  try {
    return await signInWithEmailAndPassword(
      auth,
      phoneToAuthEmail(phone),
      pin
    );
  } catch (error) {
    throw new Error(mapAuthError(error));
  }
};

/** Admin login — email + password (legacy admin accounts) */
export const loginAdmin = async (email: string, password: string) => {
  try {
    return await signInWithEmailAndPassword(auth, email.trim(), password);
  } catch (error) {
    throw new Error(mapAuthError(error));
  }
};

export const logoutUser = async () => {
  return await signOut(auth);
};

export const getUserRole = async (uid: string) => {
  const userDoc = await getDoc(doc(db, "users", uid));
  return userDoc.data();
};
