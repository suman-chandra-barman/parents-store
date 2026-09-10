"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { toast } from "sonner";
import {
  CartData,
  AddCartItemPayload,
  CartResponse,
} from "../types/cart";
import {
  getOrCreateCartSessionId,
  addItemToCart,
  fetchCart,
} from "../utils/cart-api";

export interface CartContextValue {
  sessionId: string;
  cart: CartData | null;
  itemCount: number;
  isLoading: boolean;
  isAdding: boolean;
  addToCart: (payload: AddCartItemPayload) => Promise<CartResponse>;
  refreshCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextValue | undefined>(
  undefined
);

export function CartProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionId] = useState<string>(() => {
    return getOrCreateCartSessionId();
  });
  const [cart, setCart] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // Fetch initial cart state if session ID exists
  const refreshCart = useCallback(async () => {
    if (!sessionId) return;
    setIsLoading(true);
    try {
      const response = await fetchCart(sessionId);
      if (response?.data) {
        setCart(response.data);
      }
    } catch (error) {
      console.error("Cart refresh failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;
    let isMounted = true;

    fetchCart(sessionId).then((response) => {
      if (isMounted && response?.data) {
        setCart(response.data);
      }
    }).catch((err) => {
      console.error("Cart load failed:", err);
    });

    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  const addToCart = useCallback(
    async (payload: AddCartItemPayload): Promise<CartResponse> => {
      let activeSessionId = sessionId;
      if (!activeSessionId) {
        activeSessionId = getOrCreateCartSessionId();
        setSessionId(activeSessionId);
      }

      setIsAdding(true);
      try {
        const response = await addItemToCart(activeSessionId, payload);
        if (response?.data) {
          setCart(response.data);
        }
        toast.success("Added to cart successfully 🛒");
        return response;
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to add item to cart. Please try again.";
        toast.error(message);
        throw error;
      } finally {
        setIsAdding(false);
      }
    },
    [sessionId]
  );

  const itemCount = useMemo(() => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => total + (item.quantity || 1), 0);
  }, [cart]);

  const contextValue = useMemo<CartContextValue>(
    () => ({
      sessionId,
      cart,
      itemCount,
      isLoading,
      isAdding,
      addToCart,
      refreshCart,
    }),
    [sessionId, cart, itemCount, isLoading, isAdding, addToCart, refreshCart]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}
