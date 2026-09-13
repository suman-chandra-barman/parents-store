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
import {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemQuantityMutation,
  useRemoveCartItemMutation,
  useApplyGiftVoucherMutation,
  useRemoveGiftVoucherMutation,
  useClearCartMutation,
} from "../api/cartApi";
import { useTenantStore } from "@/stores/useTenantStore";
import { parseErrorMessage } from "@/utils/parseErrorMessage";

export interface CartContextValue {
  sessionId: string;
  cart: CartData | null;
  itemCount: number;
  isLoading: boolean;
  isFetching: boolean;
  isAdding: boolean;
  isUpdating: boolean;
  isRemoving: boolean;
  isApplyingVoucher: boolean;
  isRemovingVoucher: boolean;
  addToCart: (payload: AddCartItemPayload) => Promise<CartResponse>;
  updateItemQuantity: (itemId: number | string, quantity: number) => Promise<CartResponse>;
  removeItem: (itemId: number | string) => Promise<CartResponse>;
  applyVoucher: (code: string) => Promise<CartResponse>;
  removeVoucher: () => Promise<CartResponse>;
  clearCart: () => Promise<CartResponse>;
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
    isLoading: isGetLoading,
    isFetching,
    refetch,
  } = useGetCartQuery(sessionId, {
    skip: !sessionId || !tenant?.id,
  });

  const [addToCartMutation, { isLoading: isAdding }] = useAddToCartMutation();
  const [updateQuantityMutation, { isLoading: isUpdating }] =
    useUpdateCartItemQuantityMutation();
  const [removeItemMutation, { isLoading: isRemoving }] =
    useRemoveCartItemMutation();
  const [applyVoucherMutation, { isLoading: isApplyingVoucher }] =
    useApplyGiftVoucherMutation();
  const [removeVoucherMutation, { isLoading: isRemovingVoucher }] =
    useRemoveGiftVoucherMutation();
  const [clearCartMutation] = useClearCartMutation();

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

  const updateItemQuantity = useCallback(
    async (
      itemId: number | string,
      quantity: number
    ): Promise<CartResponse> => {
      const activeSessionId = sessionId || getOrCreateCartSessionId();
      try {
        const response = await updateQuantityMutation({
          sessionId: activeSessionId,
          itemId,
          quantity,
        }).unwrap();
        toast.success("Cart updated");
        return response;
      } catch (error: unknown) {
        const message = parseErrorMessage(
          error,
          "Failed to update item quantity."
        );
        toast.error(message);
        throw error;
      }
    },
    [sessionId, updateQuantityMutation]
  );

  const removeItem = useCallback(
    async (itemId: number | string): Promise<CartResponse> => {
      const activeSessionId = sessionId || getOrCreateCartSessionId();
      try {
        const response = await removeItemMutation({
          sessionId: activeSessionId,
          itemId,
        }).unwrap();
        toast.success("Item removed from cart");
        return response;
      } catch (error: unknown) {
        const message = parseErrorMessage(
          error,
          "Failed to remove item from cart."
        );
        toast.error(message);
        throw error;
      }
    },
    [sessionId, removeItemMutation]
  );

  const applyVoucher = useCallback(
    async (code: string): Promise<CartResponse> => {
      const activeSessionId = sessionId || getOrCreateCartSessionId();
      try {
        const response = await applyVoucherMutation({
          sessionId: activeSessionId,
          code,
        }).unwrap();
        toast.success("Gift voucher applied! 🎉");
        return response;
      } catch (error: unknown) {
        const message = parseErrorMessage(
          error,
          "Failed to apply gift voucher. Please check the code."
        );
        toast.error(message);
        throw error;
      }
    },
    [sessionId, applyVoucherMutation]
  );

  const removeVoucher = useCallback(async (): Promise<CartResponse> => {
    const activeSessionId = sessionId || getOrCreateCartSessionId();
    try {
      const response = await removeVoucherMutation(activeSessionId).unwrap();
      toast.info("Gift voucher removed");
      return response;
    } catch (error: unknown) {
      const message = parseErrorMessage(
        error,
        "Failed to remove gift voucher."
      );
      toast.error(message);
      throw error;
    }
  }, [sessionId, removeVoucherMutation]);

  const clearCart = useCallback(async (): Promise<CartResponse> => {
    const activeSessionId = sessionId || getOrCreateCartSessionId();
    try {
      const response = await clearCartMutation(activeSessionId).unwrap();
      toast.info("Cart cleared");
      return response;
    } catch (error: unknown) {
      const message = parseErrorMessage(error, "Failed to clear cart.");
      toast.error(message);
      throw error;
    }
  }, [sessionId, clearCartMutation]);

  const itemCount = useMemo(() => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => total + (item.quantity || 1), 0);
  }, [cart]);

  const isLoading = (!tenant?.id && isGetLoading) || (isGetLoading && !cartResponse);

  const contextValue = useMemo<CartContextValue>(
    () => ({
      sessionId,
      cart,
      itemCount,
      isLoading,
      isFetching,
      isAdding,
      isUpdating,
      isRemoving,
      isApplyingVoucher,
      isRemovingVoucher,
      addToCart,
      updateItemQuantity,
      removeItem,
      applyVoucher,
      removeVoucher,
      clearCart,
      refreshCart,
    }),
    [
      sessionId,
      cart,
      itemCount,
      isLoading,
      isFetching,
      isAdding,
      isUpdating,
      isRemoving,
      isApplyingVoucher,
      isRemovingVoucher,
      addToCart,
      updateItemQuantity,
      removeItem,
      applyVoucher,
      removeVoucher,
      clearCart,
      refreshCart,
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}

