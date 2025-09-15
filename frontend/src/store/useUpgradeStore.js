import { create } from "zustand";
import axiosInstance from "../utils/axiosInstance.js";
import toast from "react-hot-toast";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage.js";
import { useNotesStore } from "./useNotesStore.js";

export const useUpgradeStore = create((set, get) => ({
  isUpgrading: false,

  upgradePlan: async (slug) => {
    set({ isUpgrading: true });

    try {
      const res = await axiosInstance.post(`/tenant/${slug}/upgrade`);

      useNotesStore.setState({ limitReached: false });

      // toast.success(res.data.message);

      localStorage.setItem("upgradeSuccess", true);
      window.location.reload();
    } catch (error) {
      const message = getAxiosErrorMessage(error);
      console.log("Error in upgradePlan:", message);

      toast.error(message);
      
    } finally {
      set({ isUpgrading: false });
    }
  },
}));
