import { create } from "zustand";

interface BackgroundImageStore {
  selectedBackground: string;
  setSelectedBackground: (imageUrl: string) => void;
}

export const useBackgroundImageStore = create<BackgroundImageStore>((set) => ({
  selectedBackground: "",
  setSelectedBackground: (imageUrl) => set({ selectedBackground: imageUrl }),
}));
