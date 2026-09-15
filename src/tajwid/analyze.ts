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
// Tout le reste (ikhfa, idgham, iqlab, naql, imâla — règles Warsh
// spécifiques nécessitant soit un corpus de mots vérifié soit une analyse
// inter-mots) reste VOLONTAIREMENT absent tant qu'une source vérifiée
// n'a pas été trouvée et testée — mieux vaut ne rien colorer que colorer
// faux dans un contexte pédagogique religieux.
//
// Ajout du 15 sept 2026 (recherche : sifatusafwa.com, alwalidacademy.com) :
// tafkhîm/tarqîq. Contrairement à ikhfa/idgham, cette règle est un
// phénomène phonétique déterministe calculable uniquement à partir des
// harakât déjà présentes dans le texte source — donc applicable en toute
// sécurité, comme ghunna/qalqala/madd ci-dessus :
//   - Lettres toujours emphatiques (mufakhkham) : خ ص ض ط ظ غ ق — tafkhîm
//     systématique, indépendant du contexte.
//   - Râ (ر) : tafkhîm si voyelle fatha/damma (propre ou héritée d'une
//     lettre précédente quand le râ est sukūn) ; tarqîq si voyelle kasra
//     (propre ou héritée). Cas d'exception avec lettre d'isti'lâ dans le
//     même mot après un râ sukūn précédé de kasra (ex. قِرْطَاس) : non
//     géré ici, volontairement laissé non coloré plutôt que risquer une
//     erreur — à affiner.

export type TajwidCategory =
  | "ghunnah"
  | "qalqalah"
  | "madd"
  | "tafkhim"
  | "tarqiq";

export interface TajwidCluster {
  text: string;
  category: TajwidCategory | null;
}

const SHADDA = "ّ";
const SUKUN = "ْ";
const MADDAH_ABOVE = "ٓ";
const SUPERSCRIPT_ALEF = "ٰ";
const FATHA = "َ";
const DAMMA = "ُ";
const KASRA = "ِ";
const TANWIN_FATH = "ً";
const TANWIN_DAMM = "ٌ";
const TANWIN_KASR = "ٍ";

const QALQALAH_LETTERS = new Set(["ق", "ط", "ب", "ج", "د"]);
const GHUNNAH_LETTERS = new Set(["ن", "م"]);
const ALWAYS_MUFAKHKHAM = new Set(["خ", "ص", "ض", "ط", "ظ", "غ", "ق"]);
const RA = "ر";

function harakahOf(marks: string[]): "fath" | "damm" | "kasr" | null {
  if (marks.includes(FATHA) || marks.includes(TANWIN_FATH)) return "fath";
  if (marks.includes(DAMMA) || marks.includes(TANWIN_DAMM)) return "damm";
  if (marks.includes(KASRA) || marks.includes(TANWIN_KASR)) return "kasr";
  return null;
}

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
  // Première passe : découpage en clusters {baseLetter, marks[]} bruts.
  const raw: { baseLetter: string | null; marks: string[] }[] = [];

  let i = 0;
  while (i < chars.length) {
    if (!isBaseLetter(chars[i])) {
      raw.push({ baseLetter: null, marks: [chars[i]] });
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
    raw.push({ baseLetter, marks });
    i = j;
  }

  // Deuxième passe : catégorisation, avec accès au cluster précédent pour
  // le râ sukūn (qui hérite la voyelle de la lettre qui le précède).
  const clusters: TajwidCluster[] = [];
  for (let k = 0; k < raw.length; k++) {
    const { baseLetter, marks } = raw[k];
    if (baseLetter === null) {
      clusters.push({ text: marks[0], category: null });
      continue;
    }

    let category: TajwidCategory | null = null;
    if (marks.includes(SHADDA) && GHUNNAH_LETTERS.has(baseLetter)) {
      category = "ghunnah";
    } else if (marks.includes(SUKUN) && QALQALAH_LETTERS.has(baseLetter)) {
      category = "qalqalah";
    } else if (marks.includes(MADDAH_ABOVE) || marks.includes(SUPERSCRIPT_ALEF)) {
      category = "madd";
    } else if (ALWAYS_MUFAKHKHAM.has(baseLetter)) {
      category = "tafkhim";
    } else if (baseLetter === RA) {
      let h = harakahOf(marks);
      if (h === null && marks.includes(SUKUN)) {
        // Râ sukūn : hérite la harakah de la lettre précédente.
        const prev = raw[k - 1];
        if (prev && prev.baseLetter !== null) h = harakahOf(prev.marks);
      }
      if (h === "fath" || h === "damm") category = "tafkhim";
      else if (h === "kasr") category = "tarqiq";
      // h === null (ex. râ final sans marque visible) : laissé non coloré,
      // par prudence, plutôt que de deviner.
    }

    clusters.push({ text: baseLetter + marks.join(""), category });
  }

  return clusters;
}
