import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { collection, getDocs } from "firebase/firestore";

import { auth, secondaryAuth, db } from "@/firebase/firebaseConfig";

import type { Customer } from "@/types";

// GET ALL USERS (including admins)
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

// GET CUSTOMERS ONLY
export const getCustomers = async (): Promise<Customer[]> => {
  const users = await getAllUsers();
  return users.filter((u) => u.role === "customer") as Customer[];
};

// ADMIN — CREATE CUSTOMER (Auth + Firestore)
export const createCustomerByAdmin = async (data: {
  name: string;
  email: string;
  phoneNumber: string;
  address?: string;
  notes?: string;
  password: string;
}) => {
  const userCredential = await createUserWithEmailAndPassword(
    secondaryAuth,
    data.email,
    data.password
  );

  // Keep admin session — sign out secondary only
  await signOut(secondaryAuth);

  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name: data.name,
    email: data.email,
    phoneNumber: data.phoneNumber,
    address: data.address || "",
    notes: data.notes || "",
    role: "customer",
    createdAt: new Date(),
    createdByAdmin: true,
  });

  return user.uid;
};

// ADMIN — UPDATE CUSTOMER PROFILE
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
    name: data.name,
    phoneNumber: data.phoneNumber,
    address: data.address || "",
    notes: data.notes || "",
    updatedAt: new Date(),
  });
};

// ADMIN — DELETE CUSTOMER (Firestore profile only)
export const deleteCustomer = async (uid: string) => {
  await deleteDoc(doc(db, "users", uid));
};

// REGISTER USER (self-signup)
export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name,
    email,
    phoneNumber: "",
    address: "",
    notes: "",
    role: "customer",
    createdAt: new Date(),
  });

  return userCredential;
};

// LOGIN USER
export const loginUser = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// LOGOUT
export const logoutUser = async () => {
  return await signOut(auth);
};

// GET USER ROLE
export const getUserRole = async (uid: string) => {
  const userDoc = await getDoc(doc(db, "users", uid));
  return userDoc.data();
};
