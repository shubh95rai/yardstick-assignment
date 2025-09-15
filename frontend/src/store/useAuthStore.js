import { create } from "zustand";
import toast from "react-hot-toast";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage.js";
import axiosInstance from "@/utils/axiosInstance.js";

export const useAuthStore = create((set, get) => ({
  user: null,
  tenant: null,
  isLoggingIn: false,
  isCheckingAuth: true,

  setTenant: (tenant) => set({ tenant }),
  setUser: (user) => set({ user }),
  clear: () => set({ user: null, tenant: null }),

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check-auth");

      get().setUser(res.data.user);
      get().setTenant(res.data.tenant);
    } catch (error) {
      const message = getAxiosErrorMessage(error);
      console.log("Error in checkAuth:", message);

      get().clear();
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });

    try {
      const res = await axiosInstance.post("/auth/login", data);

      get().setUser(res.data.user);
      get().setTenant(res.data.tenant);

      toast.success("Logged in successfully");
    } catch (error) {
      const message = getAxiosErrorMessage(error);
      console.log("Error in login:", message);

      toast.error(message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");

      get().clear();
    } catch (error) {
      const message = getAxiosErrorMessage(error);
      console.log("Error in logout:", message);

      toast.error("Error logging out");
    }
  },
}));
