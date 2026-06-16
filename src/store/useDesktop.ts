/* Lookout — window manager store (see DESIGN.md §6). */

import { create } from "zustand";

export type WindowKind = "category" | "appInfo" | "find" | "about";

export type WindowInstance = {
  id: string; // unique per open window, e.g. "category:dev" or "app:vscode"
  kind: WindowKind;
  title: string;
  payload?: string; // categoryId / appId
  x: number;
  y: number;
  z: number;
};

type OpenArgs = {
  id: string;
  kind: WindowKind;
  title: string;
  payload?: string;
  x?: number;
  y?: number;
};

type DesktopState = {
  windows: WindowInstance[];
  focusedId: string | null;
  topZ: number;
  openWindow: (w: OpenArgs) => void;
  closeWindow: (id: string) => void;
  bringToFront: (id: string) => void;
};

export const useDesktop = create<DesktopState>((set, get) => ({
  windows: [],
  focusedId: null,
  topZ: 0,
  openWindow: (w) => {
    // Already open? Just focus it.
    if (get().windows.some((win) => win.id === w.id)) {
      get().bringToFront(w.id);
      return;
    }
    set((s) => {
      const z = s.topZ + 1;
      const step = s.windows.length % 6;
      return {
        windows: [
          ...s.windows,
          {
            id: w.id,
            kind: w.kind,
            title: w.title,
            payload: w.payload,
            x: w.x ?? 140 + step * 32,
            y: w.y ?? 120 + step * 28,
            z,
          },
        ],
        focusedId: w.id,
        topZ: z,
      };
    });
  },
  closeWindow: (id) =>
    set((s) => ({
      windows: s.windows.filter((win) => win.id !== id),
      focusedId: s.focusedId === id ? null : s.focusedId,
    })),
  bringToFront: (id) =>
    set((s) => {
      const z = s.topZ + 1;
      return {
        windows: s.windows.map((win) => (win.id === id ? { ...win, z } : win)),
        focusedId: id,
        topZ: z,
      };
    }),
}));
