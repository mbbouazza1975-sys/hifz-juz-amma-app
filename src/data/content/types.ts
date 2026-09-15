// Contenu pédagogique par sourate (traduction, tafsir historique, sens,
// dictionnaire, section contemporaine). Séparé du texte Warsh lui-même
// (data/warsh/*.json, déjà vérifié octet-exact) car ce contenu a des
// sources et un niveau de certitude différents — voir chaque champ
// `source`/`certainty` avant de l'afficher comme un fait établi.

export type Certainty = "certain" | "probable" | "a_verifier";

export interface SourcedText {
  text: string;
  source: string;
  certainty: Certainty;
}

export interface WordGloss {
  word: string; // graphie telle qu'elle apparaît dans le texte Warsh
  meaning: string;
}

export interface AyahContent {
  number: number; // numérotation Warsh (peut différer de Hafs, voir sourate)
  translation: SourcedText;
  sens?: strin// Contenu pédagogique par sourate (traduction, tafsir historique, sens,
// dictionnaire, section contemporaine). Séparé du texte Warsh lui-même
// (data/warsh/*.json, déjà vérifié octet-exact) car ce contenu a des
// sources et un niveau de certitude différents — voir chaque champ
// `source`/`certainty` avant de l'afficher comme un fait établi.

export type Certainty = "certain" | "probable" | "a_verifier";

export interface SourcedText {
  text: string;
  source: string;
  certainty: Certainty;
}

export interface WordGloss {
  word: string; // graphie telle qu'elle apparaît dans le texte Warsh
  meaning: string;
}

export interface AyahContent {
  number: number; // numérotation Warsh (peut différer de Hafs, voir sourate)
  translation: SourcedText;
  sens?: string; // reformulation courte, pas une source externe
  glossary?: WordGloss[];
}

export interface SurahContent {
  number: number;
  summary: string; // reformulation courte du sens global — pas une source externe
  key_point: string;
  historical_context: SourcedText;
  nak_section: {
    text: string; // synthèse originale, jamais une citation littérale attribuée à NAK
    bayyinah_link: string;
    disclaimer: string;
  };
  today_section: {
    text: string; // écrit originalement pour cette app, pas de source externe
  };
  ayahs: AyahContent[];
  numbering_note?: string; // à utiliser quand le découpage Warsh diffère de Hafs
}
g; // reformulation courte, pas une source externe
  glossary?: WordGloss[];
}

export interface SurahContent {
  number: number;
  summary: string; // reformulation courte du sens global — pas une source externe
  key_point: string;
  historical_context: SourcedText;
  nak_section: {
    text: string; // synthèse originale, jamais une citation littérale attribuée à NAK
    bayyinah_link: string;
    disclaimer: string;
  };
  today_section: {
    text: string; // écrit originalement pour cette app, pas de source externe
  };
  ayahs: AyahContent[];
  numbering_note?: string; // à utiliser quand le découpage Warsh diffère de Hafs
}
