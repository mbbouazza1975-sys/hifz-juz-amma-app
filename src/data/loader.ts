// Chargement paresseux des données Warsh.
// Chaque fichier data/warsh/*.json est un chunk contenant 1 à 12 sourates ;
// il n'est téléchargé que lorsqu'une sourate qu'il contient est demandée,
// pour garder le bundle initial léger (37 sourates ~250 Ko au total sinon).

import type { Surah, WarshIndexEntry, SurahSummary } from "./types";
import warshIndex from "../../data/warsh/index.json";
import surahsMeta from "../../data/warsh/surahs-meta.json";

// import.meta.glob : Vite découpe chaque chunk en module séparé,
// chargé uniquement à l'appel de la fonction (lazy: true par défaut ici
// car on ne passe pas { eager: true }).
const chunkLoaders = import.meta.glob([
  "/data/warsh/*.json",
  "!/data/warsh/index.json",
  "!/data/warsh/surahs-meta.json",
]) as Record<string, () => Promise<{ default: Surah[] }>>;

const index: WarshIndexEntry[] = warshIndex as WarshIndexEntry[];

function loaderForFile(file: string): () => Promise<{ default: Surah[] }> {
  const entry = Object.entries(chunkLoaders).find(([path]) =>
    path.endsWith(`/${file}`),
  );
  if (!entry) {
    throw new Error(`Chunk introuvable pour ${file} (vérifier data/warsh/)`);
  }
  return entry[1];
}

function indexEntryForSurah(surahNumber: number): WarshIndexEntry {
  const entry = index.find(
    (e) => surahNumber >= e.first_surah && surahNumber <= e.last_surah,
  );
  if (!entry) {
    throw new Error(
      `Sourate ${surahNumber} hors du Juz 'Amma (78-114 attendu)`,
    );
  }
  return entry;
}

const chunkCache = new Map<string, Promise<Surah[]>>();

async function loadChunk(file: string): Promise<Surah[]> {
  let cached = chunkCache.get(file);
  if (!cached) {
    cached = loaderForFile(file)().then((m) => m.default);
    chunkCache.set(file, cached);
  }
  return cached;
}

/** Charge une sourate complète (texte + mots) par son numéro (78-114). */
export async function loadSurah(surahNumber: number): Promise<Surah> {
  const entry = indexEntryForSurah(surahNumber);
  const surahs = await loadChunk(entry.file);
  const surah = surahs.find((s) => s.number === surahNumber);
  if (!surah) {
    throw new Error(
      `Sourate ${surahNumber} absente du chunk ${entry.file} (données incohérentes)`,
    );
  }
  return surah;
}

/** Liste ordonnée des 37 sourates du Juz 'Amma, sans le texte (pour l'accueil). */
export function loadAllSummaries(): Promise<SurahSummary[]> {
  return Promise.resolve(surahsMeta as SurahSummary[]);
}

export const JUZ_AMMA_FIRST_SURAH = 78;
export const JUZ_AMMA_LAST_SURAH = 114;
export const JUZ_AMMA_SURAH_COUNT = 37;
