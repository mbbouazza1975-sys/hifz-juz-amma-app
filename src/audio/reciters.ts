// Sources audio Warsh.
//
// Deux familles bien distinctes, pour deux usages différents — voir plus
// bas pourquoi on ne les mélange pas :
//
// 1) VERSET_RECITERS (everyayah.com, fichiers découpés par verset,
//    SSSAAA.mp3) — permet la répétition par verset et le surlignage
//    "en cours de lecture". Vérification (14 sept 2026, listing direct du
//    dossier serveur) :
//      - yassin_al_jazaery : CONFIRMÉ fichier par fichier.
//      - abdul_basit_warsh / ibrahim_aldosary : dossier présent, convention
//        SSSAAA.mp3 attendue (standard everyayah.com) mais NON vérifiée
//        fichier par fichier — à confirmer à l'oreille avant usage.
//
// 2) SURAH_RECITERS (mp3quran.net, fichiers sourate entière, NNN.mp3) —
//    lecture continue uniquement, pas de répétition par verset ni de
//    surlignage possible (pas de découpage par verset disponible côté
//    source). Liste construite le 15 sept 2026 via l'API officielle
//    mp3quran.net/api/v3/reciters?rewaya=<id> pour les 3 riwayat Warsh
//    existantes (2 = Warsh 'an Nafi' générique, 10 = Tariq Abi Baker
//    Alasbahani, 18 = Tariq Alazraq) — noms, ID et moshaf_server tous
//    tirés directement de la réponse JSON de l'API (source : Certain sur
//    l'existence/le nom du récitateur et son riwayah déclarée par
//    mp3quran.net lui-même). La convention d'URL finale (serveur +
//    NNN.mp3, 3 chiffres) est la convention documentée et largement
//    utilisée de mp3quran.net, mais n'a PAS pu être vérifiée par requête
//    HTTP directe depuis cet environnement (accès réseau restreint à une
//    liste blanche qui n'inclut pas mp3quran.net) — Probable, pas Certain.
//    À écouter au moins une fois par récitateur avant de compter dessus.

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

/** URL du fichier audio par verset (78:1 -> .../078001.mp3). Repeat +
 * surlignage possibles uniquement avec ces récitateurs. */
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

// --- Sourate entière (mp3quran.net) ---------------------------------------

export type SurahReciterId =
  | "husary_warsh"
  | "mohammad_saayed"
  | "aloyoon_alkoshi"
  | "abdelmoujib_benkirane"
  | "rasheed_ifrad"
  | "younes_souilass"
  | "rachid_belalya"
  | "hicham_lharraz"
  | "abdelaziz_sheim"
  | "abdulbasit_warsh_full"
  | "omar_alqazabri"
  | "mohammad_alairawy"
  | "ahmad_deban"
  | "mohammad_abdulkarem";

export interface SurahReciterInfo {
  id: SurahReciterId;
  name: string;
  tariq: string; // précision de tariq (chaîne de transmission Warsh)
  server: string; // base URL mp3quran.net, se termine par "/"
  mp3quranReciterId: number; // pour recoupement avec l'API
}

export const SURAH_RECITERS: Record<SurahReciterId, SurahReciterInfo> = {
  husary_warsh: {
    id: "husary_warsh",
    name: "Mahmoud Khalil Al-Hussary",
    tariq: "Warsh 'an Nafi'",
    server: "https://server13.mp3quran.net/husr/Rewayat-Warsh-A-n-Nafi/",
    mp3quranReciterId: 118,
  },
  mohammad_saayed: {
    id: "mohammad_saayed",
    name: "Mohammad Saayed",
    tariq: "Warsh 'an Nafi'",
    server: "https://server16.mp3quran.net/m_sayed/Rewayat-Warsh-A-n-Nafi/",
    mp3quranReciterId: 134,
  },
  aloyoon_alkoshi: {
    id: "aloyoon_alkoshi",
    name: "Aloyoon Al-Koshi",
    tariq: "Warsh 'an Nafi'",
    server: "https://server11.mp3quran.net/koshi/",
    mp3quranReciterId: 16,
  },
  abdelmoujib_benkirane: {
    id: "abdelmoujib_benkirane",
    name: "Abdelmoujib Benkirane",
    tariq: "Warsh 'an Nafi'",
    server: "https://server16.mp3quran.net/A-Benkirane/Rewayat-Warsh-A-n-Nafi/",
    mp3quranReciterId: 21199,
  },
  rasheed_ifrad: {
    id: "rasheed_ifrad",
    name: "Rasheed Ifrad",
    tariq: "Warsh 'an Nafi'",
    server: "https://server12.mp3quran.net/ifrad/",
    mp3quranReciterId: 26,
  },
  younes_souilass: {
    id: "younes_souilass",
    name: "Younes Souilass",
    tariq: "Warsh 'an Nafi'",
    server: "https://server16.mp3quran.net/souilass/Rewayat-Warsh-A-n-Nafi/",
    mp3quranReciterId: 264,
  },
  rachid_belalya: {
    id: "rachid_belalya",
    name: "Rachid Belalya",
    tariq: "Warsh 'an Nafi'",
    server: "https://server6.mp3quran.net/bl3/Rewayat-Warsh-A-n-Nafi/",
    mp3quranReciterId: 27,
  },
  hicham_lharraz: {
    id: "hicham_lharraz",
    name: "Hicham Lharraz",
    tariq: "Warsh 'an Nafi'",
    server: "https://server16.mp3quran.net/H-Lharraz/Rewayat-Warsh-A-n-Nafi/",
    mp3quranReciterId: 305,
  },
  abdelaziz_sheim: {
    id: "abdelaziz_sheim",
    name: "Abdelaziz Sheim",
    tariq: "Warsh 'an Nafi'",
    server: "https://server16.mp3quran.net/a_sheim/Rewayat-Warsh-A-n-Nafi/",
    mp3quranReciterId: 307,
  },
  abdulbasit_warsh_full: {
    id: "abdulbasit_warsh_full",
    name: "Abdulbasit Abdulsamad",
    tariq: "Warsh 'an Nafi'",
    server: "https://server7.mp3quran.net/basit/Rewayat-Warsh-A-n-Nafi/",
    mp3quranReciterId: 51,
  },
  omar_alqazabri: {
    id: "omar_alqazabri",
    name: "Omar Al-Qazabri",
    tariq: "Warsh 'an Nafi'",
    server: "https://server9.mp3quran.net/omar_warsh/",
    mp3quranReciterId: 80,
  },
  mohammad_alairawy: {
    id: "mohammad_alairawy",
    name: "Mohammad Al-Airawy",
    tariq: "Warsh, Tariq Al-Azraq",
    server: "https://server6.mp3quran.net/earawi/",
    mp3quranReciterId: 104,
  },
  ahmad_deban: {
    id: "ahmad_deban",
    name: "Ahmad Deban",
    tariq: "Warsh, Tariq Al-Azraq",
    server:
      "https://server16.mp3quran.net/deban/Rewayat-Warsh-A-n-Nafi-Men-Tariq-Alazraq/",
    mp3quranReciterId: 265,
  },
  mohammad_abdulkarem: {
    id: "mohammad_abdulkarem",
    name: "Mohammad Abdulkarem",
    tariq: "Warsh, Tariq Abi Baker Alasbahani",
    server:
      "https://server12.mp3quran.net/m_krm/Rewayat-Warsh-A-n-Nafi-Men-Tariq-Abi-Baker-Alasbahani/",
    mp3quranReciterId: 115,
  },
};

/** URL du fichier audio pour la sourate entière (convention mp3quran.net :
 * 3 chiffres zéro-paddés, ex. 106.mp3). Pas de repeat/surlignage par
 * verset possible avec ces récitateurs — lecture continue uniquement. */
export function surahAudioUrl(
  reciterId: SurahReciterId,
  surahNumber: number,
): string {
  const reciter = SURAH_RECITERS[reciterId];
  const s = String(surahNumber).padStart(3, "0");
  return `${reciter.server}${s}.mp3`;
}
