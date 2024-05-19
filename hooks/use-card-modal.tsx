import { create } from "zustand";
import { useMoveCardModal } from "./use-move-card-modal";
interface useBoardModalStore {
  isOpen: boolean;
  id: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useCardModal = create<useBoardModalStore>((set) => ({
  id: "",
  isOpen: false,
  onOpen: (id: string) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false }),
}));
