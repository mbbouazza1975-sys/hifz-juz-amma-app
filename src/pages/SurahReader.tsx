import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { loadSurah, loadSurahContent } from "../data/loader";
import type { Surah } from "../data/types";
import type { SurahContent } from "../data/content/types";
import {
  ayahAudioUrl,
  RECITERS,
  SURAH_RECITERS,
  surahAudioUrl,
} from "../audio/reciters";
import { useAppStore } from "../store/useAppStore";
import TajwidText from "../components/TajwidText";
import { JUZ_AMMA_FIRST_SURAH, JUZ_AMMA_LAST_SURAH } from "../data/loader";

const CERTAINTY_LABEL: Record<string, string> = {
  certain: "Certain",
  probable: "Probable",
  a_verifier: "À vérifier",
};

function SourceNote({
  source,
  certainty,
}: {
  source: string;
  certainty: string;
}) {
  return (
    <div className="muted" style={{ fontSize: 11, marginTop: 6 }}>
      Source : {source} · {CERTAINTY_LABEL[certainty] ?? certainty}
    </div>
  );
}

export default function SurahReader() {
  const { number } = useParams();
  const surahNumber = Number(number);
  const navigate = useNavigate();

  const [surah, setSurah] = useState<Surah | null>(null);
  const [content, setContent] = useState<SurahContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [openAyahPanel, setOpenAyahPanel] = useState<
    Record<number, "sens" | "dico" | null>
  >({});

  const reciterId = useAppStore((s) => s.reciterId);
  const audioMode = useAppStore((s) => s.audioMode);
  const setAudioMode = useAppStore((s) => s.setAudioMode);
  const surahReciterId = useAppStore((s) => s.surahReciterId);
  const setSurahReciterId = useAppStore((s) => s.setSurahReciterId);
  const fontScale = useAppStore((s) => s.fontScale);
  const setFontScale = useAppStore((s) => s.setFontScale);
  const showTajwidColors = useAppStore((s) => s.showTajwidColors);
  const toggleTajwidColors = useAppStore((s) => s.toggleTajwidColors);
  const setLastPosition = useAppStore((s) => s.setLastPosition);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    setSurah(null);
    setContent(null);
    setError(null);
    setPlayingAyah(null);
    setOpenAyahPanel({});
    loadSurah(surahNumber)
      .then((s) => {
        if (!cancelled) setSurah(s);
      })
      .catch((e) => {
        if (!cancelled) setError(String(e.message ?? e));
      });
    loadSurahContent(surahNumber).then((c) => {
      if (!cancelled) setContent(c);
    });
    return () => {
      cancelled = true;
    };
  }, [surahNumber]);

  useEffect(() => {
    if (surah) setLastPosition(surah.number, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surah?.number]);

  const reciter = RECITERS[reciterId];

  function playAyah(ayahNumber: number, chain: boolean) {
    if (!audioRef.current) return;
    setAutoAdvance(chain);
    setPlayingAyah(ayahNumber);
    setLastPosition(surahNumber, ayahNumber);
    audioRef.current.src = ayahAudioUrl(reciterId, surahNumber, ayahNumber);
    audioRef.current.play().catch(() => {
      setError(
        "Lecture audio impossible — vérifier la connexion ou choisir un autre récitateur dans les réglages.",
      );
    });
  }

  function playFullSurah() {
    if (!audioRef.current) return;
    setPlayingAyah(-1); // -1 = lecture continue "sourate entière" (pas de surlignage par verset)
    audioRef.current.src = surahAudioUrl(surahReciterId, surahNumber);
    audioRef.current.play().catch(() => {
      setError(
        "Lecture audio impossible pour ce récitateur — le fichier n'est peut-être pas hébergé à cette adresse (voir la note de vérification dans les réglages).",
      );
    });
  }

  function handleEnded() {
    if (!surah) return;
    if (audioMode === "surah") {
      setPlayingAyah(null);
      return;
    }
    if (autoAdvance && playingAyah && playingAyah < surah.ayah_count) {
      playAyah(playingAyah + 1, true);
    } else {
      setPlayingAyah(null);
    }
  }

  function toggleAyahPanel(ayahNumber: number, panel: "sens" | "dico") {
    setOpenAyahPanel((prev) => ({
      ...prev,
      [ayahNumber]: prev[ayahNumber] === panel ? null : panel,
    }));
  }

  const canPrev = surahNumber > JUZ_AMMA_FIRST_SURAH;
  const canNext = surahNumber < JUZ_AMMA_LAST_SURAH;

  const fontSize = useMemo(() => Math.round(30 * fontScale), [fontScale]);

  if (error) {
    return (
      <div className="card">
        <p>Erreur : {error}</p>
        <Link to="/" className="btn btn--ghost">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  if (!surah) {
    return <p className="muted">Chargement de la sourate…</p>;
  }

  const contentByAyah = new Map((content?.ayahs ?? []).map((a) => [a.number, a]));

  return (
    <div>
      <div className="sticky-toolbar">
        <button
          className="icon-btn"
          onClick={() => canPrev && navigate(`/sourate/${surahNumber - 1}`)}
          disabled={!canPrev}
          aria-label="Sourate précédente"
        >
          ◀
        </button>
        <span className="muted" style={{ whiteSpace: "nowrap" }}>
          {surahNumber}/114
        </span>
        <button
          className="icon-btn"
          onClick={() => canNext && navigate(`/sourate/${surahNumber + 1}`)}
          disabled={!canNext}
          aria-label="Sourate suivante"
        >
          ▶
        </button>
        <span style={{ flex: 1 }} />
        <button
          className={"icon-btn" + (showTajwidColors ? " icon-btn--active" : "")}
          onClick={toggleTajwidColors}
          title="Coloration tajwid"
        >
          🎨
        </button>
        <button
          className="icon-btn"
          onClick={() => setFontScale(Math.max(0.75, fontScale - 0.1))}
        >
          A-
        </button>
        <button
          className="icon-btn"
          onClick={() => setFontScale(Math.min(1.5, fontScale + 0.1))}
        >
          A+
        </button>
      </div>

      <div className="surah-header">
        <div className="muted">{surah.number}. {surah.name_en}</div>
        <div className="arabic-text" style={{ fontSize: 30 }}>
          {surah.name_ar}
        </div>
        <div className="muted">
          {surah.ayah_count} versets ·{" "}
          {surah.revelation === "makki" ? "Mecquoise" : "Médinoise"}
        </div>
      </div>

      {content && (
        <div className="card">
          <p style={{ margin: 0 }}>{content.summary}</p>
          <div
            className="card"
            style={{ background: "var(--accent-soft)", marginTop: 10, border: "none" }}
          >
            💡 {content.key_point}
          </div>
        </div>
      )}

      {content && (
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 6 }}>🏺 Contexte historique</div>
          <span
            className="card"
            style={{ display: "inline-block", padding: "2px 10px", fontSize: 12, marginBottom: 8 }}
          >
            {surah.revelation === "makki" ? "Mecquoise" : "Médinoise"}
          </span>
          <p>{content.historical_context.text}</p>
          <SourceNote
            source={content.historical_context.source}
            certainty={content.historical_context.certainty}
          />
          {content.numbering_note && (
            <div className="muted" style={{ fontSize: 11, marginTop: 6 }}>
              ℹ️ {content.numbering_note}
            </div>
          )}

          <div
            className="card"
            style={{ background: "var(--accent-soft)", marginTop: 10, border: "none" }}
          >
            <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 4 }}>
              🎓 INSPIRÉ DE L'APPROCHE DE NOUMAN ALI KHAN
            </div>
            <p style={{ margin: "0 0 6px" }}>{content.nak_section.text}</p>
            <div className="muted" style={{ fontSize: 11, marginBottom: 6 }}>
              {content.nak_section.disclaimer}
            </div>
            <a
              href={content.nak_section.bayyinah_link}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 13, fontWeight: 600 }}
            >
              Écouter ses cours (Bayyinah Institute) →
            </a>
          </div>
        </div>
      )}

      {content && (
        <div className="card" style={{ background: "var(--accent)", color: "white" }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>✨ Et toi, aujourd'hui ?</div>
          <p style={{ margin: 0 }}>{content.today_section.text}</p>
        </div>
      )}

      <div className="card">
        <div className="row" style={{ flexWrap: "wrap", gap: "6px 14px", fontSize: 12 }}>
          <span><span className="tajwid-madd">●</span> Madd · son long</span>
          <span><span className="tajwid-ghunnah">●</span> Ghunna · nasal</span>
          <span><span className="tajwid-qalqalah">●</span> Qalqala · rebond</span>
          <span><span className="tajwid-tafkhim">●</span> Tafkhîm · emphatique</span>
          <span><span className="tajwid-tarqiq">●</span> Tarqîq · atténué (râ)</span>
        </div>
      </div>

      <div className="card">
        <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
          <button
            className={"btn btn--sm" + (audioMode === "ayah" ? "" : " btn--ghost")}
            onClick={() => setAudioMode("ayah")}
          >
            Verset par verset
          </button>
          <button
            className={"btn btn--sm" + (audioMode === "surah" ? "" : " btn--ghost")}
            onClick={() => setAudioMode("surah")}
          >
            Sourate entière
          </button>
        </div>
        {audioMode === "ayah" ? (
          <div className="muted" style={{ fontSize: 12, marginTop: 8 }}>
            Récitateur : {reciter.name}
            {!reciter.verified && " (non vérifié à l'écoute)"} — repeat et
            surlignage disponibles.
          </div>
        ) : (
          <div style={{ marginTop: 8 }}>
            <select
              value={surahReciterId}
              onChange={(e) => setSurahReciterId(e.target.value as typeof surahReciterId)}
              style={{ width: "100%", padding: 8, borderRadius: 8 }}
            >
              {Object.values(SURAH_RECITERS).map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} — {r.tariq}
                </option>
              ))}
            </select>
            <div className="muted" style={{ fontSize: 11, marginTop: 6 }}>
              Source : mp3quran.net (API officielle) — lecture continue,
              pas de surlignage par verset possible sur ce mode.
            </div>
            <button className="btn btn--sm" style={{ marginTop: 8 }} onClick={playFullSurah}>
              {playingAyah === -1 ? "▶ En lecture…" : "▶ Écouter la sourate entière"}
            </button>
          </div>
        )}
      </div>

      {surah.has_basmalah && (
        <div className="basmalah arabic-text">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
      )}

      <div>
        {surah.ayahs.map((ayah) => {
          const ac = contentByAyah.get(ayah.number);
          const panel = openAyahPanel[ayah.number];
          return (
            <div
              key={ayah.number}
              className={"ayah" + (playingAyah === ayah.number ? " ayah--playing" : "")}
            >
              <div style={{ fontSize }}>
                <TajwidText text={ayah.text} colors={showTajwidColors} />
                <span className="ayah__number">{ayah.number}</span>
              </div>
              {ac && <p className="muted" style={{ margin: "6px 0 0" }}>{ac.translation.text}</p>}
              <div className="ayah__toolbar">
                <button
                  className="icon-btn"
                  onClick={() => playAyah(ayah.number, false)}
                  aria-label={`Écouter le verset ${ayah.number}`}
                >
                  {playingAyah === ayah.number ? "⏸" : "▶"}
                </button>
                {ac?.sens && (
                  <button
                    className={"icon-btn" + (panel === "sens" ? " icon-btn--active" : "")}
                    onClick={() => toggleAyahPanel(ayah.number, "sens")}
                  >
                    💡 Sens
                  </button>
                )}
                {ac?.glossary && ac.glossary.length > 0 && (
                  <button
                    className={"icon-btn" + (panel === "dico" ? " icon-btn--active" : "")}
                    onClick={() => toggleAyahPanel(ayah.number, "dico")}
                  >
                    🔤 Dictionnaire
                  </button>
                )}
              </div>
              {panel === "sens" && ac?.sens && (
                <div className="card" style={{ marginTop: 6 }}>
                  {ac.sens}
                  <SourceNote source={ac.translation.source} certainty={ac.translation.certainty} />
                </div>
              )}
              {panel === "dico" && ac?.glossary && (
                <div className="card" style={{ marginTop: 6 }}>
                  <div className="stack">
                    {ac.glossary.map((g, i) => (
                      <div key={i} className="row" style={{ gap: 8 }}>
                        <span className="arabic-text" style={{ fontSize: 18 }}>{g.word}</span>
                        <span className="muted">— {g.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <audio ref={audioRef} onEnded={handleEnded} />
    </div>
  );
}
