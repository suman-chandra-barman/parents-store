import axios from "axios";
import { apiClient } from "@/lib/axios";
import {
  CreateOrderPayload,
  CreateOrderResponse,
  PriceListResponse,
  PriceListFormatItem,
} from "../types/orders";

/**
 * Fetch price list formats by PriceList ID using axios.
 */
export async function fetchPriceList(priceListId: string): Promise<PriceListFormatItem[]> {
  if (!priceListId) return [];

  try {
    const response = await apiClient.get<PriceListResponse>(
      `/price-lists/${encodeURIComponent(priceListId)}`
    );
    return response.data?.data?.format || [];
  } catch (error) {
    console.error(`Error fetching price list ${priceListId} via axios:`, error);
    return [];
  }
}

/**
 * Fallback: fetch all price lists to find available formats if specific price list ID is missing.
 */
export async function fetchAllPriceLists(): Promise<PriceListFormatItem[]> {
  try {
    const response = await apiClient.get<{ data?: { isDefault?: boolean; format?: PriceListFormatItem[] }[] }>(
      "/price-lists"
    );
    const lists = response.data?.data || [];
    if (Array.isArray(lists) && lists.length > 0) {
      const defaultList =
        lists.find((l) => l.isDefault) || lists[0];
      return defaultList?.format || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching price lists fallback via axios:", error);
    return [];
  }
}

/**
 * Create order via POST /orders using axios.
 */
export async function submitCreateOrder(
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> {
  try {
    const response = await apiClient.post<CreateOrderResponse>("/orders", payload);
    const json = response.data;

    if (!json || json.success === false) {
      throw new Error(json?.message || "Failed to create order");
    }

    return json;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response?.data?.message;
      throw new Error(
        serverMessage ||
          error.message ||
          `Failed to create order (${error.response?.status || 500})`
      );
    }
    throw error;
  }
}
