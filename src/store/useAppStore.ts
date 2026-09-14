import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ReciterId } from "../audio/reciters";

interface AppState {
  reciterId: ReciterId;
  setReciterId: (id: ReciterId) => void;

  playbackRate: number;
  setPlaybackRate: (rate: number) => void;

  fontScale: number; // 1 = base, 0.85..1.4
  setFontScale: (scale: number) => void;

  lastSurah: number | null;
  lastAyah: number | null;
  setLastPosition: (surah: number, ayah: number) => void;

  showTajwidColors: boolean;
  toggleTajwidColors: () => void;

  showWordHints: boolean;
  toggleWordHints: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      reciterId: "yassin_al_jazaery",
      setReciterId: (id) => set({ reciterId: id }),

      playbackRate: 1,
      setPlaybackRate: (rate) => set({ playbackRate: rate }),

      fontScale: 1,
      setFontScale: (scale) => set({ fontScale: scale }),

      lastSurah: null,
      lastAyah: null,
      setLastPosition: (surah, ayah) =>
        set({ lastSurah: surah, lastAyah: ayah }),

      showTajwidColors: true,
      toggleTajwidColors: () =>
        set((s) => ({ showTajwidColors: !s.showTajwidColors })),

      showWordHints: true,
      toggleWordHints: () => set((s) => ({ showWordHints: !s.showWordHints })),
    }),
    { name: "hifz-juz-amma-settings" },
  ),
);
