import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/firebase/firebaseConfig";


// PLACE ORDER
export const placeOrder =
  async (
    orderData: any
  ) => {

    return await addDoc(
      collection(db, "orders"),
      orderData
    );
  };


// GET USER ORDERS
export const getUserOrders =
  async (
    userId: string
  ) => {

    const q = query(
      collection(db, "orders"),

      where(
        "userId",
        "==",
        userId
      )
    );

    const querySnapshot =
      await getDocs(q);

    const orders: any[] = [];

    querySnapshot.forEach((doc) => {

      orders.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return orders;
  };


// GET ALL ORDERS
export const getAllOrders =
  async () => {

    const querySnapshot =
      await getDocs(
        collection(db, "orders")
      );

    const orders: any[] = [];

    querySnapshot.forEach((doc) => {

      orders.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return orders;
  };


// UPDATE STATUS
export const updateOrderStatus =
  async (
    orderId: string,
    status: string
  ) => {

    const orderRef =
      doc(
        db,
        "orders",
        orderId
      );

    return await updateDoc(
      orderRef,
      { status }
    );
  };