// Coloration tajwid — sous-ensemble volontairement restreint.
//
// ⚠️ Point d'alerte technique (14 sept 2026) : le paquet npm
// @quran.ws/tajwid + @quran.ws/tajwid-rules encode un corpus de règles
// explicitement marqué `"riwayah": "hafs-an-asim"` (vérifié dans
// node_modules/@quran.ws/tajwid-rules/rules.json). Le texte Warsh utilisé
// ici a un rasm (orthographe) différent par endroits (hamza, alif, madd…) —
// voir le scan de code points effectué sur les 37 sourates : présence de
// blocs Unicode Arabic Extended-A/B (U+0870-0887, U+08F0-08F2) qui
// n'apparaissent PAS dans un texte Hafs standard. Appliquer le corpus Hafs
// tel quel sur ce texte risquerait de produire des règles fausses ou
// manquantes — inacceptable pour un contenu d'apprentissage du Coran.
//
// Décision : ne PAS utiliser ce corpus ici. À la place, ce module ne
// colore que ce que le texte Warsh source lui-même annote explicitement
// via ses propres marques Unicode (donc spécifique à cette édition Warsh,
// pas déduit d'un corpus tiers) :
//
//   - Ghunna (نّ/مّ) : shadda (U+0651) portée par ن ou م — règle
//     phonétique universelle, indépendante de la riwayah.
//   - Qalqalah : sukun (U+0652) porté par une des 5 lettres ق ط ب ج د —
//     idem, phénomène phonétique universel, pas une règle Hafs.
//   - Madd : maddah (U+0653) ou alif suscrit (U+0670) — ce sont les
//     marques que la source Warsh elle-même place pour indiquer un
//     allongement ; on colore exactement ce qu'elle annote, rien de plus.
//
// Tout le reste (ikhfa, idgham, iqlab, détection contextuelle des noon/
// tanwin selon la lettre suivante...) est VOLONTAIREMENT absent tant
// qu'une source de règles vérifiée pour Warsh n'a pas été trouvée —
// mieux vaut ne rien colorer que colorer faux dans un contexte pédagogique
// religieux. À rouvrir si une telle source est identifiée.

export type TajwidCategory = "ghunnah" | "qalqalah" | "madd";

export interface TajwidCluster {
  text: string;
  category: TajwidCategory | null;
}

const SHADDA = "ّ";
const SUKUN = "ْ";
const MADDAH_ABOVE = "ٓ";
const SUPERSCRIPT_ALEF = "ٰ";

const QALQALAH_LETTERS = new Set(["ق", "ط", "ب", "ج", "د"]);
const GHUNNAH_LETTERS = new Set(["ن", "م"]);

// Lettres "de base" (porteuses), tout le reste est traité comme une marque
// combinatoire qui s'attache à la lettre de base précédente.
const BASE_LETTER = /[ء-غف-يٱ-ۓۺ-ۿ]/;

function isBaseLetter(ch: string): boolean {
  return BASE_LETTER.test(ch);
}

/** Découpe le texte en clusters (lettre de base + marques associées) et
 * détermine la catégorie tajwid de chacun, selon les règles ci-dessus. */
export function analyzeAyahTajwid(text: string): TajwidCluster[] {
  const chars = Array.from(text);
  const clusters: TajwidCluster[] = [];

  let i = 0;
  while (i < chars.length) {
    if (!isBaseLetter(chars[i])) {
      // espace, ponctuation, ou marque orpheline en tête : cluster neutre
      clusters.push({ text: chars[i], category: null });
      i++;
      continue;
    }

    const baseLetter = chars[i];
    let j = i + 1;
    const marks: string[] = [];
    while (j < chars.length && !isBaseLetter(chars[j])) {
      marks.push(chars[j]);
      j++;
    }

    let category: TajwidCategory | null = null;
    if (marks.includes(SHADDA) && GHUNNAH_LETTERS.has(baseLetter)) {
      category = "ghunnah";
    } else if (marks.includes(SUKUN) && QALQALAH_LETTERS.has(baseLetter)) {
      category = "qalqalah";
    } else if (marks.includes(MADDAH_ABOVE) || marks.includes(SUPERSCRIPT_ALEF)) {
      category = "madd";
    }

    clusters.push({ text: baseLetter + marks.join(""), category });
    i = j;
  }

  return clusters;
}
