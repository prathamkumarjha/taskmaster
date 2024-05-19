import { create } from "zustand";
interface useCardModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useMoveCardModal = create<useCardModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
