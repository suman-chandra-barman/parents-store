import { env } from "@/config/env";
import {
  CreateOrderPayload,
  CreateOrderResponse,
  PriceListResponse,
  PriceListFormatItem,
} from "../types/orders";

/**
 * Fetch price list formats by PriceList ID.
 */
export async function fetchPriceList(priceListId: string): Promise<PriceListFormatItem[]> {
  if (!priceListId) return [];
  const url = `${env.baseUrl}/price-lists/${priceListId}`;

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      console.warn(`Failed to fetch price list ${priceListId}: ${response.status}`);
      return [];
    }

    const json: PriceListResponse = await response.json();
    return json?.data?.format || [];
  } catch (error) {
    console.error(`Error fetching price list ${priceListId}:`, error);
    return [];
  }
}

/**
 * Fallback: fetch all price lists to find available formats if specific price list ID is missing.
 */
export async function fetchAllPriceLists(): Promise<PriceListFormatItem[]> {
  const url = `${env.baseUrl}/price-lists`;

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return [];

    const json = await response.json();
    const lists = json?.data || [];
    if (Array.isArray(lists) && lists.length > 0) {
      const defaultList =
        lists.find((l: { isDefault?: boolean }) => l.isDefault) || lists[0];
      return defaultList?.format || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching price lists fallback:", error);
    return [];
  }
}

/**
 * Create order via POST /orders
 */
export async function submitCreateOrder(
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> {
  const url = `${env.baseUrl}/orders`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json: CreateOrderResponse = await response.json().catch(() => ({
    success: false,
    statusCode: response.status,
    message: `HTTP error ${response.status}`,
  }));

  if (!response.ok || json.success === false) {
    throw new Error(json.message || `Failed to create order (${response.status})`);
  }

  return json;
}
