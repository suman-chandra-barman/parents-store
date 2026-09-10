import { apiClient } from "@/lib/api-client";
import { PaperFormatItem, PaperFormatsResponse } from "../types/paper-formats";

/**
 * Fetch available paper formats from /paper-formats API using axios.
 * Returns only items where type === "FORMAT".
 */
export async function fetchPaperFormats(): Promise<PaperFormatItem[]> {
  try {
    const response = await apiClient.get<PaperFormatsResponse>("/paper-formats");
    const json = response.data;

    if (!json.success || !Array.isArray(json.data)) {
      return [];
    }

    // Strictly filter: type will be FORMAT if type PACKAGE not show here
    return json.data.filter((item) => item.type === "FORMAT");
  } catch (error) {
    console.error("Error fetching paper formats via axios:", error);
    return [];
  }
}
