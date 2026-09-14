import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { loadSurah } from "../data/loader";
import type { Surah } from "../data/types";
import { ayahAudioUrl, RECITERS } from "../audio/reciters";
import { useAppStore } from "../store/useAppStore";
import TajwidText from "../components/TajwidText";
import { JUZ_AMMA_FIRST_SURAH, JUZ_AMMA_LAST_SURAH } from "../data/loader";

export default function SurahReader() {
  const { number } = useParams();
  const surahNumber = Number(number);
  const navigate = useNavigate();

  const [surah, setSurah] = useState<Surah | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [autoAdvance, setAutoAdvance] = useState(false);

  const reciterId = useAppStore((s) => s.reciterId);
  const fontScale = useAppStore((s) => s.fontScale);
  const setFontScale = useAppStore((s) => s.setFontScale);
  const showTajwidColors = useAppStore((s) => s.showTajwidColors);
  const toggleTajwidColors = useAppStore((s) => s.toggleTajwidColors);
  const setLastPosition = useAppStore((s) => s.setLastPosition);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    setSurah(null);
    setError(null);
    setPlayingAyah(null);
    loadSurah(surahNumber)
      .then((s) => {
        if (!cancelled) setSurah(s);
      })
      .catch((e) => {
        if (!cancelled) setError(String(e.message ?? e));
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

  function handleEnded() {
    if (!surah) return;
    if (autoAdvance && playingAyah && playingAyah < surah.ayah_count) {
      playAyah(playingAyah + 1, true);
    } else {
      setPlayingAyah(null);
    }
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
          {surah.revelation === "makki" ? "Mecquoise" : "Médinoise"} ·
          récitateur : {reciter.name}
          {!reciter.verified && " (non vérifié à l'écoute)"}
        </div>
        <button
          className="btn"
          style={{ marginTop: 10 }}
          onClick={() => playAyah(1, true)}
        >
          {playingAyah ? "▶ En lecture…" : "▶ Écouter toute la sourate"}
        </button>
      </div>

      {surah.has_basmalah && (
        <div className="basmalah arabic-text">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
      )}

      <div>
        {surah.ayahs.map((ayah) => (
          <div
            key={ayah.number}
            className={"ayah" + (playingAyah === ayah.number ? " ayah--playing" : "")}
            style={{ fontSize }}
          >
            <TajwidText text={ayah.text} colors={showTajwidColors} />
            <span className="ayah__number">{ayah.number}</span>
            <div className="ayah__toolbar">
              <button
                className="icon-btn"
                onClick={() => playAyah(ayah.number, false)}
                aria-label={`Écouter le verset ${ayah.number}`}
              >
                {playingAyah === ayah.number ? "⏸" : "▶"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <audio ref={audioRef} onEnded={handleEnded} />
    </div>
  );
}
