// Types pour les données Warsh (Juz 'Amma, sourates 78-114)
// Source des données : @quran.ws/text (provenance KFGQPC), extraites par scripts/extract-warsh.mjs

export interface Word {
    position: number;
    text: string;
    number: number;
    index: number;
}

export interface Ayah {
    number: number;
    key: string; // "78:1"
  text: string;
    words: Word[];
}

export interface Surah {
    number: number;
    name_ar: string;
    name_en: string;
    revelation: "makki" | "madani";
    has_basmalah: boolean;
    ayah_count: number;
    ayahs: Ayah[];
}

export interface WarshIndexEntry {
    file: string;
    first_surah: number;
    last_surah: number;
    surah_count: number;
}

// Métadonnées légères (sans le texte) pour la liste d'accueil,
// dérivées du même index — first_surah/last_surah donnent la borne,
// le détail (nom, nb versets) est chargé à la demande depuis le chunk.
export interface SurahSummary {
    number: number;
    name_ar: string;
    name_en: string;
    ayah_count: number;
    revelation: "makki" | "madani";
}
