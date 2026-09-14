// Extraction et vérification du texte coranique Warsh pour Juz Amma (sourates 78-114)
// Source: dataset @quran.ws/text, construit sur le fichier officiel KFGQPC UthmanicWarsh-v-3.0
// (provenance et SHA-256 documentés dans data-sources/warsh.json -> field "provenance")
//
// Ce script n'est PAS exécuté à runtime par l'app : c'est l'outil qui a produit
// data/warsh-juz-amma.json une fois, à partir du mushaf complet téléchargé dans
// data-sources/warsh.json (non commité, voir .gitignore).

import { Mushaf } from "@quran.ws/text";
import fs from "node:fs";

const m = await Mushaf.load("./data-sources/warsh.json");

console.log("word_count:", m.wordCount, "ayah_count:", m.ayahCount, "surah_count:", m.surahs.length);

// Juz Amma = juz 30 = sourates 78..114
const juz30 = m.juz(30);
console.log("Juz 30 first ayah key:", juz30.firstAyah.key, "last ayah key:", juz30.lastAyah.key);

const out = [];
for (let sNum = 78; sNum <= 114; sNum++) {
  const surah = m.surah(sNum);
  const ayahs = surah.ayahs.map(a => ({
    number: a.number,
    key: a.key,
    text: a.render({ marks: false }),
    words: a.wordList.map(w => ({ position: w.position, text: w.text, number: w.number, index: w.index }))
  }));
  out.push({
    number: surah.number,
    name_ar: surah.nameAr,
    name_en: surah.nameEn,
    revelation: surah.revelation,
    has_basmalah: surah.hasBasmalah,
    ayah_count: surah.ayahCount,
    ayahs
  });
}

fs.mkdirSync("./data", { recursive: true });
fs.writeFileSync("./data/warsh-juz-amma.json", JSON.stringify(out), "utf-8");
console.log("Wrote", out.length, "surahs to data/warsh-juz-amma.json");

// Spot-checks manuels (voir historique de conversation pour la vérification effectuée)
const s112 = m.surah(112);
console.log("\n--- Surah 112 (Al-Ikhlas) Warsh ---");
for (const a of s112.ayahs) console.log(a.number, ":", a.render({ marks: true, ayahMarks: true }));

const s78 = m.surah(78);
console.log("\n--- Surah 78 (An-Naba) v1-3 Warsh ---");
for (const a of s78.ayahs.slice(0, 3)) console.log(a.number, ":", a.render({ marks: true, ayahMarks: true }));

