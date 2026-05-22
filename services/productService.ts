import {
  addDoc,
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "@/firebase/firebaseConfig";

export type ProductInput = {
  name: string;
  description: string;
  price: string;
  image: string;
  category?: string;
  createdAt?: Date;
};

export const addProduct = async (productData: ProductInput) => {
  return await addDoc(collection(db, "products"), productData);
};

export const getProducts = async () => {
  const querySnapshot = await getDocs(collection(db, "products"));

  const products: any[] = [];

  querySnapshot.forEach((docSnap) => {
    products.push({
      id: docSnap.id,
      ...docSnap.data(),
    });
  });

  return products;
};

export const getSingleProduct = async (id: string) => {
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
    };
  }

  return null;
};

export const updateProduct = async (id: string, productData: ProductInput) => {
  await updateDoc(doc(db, "products", id), {
    ...productData,
    updatedAt: new Date(),
  });
};

export const deleteProduct = async (id: string) => {
  await deleteDoc(doc(db, "products", id));
};
