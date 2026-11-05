import { isAxiosError } from "axios";
import type { ApiError } from "../types";

export function getErrorMessage(error: unknown): string {
  if (isAxiosError<ApiError>(error)) {
    const data = error.response?.data;
    if (!data) {
      return "Không thể kết nối máy chủ";
    }
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors.map((e) => e.message).join(", ");
    }
    if (data.message) return data.message;
  }
  if (error instanceof Error) return error.message;
  return "Lỗi không xác định";
}
