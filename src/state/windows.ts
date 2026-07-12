import { create } from "zustand";

export interface WindowState {
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  z: number;
}

interface WindowsState {
  windows: Record<string, WindowState>;
  topZ: number;
  activeId: string | null;
  openWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  focusWindow: (id: string) => void;
}

export const useWindows = create<WindowsState>((set) => ({
  windows: {},
  topZ: 10,
  activeId: null,
  openWindow: (id) =>
    set((s) => {
      const z = s.topZ + 1;
      const existing = s.windows[id];
      return {
        topZ: z,
        activeId: id,
        windows: {
          ...s.windows,
          [id]: existing
            ? { ...existing, open: true, minimized: false, z }
            : { open: true, minimized: false, maximized: false, z },
        },
      };
    }),
  closeWindow: (id) =>
    set((s) => ({
      activeId: s.activeId === id ? null : s.activeId,
      windows: {
        ...s.windows,
        [id]: { ...s.windows[id], open: false, minimized: false, maximized: false },
      },
    })),
  minimizeWindow: (id) =>
    set((s) => ({
      activeId: s.activeId === id ? null : s.activeId,
      windows: { ...s.windows, [id]: { ...s.windows[id], minimized: true } },
    })),
  toggleMaximize: (id) =>
    set((s) => ({
      windows: {
        ...s.windows,
        [id]: { ...s.windows[id], maximized: !s.windows[id]?.maximized },
      },
    })),
  focusWindow: (id) =>
    set((s) => {
      if (s.activeId === id) return s;
      const z = s.topZ + 1;
      return {
        topZ: z,
        activeId: id,
        windows: { ...s.windows, [id]: { ...s.windows[id], z } },
      };
    }),
}));
