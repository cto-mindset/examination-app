import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart2,
  Bookmark,
  CheckCircle2,
  Clock,
  Code2,
  FileText,
  Info,
  Lightbulb,
} from "lucide-react";

function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function arraysEqual(a = [], b = []) {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort((x, y) => x - y);
  const sortedB = [...b].sort((x, y) => x - y);
  return sortedA.every((val, idx) => val === sortedB[idx]);
}

const INLINE_CODE_TOKEN_RE = /(`[^`]+`|<\/?[a-zA-Z!][^<>\n]*>)/g;

function renderInlineText(text) {
  if (typeof text !== "string" || !text) return text;
  const parts = text.split(INLINE_CODE_TOKEN_RE);
  if (parts.length === 1) return text;

  return parts.map((part, idx) => {
    if (!part) return null;
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code key={idx} className="code-inline">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (/^<\/?[a-zA-Z!][^<>\n]*>$/.test(part)) {
      return (
        <code key={idx} className="code-inline">
          {part}
        </code>
      );
    }
    return part;
  });
}

function renderQuestionContent(text) {
  if (typeof text !== "string" || !text) return null;
  const separatorIndex = text.indexOf("\n\n");
  if (separatorIndex === -1) {
    return renderInlineText(text);
  }

  const prose = text.slice(0, separatorIndex);
  const codeSnippet = text.slice(separatorIndex + 2);

  return (
    <>
      <span>{renderInlineText(prose)}</span>
      <pre className="code-block">
        <code>{codeSnippet}</code>
      </pre>
    </>
  );
}

export default function TestRunner({ testData, onExit }) {
  const questions = testData?.questions || [];
  const initialSeconds = (testData?.total_minutes || 10) * 60;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showHint, setShowHint] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = useCallback(() => {
    setIsSubmitted(true);
  }, []);

  useEffect(() => {
    if (isSubmitted) return undefined;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted]);

  const currentQuestion = questions[currentIndex];
  const selectedForCurrent = answers[currentQuestion?.id] || [];

  const handleSelectOption = (optionIndex) => {
    if (isSubmitted || !currentQuestion) return;

    setAnswers((prev) => {
      if (currentQuestion.type === "multiple") {
        const existing = prev[currentQuestion.id] || [];
        const updated = existing.includes(optionIndex)
          ? existing.filter((i) => i !== optionIndex)
          : [...existing, optionIndex];
        return { ...prev, [currentQuestion.id]: updated };
      }
      return { ...prev, [currentQuestion.id]: [optionIndex] };
    });
  };

  const goToQuestion = (index) => {
    setCurrentIndex(index);
    setShowHint(false);
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentIndex(0);
    setShowHint(false);
    setSecondsLeft(initialSeconds);
    setIsSubmitted(false);
  };

  const results = useMemo(() => {
    let correctCount = 0;
    const breakdown = questions.map((q) => {
      const userSelected = answers[q.id] || [];
      const isCorrect = arraysEqual(userSelected, q.correct_indices || []);
      if (isCorrect) correctCount += 1;
      return {
        question: q,
        userSelected,
        isCorrect,
      };
    });

    const total = questions.length;
    const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    return { correctCount, total, percentage, breakdown };
  }, [questions, answers]);

  if (questions.length === 0) {
    return (
      <div className="app-shell login-shell">
        <div className="login-wave-top" aria-hidden="true" />
        <div className="login-wave-bottom" aria-hidden="true" />
        <div className="runner-page">
          <div className="runner-card">
            <p>Ushbu testda savollar topilmadi.</p>
            <button type="button" className="btn-primary" onClick={onExit}>
              Bosh sahifaga qaytish
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="app-shell login-shell">
        <div className="login-wave-top" aria-hidden="true" />
        <div className="login-wave-bottom" aria-hidden="true" />
        <div className="dot-matrix dot-matrix-tr" aria-hidden="true" />
        <div className="dot-matrix dot-matrix-bl" aria-hidden="true" />

        <div className="runner-page">
          <div className="results-container">
            <div className="results-summary-card">
              <div className="results-header">
                <h1>{testData.title} — Natijalar</h1>
                <div
                  className={`score-circle ${
                    results.percentage >= 70 ? "score-pass" : "score-warn"
                  }`}
                >
                  <span className="score-percent">{results.percentage}%</span>
                  <span className="score-fraction">
                    {results.correctCount} / {results.total}
                  </span>
                </div>
              </div>

              <div className="results-actions">
                <button type="button" className="btn-outline" onClick={handleRetake}>
                  Qayta topshirish
                </button>
                <button type="button" className="btn-primary" onClick={onExit}>
                  Bosh sahifaga qaytish
                </button>
              </div>
            </div>

            <div className="review-list">
              {results.breakdown.map((item, idx) => {
                const { question, userSelected, isCorrect } = item;
                return (
                  <article
                    key={question.id}
                    className={`review-card ${
                      isCorrect ? "review-correct" : "review-wrong"
                    }`}
                  >
                    <div className="review-card-head">
                      <span className="review-q-num">Savol #{idx + 1}</span>
                      <span
                        className={`review-status ${
                          isCorrect ? "text-success" : "text-danger"
                        }`}
                      >
                        {isCorrect ? "✅ To'g'ri" : "❌ Noto'g'ri"}
                      </span>
                    </div>

                    <div className="review-question">
                      {renderQuestionContent(question.question)}
                    </div>

                    <div className="review-options">
                      {question.options.map((opt, optIdx) => {
                        const isUserPick = userSelected.includes(optIdx);
                        const isRightOpt = (question.correct_indices || []).includes(
                          optIdx
                        );

                        let optClass = "review-opt";
                        if (isRightOpt) optClass += " opt-correct";
                        else if (isUserPick && !isRightOpt) optClass += " opt-wrong";

                        return (
                          <div key={optIdx} className={optClass}>
                            <span className="opt-marker">
                              {isRightOpt ? "✓" : isUserPick ? "✕" : "•"}
                            </span>
                            <span>{renderInlineText(opt)}</span>
                            {isUserPick && (
                              <span className="opt-tag">Sizning javobingiz</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {question.explanation && (
                      <div className="explanation-box">
                        <strong>Izoh:</strong> {renderInlineText(question.explanation)}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const answeredCount = questions.filter(
    (q) => (answers[q.id] || []).length > 0
  ).length;
  const isDangerTime = secondsLeft < 60;

  return (
    <div className="app-shell login-shell">
      <div className="login-wave-top" aria-hidden="true" />
      <div className="login-wave-bottom" aria-hidden="true" />
      <div className="dot-matrix dot-matrix-tr" aria-hidden="true" />
      <div className="dot-matrix dot-matrix-bl" aria-hidden="true" />

      <div className="runner-page">
        <header className="runner-topbar">
          <div className="runner-title-group">
            <button type="button" className="runner-exit-btn" onClick={onExit}>
              <ArrowLeft size={16} strokeWidth={2.2} />
              <span>Chiqish</span>
            </button>
            <span className="runner-topbar-divider" aria-hidden="true" />
            <div className="runner-title-wrap">
              <Code2 size={20} strokeWidth={2.4} className="runner-title-icon" />
              <h1>{testData.title}</h1>
            </div>
          </div>

          <div className="runner-meta">
            <span className="runner-stat-pill">
              <FileText size={16} strokeWidth={2.1} className="stat-pill-icon" />
              <span>
                Javob berildi: <strong>{answeredCount}/{questions.length}</strong>
              </span>
            </span>
            <div
              className={`runner-timer-pill ${
                isDangerTime ? "timer-danger" : ""
              }`}
            >
              <Clock size={16} strokeWidth={2.2} />
              <span>{formatTime(secondsLeft)}</span>
            </div>
          </div>
        </header>

        <div className="runner-layout">
          <main className="question-card">
            <div className="question-head">
              <span className="question-badge">
                Savol {currentIndex + 1} / {questions.length}
              </span>
              <span className="question-type-badge">
                <Bookmark size={14} strokeWidth={2.1} />
                <span>
                  {currentQuestion.type === "multiple"
                    ? "Bir nechta javobli"
                    : "Bitta javobli"}
                </span>
              </span>
            </div>

            <div className="question-title-row">
              <span className="question-q-icon" aria-hidden="true">
                ?
              </span>
              <h2 className="question-text q-text">
                {renderQuestionContent(currentQuestion.question)}
              </h2>
            </div>

            <div className="options-list">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedForCurrent.includes(idx);
                const inputType =
                  currentQuestion.type === "multiple" ? "checkbox" : "radio";

                return (
                  <label
                    key={idx}
                    className={`option-item ${isSelected ? "selected" : ""}`}
                  >
                    <input
                      type={inputType}
                      name={`question-${currentQuestion.id}`}
                      checked={isSelected}
                      onChange={() => handleSelectOption(idx)}
                    />
                    <span className="option-label">
                      {renderInlineText(option)}
                    </span>
                  </label>
                );
              })}
            </div>

            {currentQuestion.hint && (
              <div className="hint-section">
                <button
                  type="button"
                  className={`hint-card-btn ${showHint ? "is-open" : ""}`}
                  onClick={() => setShowHint((prev) => !prev)}
                  aria-expanded={showHint}
                >
                  <div className="hint-card-inner">
                    <Lightbulb size={20} strokeWidth={2.2} className="hint-bulb-icon" />
                    <div className="hint-card-text">
                      <span className="hint-card-title">Yordam (Hint)</span>
                      {showHint && (
                        <p className="hint-card-desc">
                          {renderInlineText(currentQuestion.hint)}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              </div>
            )}

            <div className="question-nav-actions">
              <button
                type="button"
                className="btn-runner-prev"
                onClick={() => goToQuestion(currentIndex - 1)}
                disabled={currentIndex === 0}
              >
                <ArrowLeft size={16} strokeWidth={2.2} />
                <span>Oldingi</span>
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  type="button"
                  className="btn-runner-next"
                  onClick={() => goToQuestion(currentIndex + 1)}
                >
                  <span>Keyingi</span>
                  <ArrowRight size={16} strokeWidth={2.3} />
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-runner-finish-inline"
                  onClick={handleSubmit}
                >
                  <CheckCircle2 size={17} strokeWidth={2.3} />
                  <span>Testni yakunlash</span>
                </button>
              )}
            </div>
          </main>

          <aside className="question-grid-panel">
            <div className="grid-panel-header">
              <BarChart2 size={18} strokeWidth={2.4} className="grid-panel-icon" />
              <h3>Savollar xaritasi</h3>
            </div>

            <div className="question-grid">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = (answers[q.id] || []).length > 0;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => goToQuestion(idx)}
                    className={`grid-cell ${isCurrent ? "current" : ""} ${
                      isAnswered ? "answered" : ""
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="btn-finish-green"
              onClick={handleSubmit}
            >
              <CheckCircle2 size={18} strokeWidth={2.3} />
              <span>Testni yakunlash</span>
            </button>

            <div className="runner-info-callout">
              <Info size={18} strokeWidth={2.2} className="callout-info-icon" />
              <span>
                {currentQuestion.type === "multiple"
                  ? "Ushbu savol uchun bir nechta javob tanlash mumkin!"
                  : "Har bir savol uchun bitta javob tanlang!"}
              </span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
