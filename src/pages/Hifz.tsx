import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import db, { type SurahProgress } from "../db/db";
import { loadAllSummaries } from "../data/loader";
import type { SurahSummary } from "../data/types";

const STAGE_LABEL: Record<string, string> = {
  sabaq: "Sabaq (nouvelle mémorisation)",
  sabqi: "Sabqi (révision récente)",
  manzil: "Manzil (révision ancienne)",
};

function today(): string {
  return new Date().toISOString();
}

export default function Hifz() {
  const [meta, setMeta] = useState<SurahSummary[] | null>(null);
  useEffect(() => {
    loadAllSummaries().then(setMeta);
  }, []);

  const progress = useLiveQuery(() => db.surahProgress.toArray(), []);

  if (!meta || !progress) return <p className="muted">Chargement…</p>;

  const byStage = (stage: string) =>
    progress
      .filter((p) => p.stage === stage)
      .sort((a, b) => a.surah - b.surah);

  const nameFor = (n: number) =>
    meta.find((s) => s.number === n)?.name_en ?? `Sourate ${n}`;

  const sabaq = byStage("sabaq")[0]; // une seule à la fois
  const sabqi = byStage("sabqi");
  const manzil = byStage("manzil");

  const started = new Set(progress.map((p) => p.surah));
  const nextNew = meta.find((s) => !started.has(s.number));

  async function startNewSabaq(surahNumber: number) {
    const rec: SurahProgress = {
      surah: surahNumber,
      stage: "sabaq",
      startedAt: today(),
      lastReviewedAt: today(),
      reviewCount: 0,
    };
    await db.surahProgress.put(rec);
  }

  async function markReviewed(surah: number) {
    const rec = await db.surahProgress.get(surah);
    if (!rec) return;
    await db.surahProgress.put({
      ...rec,
      lastReviewedAt: today(),
      reviewCount: rec.reviewCount + 1,
    });
  }

  async function advanceStage(surah: number, stage: SurahProgress["stage"]) {
    const rec = await db.surahProgress.get(surah);
    if (!rec) return;
    await db.surahProgress.put({ ...rec, stage, lastReviewedAt: today() });
  }

  return (
    <div>
      <h1 className="page-title">Routine Hifz</h1>
      <p className="muted" style={{ marginTop: -10, marginBottom: 16 }}>
        Méthode classique Sabaq / Sabqi / Manzil.
      </p>

      <section className="card">
        <div style={{ fontWeight: 700, marginBottom: 8 }}>
          {STAGE_LABEL.sabaq}
        </div>
        {sabaq ? (
          <div className="row row--between">
            <Link to={`/sourate/${sabaq.surah}`}>
              <strong>{nameFor(sabaq.surah)}</strong>
              <div className="muted">
                {sabaq.reviewCount} révision(s) · démarré le{" "}
                {new Date(sabaq.startedAt).toLocaleDateString("fr-BE")}
              </div>
            </Link>
            <div className="stack" style={{ gap: 6 }}>
              <button
                className="btn btn--sm"
                onClick={() => markReviewed(sabaq.surah)}
              >
                Révisé aujourd'hui
              </button>
              <button
                className="btn btn--ghost btn--sm"
                onClick={() => advanceStage(sabaq.surah, "sabqi")}
              >
                Passer en Sabqi →
              </button>
            </div>
          </div>
        ) : nextNew ? (
          <div className="row row--between">
            <span>
              Prochaine sourate : <strong>{nextNew.name_en}</strong>
            </span>
            <button className="btn btn--sm" onClick={() => startNewSabaq(nextNew.number)}>
              Commencer
            </button>
          </div>
        ) : (
          <p className="muted">Les 37 sourates ont été démarrées 🎉</p>
        )}
      </section>

      <section className="card">
        <div style={{ fontWeight: 700, marginBottom: 8 }}>
          {STAGE_LABEL.sabqi} ({sabqi.length})
        </div>
        {sabqi.length === 0 && <p className="muted">Rien à réviser ici pour l'instant.</p>}
        <div className="stack">
          {sabqi.map((p) => (
            <div key={p.surah} className="row row--between">
              <Link to={`/sourate/${p.surah}`}>{nameFor(p.surah)}</Link>
              <div className="row">
                <button className="icon-btn" onClick={() => markReviewed(p.surah)}>
                  ✓ Révisé
                </button>
                <button
                  className="icon-btn"
                  onClick={() => advanceStage(p.surah, "manzil")}
                >
                  → Manzil
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <div style={{ fontWeight: 700, marginBottom: 8 }}>
          {STAGE_LABEL.manzil} ({manzil.length})
        </div>
        {manzil.length === 0 && <p className="muted">Rien ici pour l'instant.</p>}
        <div className="stack">
          {manzil.map((p) => (
            <div key={p.surah} className="row row--between">
              <Link to={`/sourate/${p.surah}`}>{nameFor(p.surah)}</Link>
              <button className="icon-btn" onClick={() => markReviewed(p.surah)}>
                ✓ Révisé
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
