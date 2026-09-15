import type { SurahContent } from "./types";

// Sourate 106 — Quraych — contenu pilote (15 sept 2026)
//
// Sources par section, voir aussi les champs `source`/`certainty` :
// - Traduction : Muhammad Hamidullah, via QuranEnc.com (Encyclopédie du
//   Noble Coran) — licence de réutilisation avec attribution obligatoire,
//   sans modification du sens. Texte original en 4 versets (numérotation
//   Hafs) ; le verset 4 Hafs est ici réparti sur les versets Warsh 4 et 5
//   (voir numbering_note) en conservant les mots exacts de la traduction.
// - Contexte historique : Tafsir Ibn Kathir, sourate Quraych (alim.org,
//   version anglaise), reformulé en français ici.
// - Section NAK et section "aujourd'hui" : rédaction originale pour cette
//   app, pas une citation.

const content: SurahContent = {
  number: 106,
  summary:
    "Allah rappelle aux Quraych deux bienfaits concrets — leurs caravanes commerciales d'hiver et d'été, et la sécurité de la Kaaba — pour leur demander une seule chose en retour : L'adorer Lui seul, le Seigneur de cette Maison.",
  key_point:
    "Tout ce qu'on possède vient d'Allah. La vraie reconnaissance, c'est de L'adorer en retour.",
  numbering_note:
    "Le mushaf Warsh découpe cette sourate en 5 versets (le verset 4 de la numérotation Hafs, \"qui les a nourris... et les a mis à l'abri...\", est scindé en deux versets distincts, 4 et 5) — vérifié sur nos données texte Warsh (source KFGQPC, contrôle octet-exact).",
  historical_context: {
    text:
      "Ibn Kathir relie directement cette sourate à la précédente, Al-Fîl : Allah a repoussé l'armée de l'éléphant afin de préserver et rassembler les Quraych en sécurité dans leur cité. Le mot \"îlâf\" désigne ici leurs caravanes commerciales saisonnières — l'hiver vers le Yémen, l'été vers la Sham — effectuées en sécurité grâce au respect accordé aux gardiens de la Maison sacrée ; les autres voyageurs qui les accompagnaient en bénéficiaient aussi. En échange de ces deux bienfaits — la nourriture et la sécurité — Allah leur ordonne d'adorer exclusivement le Seigneur de cette Maison, sans Lui associer d'idoles.",
    source:
      "Tafsir Ibn Kathir, sourate Quraych (alim.org, tafsir.ibn-kathir, version anglaise) — reformulé en français ici",
    certainty: "probable",
  },
  nak_section: {
    text:
      "Dans son enseignement sur cette sourate, Nouman Ali Khan relève que les deux bienfaits cités — la nourriture (contre la faim) et la sécurité (contre la peur) — correspondent aux besoins les plus fondamentaux de tout être humain. Le message : avant même de parler de richesse ou de statut social, Allah rappelle ce qui est à la base de tout, et qui ne dépend jamais de nous seuls.",
    bayyinah_link: "https://bayyinah.com",
    disclaimer:
      "Reformulation inspirée de son approche pédagogique, pas une citation littérale — pour l'entendre de sa bouche, voir ses cours sur Bayyinah Institute.",
  },
  today_section: {
    text:
      "Manger à sa faim et dormir en sécurité : deux choses qu'on ne remarque en général que lorsqu'elles viennent à manquer. Cette sourate en fait une raison quotidienne de remercier — pas seulement pour les grands événements de la vie, mais pour ce qui semble aller de soi.",
  },
  ayahs: [
    {
      number: 1,
      translation: {
        text: "Pour l'habitude des Quraych,",
        source: "Muhammad Hamidullah, via QuranEnc.com",
        certainty: "certain",
      },
      sens: "Introduit le sujet : l'accoutumance, l'habitude bien ancrée des Quraych.",
      glossary: [
        { word: "إِيلَٰفِ", meaning: "accoutumance, attachement habituel et sécurisant" },
        { word: "قُرَيْشٍ", meaning: "Quraych, la tribu du Prophète ﷺ, gardienne de la Kaaba" },
      ],
    },
    {
      number: 2,
      translation: {
        text: "leur habitude des voyages d'hiver et d'été,",
        source: "Muhammad Hamidullah, via QuranEnc.com",
        certainty: "certain",
      },
      sens: "Précise de quelle habitude il s'agit : les deux grandes caravanes commerciales annuelles.",
      glossary: [
        { word: "رِحْلَةَ", meaning: "voyage, expédition (ici : caravane commerciale)" },
        { word: "ٱلشِّتَآءِ", meaning: "l'hiver — caravane vers le Yémen" },
        { word: "وَٱلصَّيْفِ", meaning: "et l'été — caravane vers la Sham" },
      ],
    },
    {
      number: 3,
      translation: {
        text: "qu'ils adorent donc le Seigneur de cette Maison,",
        source: "Muhammad Hamidullah, via QuranEnc.com",
        certainty: "certain",
      },
      sens: "Le tournant de la sourate : de ce bienfait découle un ordre clair — adorer Celui qui en est la source.",
      glossary: [
        { word: "فَلْيَعْبُدُوا۟", meaning: "qu'ils adorent donc (ordre, conséquence directe)" },
        { word: "رَبَّ هَٰذَا ٱلْبَيْتِ", meaning: "le Seigneur de cette Maison, la Kaaba" },
      ],
    },
    {
      number: 4,
      translation: {
        text: "qui les a nourris contre la faim",
        source:
          "Muhammad Hamidullah, via QuranEnc.com — verset 4 Hafs réparti ici sur les versets Warsh 4 et 5",
        certainty: "certain",
      },
      sens: "Premier des deux bienfaits rappelés : la nourriture.",
      glossary: [{ word: "أَطْعَمَهُم", meaning: "les a nourris" }, { word: "جُوعٍۢ", meaning: "la faim" }],
    },
    {
      number: 5,
      translation: {
        text: "et les a mis à l'abri de la peur.",
        source:
          "Muhammad Hamidullah, via QuranEnc.com — verset 4 Hafs réparti ici sur les versets Warsh 4 et 5",
        certainty: "certain",
      },
      sens: "Second bienfait : la sécurité — en écho direct à la protection de la Kaaba dans Al-Fîl.",
      glossary: [{ word: "وَءَامَنَهُم", meaning: "et les a mis en sécurité" }, { word: "خَوْفٍۭ", meaning: "la peur, la crainte" }],
    },
  ],
};

export default content;
