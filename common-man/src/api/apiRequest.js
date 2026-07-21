import { handleApiError } from "./handleApiError";

export async function apiRequest(promise) {
  try {
    const res = await promise;
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
}