import { AxiosError } from "axios";

export function getAxiosErrorMessage(error) {
  if (error instanceof AxiosError) {
    return error.response?.data?.message ?? error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error";
}
