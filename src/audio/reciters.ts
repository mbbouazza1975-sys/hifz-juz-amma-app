// Sources audio Warsh — everyayah.com, fichiers par verset SSSAAA.mp3
// (3 chiffres sourate + 3 chiffres verset, zéro-paddés).
//
// Vérification (14 sept 2026, lecture directe du listing du dossier) :
// - warsh_yassin_al_jazaery_64kbps : CONFIRMÉ — fichiers 001000.mp3, 001001.mp3...
//   présents avec cette convention exacte.
// - warsh_Abdul_Basit_128kbps et warsh_ibrahim_aldosary_128kbps : le dossier
//   existe sur le serveur mais le contenu interne n'a pas été vérifié fichier
//   par fichier — même convention attendue (standard everyayah.com) mais
//   À VÉRIFIER en conditions réelles avant de compter dessus en prod.
//
// Riwayah : Warsh 'an Nafi' pour les trois (dossiers "warsh_*" du serveur
// dédié /data/warsh/). Aucune n'a pu être vérifiée en écoute directe ici —
// à confirmer à l'oreille par Mohamed avant usage avec son fils.

export type ReciterId =
  | "yassin_al_jazaery"
  | "abdul_basit_warsh"
  | "ibrahim_aldosary";

export interface ReciterInfo {
  id: ReciterId;
  name: string;
  folder: string;
  verified: boolean;
}

export const RECITERS: Record<ReciterId, ReciterInfo> = {
  yassin_al_jazaery: {
    id: "yassin_al_jazaery",
    name: "Yassin Al-Jazaery",
    folder: "warsh_yassin_al_jazaery_64kbps",
    verified: true,
  },
  abdul_basit_warsh: {
    id: "abdul_basit_warsh",
    name: "Abdul Basit (riwayah Warsh)",
    folder: "warsh_Abdul_Basit_128kbps",
    verified: false,
  },
  ibrahim_aldosary: {
    id: "ibrahim_aldosary",
    name: "Ibrahim Al-Dosary",
    folder: "warsh_ibrahim_aldosary_128kbps",
    verified: false,
  },
};

const BASE_URL = "https://everyayah.com/data/warsh";

/** URL du fichier audio pour un verset donné (78:1 -> .../078001.mp3). */
export function ayahAudioUrl(
  reciterId: ReciterId,
  surahNumber: number,
  ayahNumber: number,
): string {
  const reciter = RECITERS[reciterId];
  const s = String(surahNumber).padStart(3, "0");
  const a = String(ayahNumber).padStart(3, "0");
  return `${BASE_URL}/${reciter.folder}/${s}${a}.mp3`;
}
