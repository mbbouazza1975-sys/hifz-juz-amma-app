import { useEffect, useState, type CSSProperties } from "react";
import { Link, useParams } from "react-router-dom";
import { generateQuiz, type QuizQuestion } from "../data/quiz";
import db from "../db/db";

export default function QuizRun() {
  const { scope } = useParams();
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setQuestions(null);
    setIndex(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
    generateQuiz(scope!, 10).then(setQuestions);
  }, [scope]);

  useEffect(() => {
    if (finished && questions) {
      db.quizAttempts.add({
        scope: scope!,
        score,
        total: questions.length,
        date: new Date().toISOString(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  if (!questions) return <p className="muted">Préparation du quiz…</p>;
  if (questions.length === 0) {
    return (
      <div className="card">
        <p>Pas assez de contenu pour générer un quiz sur ce périmètre.</p>
        <Link to="/quiz" className="btn btn--ghost">
          Retour
        </Link>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="card" style={{ textAlign: "center" }}>
        <h2>Résultat</h2>
        <p style={{ fontSize: 32, fontWeight: 700 }}>
          {score} / {questions.length}
        </p>
        <div className="row" style={{ justifyContent: "center", marginTop: 12 }}>
          <Link to="/quiz" className="btn btn--ghost">
            Retour aux quiz
          </Link>
          <button className="btn" onClick={() => window.location.reload()}>
            Recommencer
          </button>
        </div>
      </div>
    );
  }

  const q = questions[index];

  function choose(choice: string) {
    if (selected) return;
    setSelected(choice);
    if (choice === q.correctAnswer) setScore((s) => s + 1);
  }

  function next() {
    if (index + 1 >= questions!.length) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  }

  return (
    <div>
      <div className="row row--between" style={{ marginBottom: 12 }}>
        <span className="muted">
          Question {index + 1}/{questions.length}
        </span>
        <span className="muted">Score : {score}</span>
      </div>

      <div className="card">
        <div className="muted" style={{ marginBottom: 8 }}>
          Verset {q.ayahKey} — quel est le mot manquant ?
        </div>
        <div className="arabic-text" style={{ fontSize: 26, lineHeight: 2 }}>
          {q.words.map((w, i) =>
            i === q.blankIndex ? (
              <span key={i} style={{ color: "var(--accent)" }}>
                {" "}
                ______{" "}
              </span>
            ) : (
              <span key={i}> {w} </span>
            ),
          )}
        </div>
      </div>

      <div className="stack" style={{ marginTop: 12 }}>
        {q.choices.map((choice) => {
          const isCorrect = choice === q.correctAnswer;
          const isSelected = choice === selected;
          let style: CSSProperties = {};
          if (selected) {
            if (isCorrect) style = { borderColor: "var(--accent)", background: "var(--accent-soft)" };
            else if (isSelected) style = { borderColor: "var(--danger)" };
          }
          return (
            <button
              key={choice}
              className="card arabic-text"
              style={{ fontSize: 22, textAlign: "center", ...style }}
              onClick={() => choose(choice)}
            >
              {choice}
            </button>
          );
        })}
      </div>

      {selected && (
        <button className="btn" style={{ marginTop: 12, width: "100%" }} onClick={next}>
          {index + 1 >= questions.length ? "Voir le résultat" : "Question suivante →"}
        </button>
      )}
    </div>
  );
}
