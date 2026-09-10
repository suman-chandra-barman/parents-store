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
    if (
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
    ) {
      sessionId = crypto.randomUUID();
    } else {
      sessionId = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        },
      );
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
