import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import db from "../db/db";
import { loadAllSummaries } from "../data/loader";
import type { SurahSummary } from "../data/types";

export default function QuizHub() {
  const [meta, setMeta] = useState<SurahSummary[] | null>(null);
  useEffect(() => {
    loadAllSummaries().then(setMeta);
  }, []);

  const attempts = useLiveQuery(
    () => db.quizAttempts.orderBy("date").reverse().limit(5).toArray(),
    [],
  );

  return (
    <div>
      <h1 className="page-title">Quiz</h1>

      <Link to="/quiz/all" className="card" style={{ display: "block" }}>
        <div className="row row--between">
          <div>
            <strong>Quiz global</strong>
            <div className="muted">Mélange des 37 sourates du Juz 'Amma</div>
          </div>
          <span aria-hidden="true">→</span>
        </div>
      </Link>

      <div style={{ marginTop: 16, marginBottom: 8, fontWeight: 700 }}>
        Quiz par sourate
      </div>
      <div className="stack">
        {meta?.map((s) => (
          <Link key={s.number} to={`/quiz/${s.number}`} className="card">
            <div className="row row--between">
              <span>
                {s.number}. {s.name_en}
              </span>
              <span className="arabic-text">{s.name_ar}</span>
            </div>
          </Link>
        ))}
      </div>

      {attempts && attempts.length > 0 && (
        <>
          <div style={{ marginTop: 16, marginBottom: 8, fontWeight: 700 }}>
            Derniers résultats
          </div>
          <div className="stack">
            {attempts.map((a) => (
              <div key={a.id} className="card row row--between">
                <span>{a.scope === "all" ? "Quiz global" : `Sourate ${a.scope}`}</span>
                <span>
                  {a.score}/{a.total}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
