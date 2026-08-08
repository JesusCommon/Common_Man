import { create } from "zustand";
type Theme = "dark" | "light" | "system";

interface UIState {
  theme: Theme;
  setTheme: (theme: Theme) => void;

  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  activeModal: string | null;
  modalData: unknown;
  openModal: (id: string, data?: unknown) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: "dark",
  setTheme: (theme) => set({ theme }),

  sidebarOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  activeModal: null,
  modalData: null,
  openModal: (id, data) => set({ activeModal: id, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),
}));