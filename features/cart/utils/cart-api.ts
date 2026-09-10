import { apiClient } from "@/lib/axios";
import { AddCartItemPayload, CartResponse } from "../types/cart";
import axios from "axios";

const CART_SESSION_KEY = "lumiphoto_cart_session_id";

/**
 * Retrieves the existing cart session ID from localStorage or creates a new UUID v4.
 */
export function getOrCreateCartSessionId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  let sessionId = localStorage.getItem(CART_SESSION_KEY);
  if (!sessionId) {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      sessionId = crypto.randomUUID();
    } else {
      sessionId = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }
    localStorage.setItem(CART_SESSION_KEY, sessionId);
  }
  return sessionId;
}

/**
 * Updates the stored session ID (e.g. when confirmed by the server response).
 */
export function setCartSessionId(sessionId: string): void {
  if (typeof window !== "undefined" && sessionId) {
    localStorage.setItem(CART_SESSION_KEY, sessionId);
  }
}

/**
 * Add item to cart via POST /carts/:sessionId/items using axios
 */
export async function addItemToCart(
  sessionId: string,
  payload: AddCartItemPayload
): Promise<CartResponse> {
  const cleanSessionId = sessionId.trim();
  const url = `/carts/${encodeURIComponent(cleanSessionId)}/items`;

  try {
    const response = await apiClient.post<CartResponse>(url, payload);
    const json = response.data;

    if (!json || json.success === false) {
      throw new Error(json?.message || "Failed to add item to cart");
    }

    if (json.data?.sessionId) {
      setCartSessionId(json.data.sessionId);
    }

    return json;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response?.data?.message;
      throw new Error(
        serverMessage ||
          error.message ||
          `Failed to add item to cart (${error.response?.status || 500})`
      );
    }
    throw error;
  }
}

/**
 * Fetch current cart contents via GET /carts/:sessionId using axios
 */
export async function fetchCart(sessionId: string): Promise<CartResponse | null> {
  if (!sessionId) return null;
  const url = `/carts/${encodeURIComponent(sessionId.trim())}`;

  try {
    const response = await apiClient.get<CartResponse>(url);
    const json = response.data;
    return json?.success ? json : null;
  } catch (err) {
    console.error("Failed to fetch cart via axios:", err);
    return null;
  }
}
