import Dexie, { type EntityTable } from "dexie";

export type HifzStage = "nouveau" | "sabaq" | "sabqi" | "manzil";

export interface SurahProgress {
  surah: number; // clé primaire
  stage: HifzStage;
  startedAt: string; // ISO
  lastReviewedAt: string; // ISO
  reviewCount: number;
}

export interface QuizAttempt {
  id?: number;
  scope: string; // "all" ou numéro de sourate
  score: number;
  total: number;
  date: string; // ISO
}

const db = new Dexie("hifz-juz-amma-db") as Dexie & {
  surahProgress: EntityTable<SurahProgress, "surah">;
  quizAttempts: EntityTable<QuizAttempt, "id">;
};

db.version(1).stores({
  surahProgress: "surah, stage",
  quizAttempts: "++id, scope, date",
});

export default db;
