"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type CartItem = {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];

  addToCart: (
    product: CartItem
  ) => void;

  removeFromCart: (
    id: string
  ) => void;

  increaseQuantity: (
    id: string
  ) => void;

  decreaseQuantity: (
    id: string
  ) => void;
};

const CartContext =
  createContext<CartContextType>({
    cartItems: [],

    addToCart: () => {},

    removeFromCart: () => {},

    increaseQuantity: () => {},

    decreaseQuantity: () => {},
  });

export const CartProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  const [cartItems, setCartItems] =
    useState<CartItem[]>([]);


  // LOAD CART
  useEffect(() => {

    const storedCart =
      localStorage.getItem("cart");

    if (storedCart) {

      setCartItems(
        JSON.parse(storedCart)
      );
    }

  }, []);


  // SAVE CART
  useEffect(() => {

    localStorage.setItem(
      "cart",
      JSON.stringify(cartItems)
    );

  }, [cartItems]);


  // ADD TO CART
  const addToCart = (
    product: CartItem
  ) => {

    console.log(
      "ADDING PRODUCT:",
      product
    );

    setCartItems((prevItems) => {

      const existingItem =
        prevItems.find(
          (item) =>
            item.id === product.id
        );

      if (existingItem) {

        return prevItems.map(
          (item) =>

            item.id === product.id
              ? {
                  ...item,
                  quantity:
                    item.quantity + 1,
                }
              : item
        );
      }

      return [
        ...prevItems,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };


  // REMOVE
  const removeFromCart = (
    id: string
  ) => {

    setCartItems((prevItems) =>

      prevItems.filter(
        (item) =>
          item.id !== id
      )
    );
  };


  // INCREASE
  const increaseQuantity = (
    id: string
  ) => {

    setCartItems((prevItems) =>

      prevItems.map((item) =>

        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  };


  // DECREASE
  const decreaseQuantity = (
    id: string
  ) => {

    setCartItems((prevItems) =>

      prevItems
        .map((item) =>

          item.id === id
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )

        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  };

  return (

    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
      }}
    >

      {children}

    </CartContext.Provider>
  );
};

export const useCart = () =>
  useContext(CartContext);