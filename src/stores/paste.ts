import { create } from "zustand";

interface PasteCreateState {
  successDialogOpen: boolean;
  pasteUrl: string;
  successDialogToggle: () => void;
  pasteCreatedCallback: (url: string) => void;
}

enum PasteLoadState {
  PENDING,
  SUCCESS,
  FAILED,
}

enum PasteDecryptionState {
  PENDING,
  SUCCESS,
  FAILED,
  PASSWORD_REQUIRED,
}

enum PasswordState {
  UNSET,
  SET,
  INVALID,
}

enum DeleteState {
  OPEN,
  CLOSE,
}

interface PasteData {
  pasteId: string;
  iv: string;
  paste: string;
  passwordProtected: boolean;
}

interface PasteViewState {
  loadState: PasteLoadState;
  decryptState: PasteDecryptionState;
  passwordState: PasswordState;
  deleteState: DeleteState;

  password: string;
  pasteData?: PasteData;
  plainText?: string;
  encryptionKey?: Uint8Array;

  reset: () => void;

  loadFailed: () => void;
  loadSuccess: (data: PasteData) => void;

  decryptionFailed: () => void;
  decryptionSuccess: (encryptionKey: Uint8Array, plainText: string) => void;
  decryptionPasswordRequired: () => void;

  passwordSet: (password: string) => void;
  toggleDelete: () => void;
}

const usePasteStore = create<PasteCreateState>()((set) => ({
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

const usePasteViewStore = create<PasteViewState>()((set) => ({
  loadState: PasteLoadState.PENDING,
  decryptState: PasteDecryptionState.PENDING,
  passwordState: PasswordState.UNSET,
  deleteState: DeleteState.CLOSE,

  password: "",
  pasteData: undefined,
  plainText: undefined,
  encryptionKey: undefined,

  loadFailed: () => set(() => ({ loadState: PasteLoadState.FAILED })),
  loadSuccess: (data) =>
    set(() => ({ loadState: PasteLoadState.SUCCESS, pasteData: data })),

  decryptionFailed: () =>
    set((state) => {
      if (state.passwordState == PasswordState.SET) {
        return {
          decryptState: PasteDecryptionState.PASSWORD_REQUIRED,
          passwordState: PasswordState.INVALID,
          password: "",
        };
      }
      return { decryptState: PasteDecryptionState.FAILED };
    }),
  decryptionSuccess: (encryptionKey, plainText) =>
    set(() => ({
      decryptState: PasteDecryptionState.SUCCESS,
      plainText: plainText,
      encryptionKey: encryptionKey,
    })),
  decryptionPasswordRequired: () =>
    set(() => ({ decryptState: PasteDecryptionState.PASSWORD_REQUIRED })),
  reset: () =>
    set(() => ({
      loadState: PasteLoadState.PENDING,
      decryptState: PasteDecryptionState.PENDING,
      passwordState: PasswordState.UNSET,

      passwordModal: false,
      invalidPassword: false,
      password: "",
      pasteData: undefined,
      plainText: undefined,
      encryptionKey: undefined,
    })),
  passwordSet: (password) =>
    set(() => ({
      passwordState: PasswordState.SET,
      password: password,
      decryptState: PasteDecryptionState.PENDING,
    })),
  toggleDelete: () =>
    set((state) => ({
      deleteState:
        state.deleteState == DeleteState.CLOSE
          ? DeleteState.OPEN
          : DeleteState.CLOSE,
    })),
}));

export {
  usePasteStore,
  usePasteViewStore,
  PasteLoadState,
  PasteDecryptionState,
  PasswordState,
  DeleteState,
};
