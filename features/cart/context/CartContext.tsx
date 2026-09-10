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
import { CartData, AddCartItemPayload, CartResponse } from "../types/cart";
import {
  getOrCreateCartSessionId,
  addItemToCart,
  fetchCart,
} from "../utils/cart-api";

import { useTenantStore } from "@/stores/useTenantStore";

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
  undefined,
);

export function CartProvider({ children }: { children: ReactNode }) {
  const tenant = useTenantStore((state) => state.tenant);
  const [sessionId, setSessionId] = useState<string>(() => {
    return getOrCreateCartSessionId();
  });
  const [cart, setCart] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // Fetch initial cart state if session ID exists
  const refreshCart = useCallback(async () => {
    if (!sessionId || !tenant?.id) return;
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
  }, [sessionId, tenant?.id]);

  useEffect(() => {
    if (!sessionId || !tenant?.id) return;
    let isMounted = true;

    fetchCart(sessionId)
      .then((response) => {
        if (isMounted && response?.data) {
          setCart(response.data);
        }
      })
      .catch((err) => {
        console.error("Cart load failed:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [sessionId, tenant?.id]);

  const addToCart = useCallback(
    async (payload: AddCartItemPayload): Promise<CartResponse> => {
      const currentTenantId =
        tenant?.id || useTenantStore.getState().tenant?.id;

      if (!currentTenantId) {
        const msg = "Tenant context is missing. Please wait for tenant to load.";
        toast.error(msg);
        throw new Error(msg);
      }

      let activeSessionId = sessionId;
      if (!activeSessionId) {
        activeSessionId = getOrCreateCartSessionId();
        setSessionId(activeSessionId);
      }

      setIsAdding(true);
      try {
        const response = await addItemToCart(
          activeSessionId,
          payload,
        );
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
    [sessionId, tenant?.id]
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
    [sessionId, cart, itemCount, isLoading, isAdding, addToCart, refreshCart],
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}
