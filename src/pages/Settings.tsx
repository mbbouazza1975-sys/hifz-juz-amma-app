import { useAppStore } from "../store/useAppStore";
import { RECITERS, type ReciterId } from "../audio/reciters";

export default function Settings() {
  const reciterId = useAppStore((s) => s.reciterId);
  const setReciterId = useAppStore((s) => s.setReciterId);
  const showTajwidColors = useAppStore((s) => s.showTajwidColors);
  const toggleTajwidColors = useAppStore((s) => s.toggleTajwidColors);
  const showWordHints = useAppStore((s) => s.showWordHints);
  const toggleWordHints = useAppStore((s) => s.toggleWordHints);
  const fontScale = useAppStore((s) => s.fontScale);
  const setFontScale = useAppStore((s) => s.setFontScale);

  return (
    <div>
      <h1 className="page-title">Réglages</h1>

      <section className="card">
        <div style={{ fontWeight: 700, marginBottom: 10 }}>Récitateur (Warsh)</div>
        <div className="stack">
          {Object.values(RECITERS).map((r) => (
            <label key={r.id} className="row row--between">
              <span>
                {r.name}
                {!r.verified && (
                  <span className="muted"> — à vérifier à l'écoute</span>
                )}
              </span>
              <input
                type="radio"
                name="reciter"
                checked={reciterId === r.id}
                onChange={() => setReciterId(r.id as ReciterId)}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="card">
        <label className="row row--between">
          <span>Coloration tajwid</span>
          <input
            type="checkbox"
            checked={showTajwidColors}
            onChange={toggleTajwidColors}
          />
        </label>
        <p className="muted" style={{ marginTop: 8 }}>
          Seules 3 règles sûres pour le Warsh sont colorées (ghunna, qalqalah,
          madd), déduites des marques du texte source lui-même — pas d'un
          corpus de règles Hafs importé tel quel.
        </p>
      </section>

      <section className="card">
        <label className="row row--between">
          <span>Indices mot par mot</span>
          <input
            type="checkbox"
            checked={showWordHints}
            onChange={toggleWordHints}
          />
        </label>
      </section>

      <section className="card">
        <div className="row row--between">
          <span>Taille du texte</span>
          <div className="row">
            <button className="icon-btn" onClick={() => setFontScale(Math.max(0.75, fontScale - 0.1))}>
              A-
            </button>
            <span className="muted">{Math.round(fontScale * 100)}%</span>
            <button className="icon-btn" onClick={() => setFontScale(Math.min(1.5, fontScale + 0.1))}>
              A+
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
