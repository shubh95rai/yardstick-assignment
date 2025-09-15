import { create } from "zustand";
import axiosInstance from "../utils/axiosInstance.js";
import toast from "react-hot-toast";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage.js";

export const useInviteStore = create((set, get) => ({
  inviteUrl: null,
  inviteDetails: null,
  isSubmitting: false,
  isLoading: false,

  inviteUser: async (data) => {
    set({ isSubmitting: true });
    try {
      const res = await axiosInstance.post("/auth/invite", data);

      set({ inviteUrl: res.data.inviteUrl });
    } catch (error) {
      const message = getAxiosErrorMessage(error);
      console.log("Error in inviteUser:", message);

      toast.error(message);
    } finally {
      set({ isSubmitting: false });
    }
  },

  fetchInviteDetails: async (token) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/auth/invite/${token}`);

      set({ inviteDetails: res.data.inviteDetails });
    } catch (error) {
      const message = getAxiosErrorMessage(error);
      console.log("Error in fetchInviteDetails:", message);

      set({ inviteDetails: null });

      toast.error("Error fetching invite details");
    } finally {
      set({ isLoading: false });
    }
  },

  acceptInvite: async (data) => {
    set({ isSubmitting: true });
    try {
      const res = await axiosInstance.post("/auth/accept-invite", data);

      toast.success(res.data.message);

      return true;
    } catch (error) {
      const message = getAxiosErrorMessage(error);
      console.log("Error in acceptInvite:", message);

      toast.error("Error accepting invite");

      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },
}));
