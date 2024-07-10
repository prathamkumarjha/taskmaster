import { create } from "zustand";

interface StoreState {
  refresh: boolean;
  setRefresh: (value: boolean) => void;
}

export const useStore = create<StoreState>((set) => ({
  refresh: false,
  setRefresh: (value: boolean) => set({ refresh: value }),
}));
