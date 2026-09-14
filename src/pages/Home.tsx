import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadAllSummaries } from "../data/loader";
import type { SurahSummary } from "../data/types";
import { useAppStore } from "../store/useAppStore";

export default function Home() {
  const [surahs, setSurahs] = useState<SurahSummary[] | null>(null);
  const lastSurah = useAppStore((s) => s.lastSurah);
  const lastAyah = useAppStore((s) => s.lastAyah);

  useEffect(() => {
    loadAllSummaries().then(setSurahs);
  }, []);

  return (
    <div>
      <h1 className="page-title">Juz 'Amma — Warsh</h1>

      {lastSurah && (
        <Link to={`/sourate/${lastSurah}`} className="card" style={{ display: "block", marginBottom: 16 }}>
          <div className="row row--between">
            <div>
              <div className="muted">Reprendre la lecture</div>
              <strong>
                Sourate {lastSurah}
                {lastAyah ? ` · verset ${lastAyah}` : ""}
              </strong>
            </div>
            <span aria-hidden="true">→</span>
          </div>
        </Link>
      )}

      <div className="stack">
        {surahs === null && <p className="muted">Chargement…</p>}
        {surahs?.map((s) => (
          <Link key={s.number} to={`/sourate/${s.number}`} className="card">
            <div className="row row--between">
              <div className="row">
                <span
                  className="muted"
                  style={{
                    minWidth: 28,
                    textAlign: "center",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {s.number}
                </span>
                <div>
                  <div style={{ fontWeight: 600 }}>{s.name_en}</div>
                  <div className="muted">
                    {s.ayah_count} versets · {s.revelation === "makki" ? "Mecquoise" : "Médinoise"}
                  </div>
                </div>
              </div>
              <span className="arabic-text" style={{ fontSize: 20 }}>
                {s.name_ar}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
