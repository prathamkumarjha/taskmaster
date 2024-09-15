import { create } from "zustand";
interface useNewCardModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useNewCardModal = create<useNewCardModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
