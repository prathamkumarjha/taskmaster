import { create } from "zustand";
import { useMoveCardModal } from "./use-move-card-modal";
interface useBoardModalStore {
  isDisabled: boolean;

  setDisabled: (disabled: boolean) => void;
}

export const useDisableStore = create<useBoardModalStore>((set) => ({
  isDisabled: false,
  setDisabled: (disabled) => set({ isDisabled: disabled }),
}));
