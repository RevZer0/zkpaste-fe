import { create } from "zustand";

interface PasteCreateState {
  successDialogOpen: boolean;
  pasteUrl: string;
  successDialogToggle: () => void;
  pasteCreatedCallback: (url: string) => void;
}

export const usePasteStore = create<PasteCreateState>()((set) => ({
  successDialogOpen: false,
  pasteUrl: "",
  successDialogToggle: () =>
    set((state) => ({ successDialogOpen: !state.successDialogOpen })),
  pasteCreatedCallback: (url: string) =>
    set(() => ({
      pasteUrl: url,
      successDialogOpen: true,
    })),
}));
