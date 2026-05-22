import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { auth, db } from "@/firebase/firebaseConfig";

// GET ALL CUSTOMERS
export const getAllUsers =
  async () => {

    const querySnapshot =
      await getDocs(
        collection(db, "users")
      );

    const users: any[] = [];

    querySnapshot.forEach((doc) => {

      users.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return users;
};
// REGISTER USER
export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {

  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

  const user = userCredential.user;

  // SAVE USER IN FIRESTORE
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name,
    email,
    role: "customer",
    createdAt: new Date(),
  });

  return userCredential;
};


// LOGIN USER
export const loginUser = async (
  email: string,
  password: string
) => {

  return await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
};


// LOGOUT
export const logoutUser = async () => {

  return await signOut(auth);
};


// GET USER ROLE
export const getUserRole = async (
  uid: string
) => {

  const userDoc = await getDoc(
    doc(db, "users", uid)
  );

  return userDoc.data();
};