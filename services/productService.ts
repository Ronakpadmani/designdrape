import {
  addDoc,
  collection,
  getDocs,
} from "firebase/firestore";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/firebase/firebaseConfig";


// ADD PRODUCT
export const addProduct = async (
  productData: any
) => {

  return await addDoc(
    collection(db, "products"),
    productData
  );
};


// GET PRODUCTS
export const getProducts = async () => {

  const querySnapshot =
    await getDocs(
      collection(db, "products")
    );

  const products: any[] = [];

  querySnapshot.forEach((doc) => {

    products.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  return products;
};

// GET SINGLE PRODUCT
export const getSingleProduct = async (
  id: string
) => {

  const docRef =
    doc(db, "products", id);

  const docSnap =
    await getDoc(docRef);

  if (docSnap.exists()) {

    return {
      id: docSnap.id,
      ...docSnap.data(),
    };
  }

  return null;
};