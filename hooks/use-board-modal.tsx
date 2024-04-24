import { create } from "zustand";

interface useBoardModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}
export const useBoardModal = create<useBoardModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
