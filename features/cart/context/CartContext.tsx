"use client";

import React, {
  createContext,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import { toast } from "sonner";
import { CartData, AddCartItemPayload, CartResponse } from "../types/cart";
import { getOrCreateCartSessionId } from "../utils/cart-api";
import { useGetCartQuery, useAddToCartMutation } from "../api/cartApi";
import { useTenantStore } from "@/stores/useTenantStore";
import { parseErrorMessage } from "@/utils/parseErrorMessage";

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
  const [sessionId] = useState<string>(() => {
    return getOrCreateCartSessionId();
  });

  const {
    data: cartResponse,
    isLoading,
    refetch,
  } = useGetCartQuery(sessionId, {
    skip: !sessionId || !tenant?.id,
  });

  const [addToCartMutation, { isLoading: isAdding }] = useAddToCartMutation();

  const cart = cartResponse?.data || null;

  const refreshCart = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const addToCart = useCallback(
    async (payload: AddCartItemPayload): Promise<CartResponse> => {
      const currentTenantId =
        tenant?.id || useTenantStore.getState().tenant?.id;

      if (!currentTenantId) {
        const msg = "Tenant context is missing. Please wait for tenant to load.";
        toast.error(msg);
        throw new Error(msg);
      }

      const activeSessionId = sessionId || getOrCreateCartSessionId();

      try {
        const response = await addToCartMutation({
          sessionId: activeSessionId,
          payload,
        }).unwrap();
        toast.success("Added to cart successfully 🛒");
        return response;
      } catch (error: unknown) {
        const message = parseErrorMessage(
          error,
          "Failed to add item to cart. Please try again."
        );
        toast.error(message);
        throw error;
      }
    },
    [tenant?.id, sessionId, addToCartMutation]
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
