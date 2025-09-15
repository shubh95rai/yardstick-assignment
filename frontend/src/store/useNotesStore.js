import axiosInstance from "@/utils/axiosInstance.js";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage.js";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useNotesStore = create((set, get) => ({
  notes: [],
  isLoading: true,
  isSubmitting: false,
  limitReached: false,
  isUpdating: false,

  fetchNotes: async () => {
    try {
      const res = await axiosInstance.get("/notes/all");

      set({ notes: res.data.notes });
      set({ limitReached: false });
    } catch (error) {
      const message = getAxiosErrorMessage(error);
      console.log("Error in fetchNotes:", message);

      set({ notes: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  createNote: async (data) => {
    set({ isSubmitting: true });

    try {
      const res = await axiosInstance.post("/notes/create", data);

      set({ notes: [res.data.note, ...get().notes] });
      set({ limitReached: false });

      toast.success("Note created");
    } catch (error) {
      const message = getAxiosErrorMessage(error);
      console.log("Error in createNote:", message);

      // set({ notes: [] });
      if (message.toLowerCase().includes("limit reached")) {
        set({ limitReached: true });
      } else {
        toast.error(message);
      }
    } finally {
      set({ isSubmitting: false });
    }
  },

  deleteNote: async (id) => {
    try {
      await axiosInstance.delete(`/notes/${id}`);

      set({ notes: get().notes.filter((note) => note._id !== id) });

      toast.success("Note deleted");
    } catch (error) {
      const message = getAxiosErrorMessage(error);
      console.log("Error in deleteNote:", message);

      toast.error("Note deletion failed");
    }
  },

  updateNote: async (id, data) => {
    set({ isUpdating: true });

    try {
      const res = await axiosInstance.put(`/notes/${id}`, data);

      set({
        notes: get().notes.map((note) =>
          note._id === id ? res.data.note : note
        ),
      });
      await useNotesStore.getState().fetchNotes();

      toast.success("Note updated");
      return true;
    } catch (error) {
      const message = getAxiosErrorMessage(error);
      console.log("Error in updateNote:", message);

      toast.error("Note update failed");
      return false;
    } finally {
      set({ isUpdating: false });
    }
  },
}));
