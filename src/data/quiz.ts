import { loadSurah } from "./loader";
import { JUZ_AMMA_FIRST_SURAH, JUZ_AMMA_LAST_SURAH } from "./loader";
import type { Ayah } from "./types";

export interface QuizQuestion {
  surah: number;
  ayahKey: string;
  words: string[]; // mots de l'ayah, dans l'ordre
  blankIndex: number;
  correctAnswer: string;
  choices: string[]; // mélangés, correctAnswer inclus
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function collectAyahs(scope: string): Promise<{ surah: number; ayahs: Ayah[] }[]> {
  if (scope === "all") {
    const numbers = Array.from(
      { length: JUZ_AMMA_LAST_SURAH - JUZ_AMMA_FIRST_SURAH + 1 },
      (_, i) => JUZ_AMMA_FIRST_SURAH + i,
    );
    const surahs = await Promise.all(numbers.map(loadSurah));
    return surahs.map((s) => ({ surah: s.number, ayahs: s.ayahs }));
  }
  const surah = await loadSurah(Number(scope));
  return [{ surah: surah.number, ayahs: surah.ayahs }];
}

/** Génère jusqu'à `count` questions "mot manquant" à partir du périmètre donné. */
export async function generateQuiz(
  scope: string,
  count = 10,
): Promise<QuizQuestion[]> {
  const groups = await collectAyahs(scope);

  const allWords = groups.flatMap((g) => g.ayahs.flatMap((a) => a.words.map((w) => w.text)));
  const uniqueWordPool = Array.from(new Set(allWords));

  const eligible = groups.flatMap((g) =>
    g.ayahs
      .filter((a) => a.words.length >= 3)
      .map((a) => ({ surah: g.surah, ayah: a })),
  );

  const picked = shuffle(eligible).slice(0, Math.min(count, eligible.length));

  return picked.map(({ surah, ayah }) => {
    const words = ayah.words.map((w) => w.text);
    const blankIndex = 1 + Math.floor(Math.random() * (words.length - 1)); // jamais le 1er mot
    const correctAnswer = words[blankIndex];

    const distractorPool = uniqueWordPool.filter((w) => w !== correctAnswer);
    const distractors = shuffle(distractorPool).slice(0, 3);
    const choices = shuffle([correctAnswer, ...distractors]);

    return {
      surah,
      ayahKey: ayah.key,
      words,
      blankIndex,
      correctAnswer,
      choices,
    };
  });
}
