import { useState } from "react";
import Icon from "@/components/ui/icon";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Answer {
  id: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  emoji: string;
  answers: Answer[];
}

type AppMode = "play" | "edit";

// ─── Default data ─────────────────────────────────────────────────────────────

const EMOJI_OPTIONS = [
  "💕","🌸","✨","💖","🎉","🦋","💫","🌺","👰","🥂","💍","🎀","🍰","💅","🌷","🎊"
];

const DEFAULT_QUESTIONS: Question[] = [
  {
    id: "q1",
    text: "Как вы познакомились с невестой?",
    emoji: "👯‍♀️",
    answers: [
      { id: "a1", text: "В школе" },
      { id: "a2", text: "В университете" },
      { id: "a3", text: "На работе" },
      { id: "a4", text: "Через друзей" },
      { id: "a5", text: "В интернете" },
    ],
  },
  {
    id: "q2",
    text: "Куда невеста мечтает поехать?",
    emoji: "✈️",
    answers: [
      { id: "a1", text: "Мальдивы" },
      { id: "a2", text: "Париж" },
      { id: "a3", text: "Италия" },
      { id: "a4", text: "Таиланд" },
      { id: "a5", text: "Нью-Йорк" },
    ],
  },
];

const CONFETTI_COLORS = ["#FF6EB4","#C084FC","#FBBF24","#4ADE80","#38BDF8","#FF6B6B","#818CF8"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 8);

const makeAnswer = (text = ""): Answer => ({ id: uid(), text });

const makeQuestion = (): Question => ({
  id: uid(),
  text: "",
  emoji: "💕",
  answers: Array.from({ length: 5 }, () => makeAnswer()),
});

// ─── Confetti ─────────────────────────────────────────────────────────────────

interface ConfettiPiece { id: number; x: number; color: string; size: number; dur: number; delay: number; circle: boolean; }

function useConfetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const spawn = () => {
    const ps: ConfettiPiece[] = Array.from({ length: 70 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: Math.random() * 10 + 6,
      dur: Math.random() * 2 + 2,
      delay: Math.random() * 1.5,
      circle: Math.random() > 0.5,
    }));
    setPieces(ps);
    setTimeout(() => setPieces([]), 5000);
  };
  return { pieces, spawn };
}

// ─── PLAY mode ────────────────────────────────────────────────────────────────

function PlayMode({ questions, onEdit }: { questions: Question[]; onEdit: () => void }) {
  const [current, setCurrent] = useState(0);
  const [openAnswer, setOpenAnswer] = useState<string | null>(null);
  const [chosen, setChosen] = useState<string | null>(null);
  const [phase, setPhase] = useState<"playing" | "done">("playing");
  const [cardKey, setCardKey] = useState(0);
  const { pieces, spawn } = useConfetti();

  const q = questions[current];
  const progress = (current / questions.length) * 100;

  const handleChoose = (aId: string) => {
    if (chosen) return;
    setChosen(aId);
    setOpenAnswer(aId);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      setChosen(null);
      setOpenAnswer(null);
      setCardKey((k) => k + 1);
    } else {
      spawn();
      setPhase("done");
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setChosen(null);
    setOpenAnswer(null);
    setPhase("playing");
    setCardKey(0);
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 quiz-bg">
        <div className="quiz-card p-10 text-center animate-bounce-in max-w-md w-full">
          <div className="text-6xl mb-4">🙈</div>
          <h2 className="text-2xl font-extrabold text-purple-900 mb-4">Вопросов пока нет!</h2>
          <p className="text-purple-500 font-semibold mb-6">Добавь вопросы в режиме редактора</p>
          <button className="cta-btn w-full" onClick={onEdit}>✏️ Открыть редактор</button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-bg">
      {/* Confetti */}
      {pieces.map((c) => (
        <div key={c.id} className="confetti-piece" style={{
          left: `${c.x}%`, top: "-20px",
          width: `${c.size}px`, height: `${c.size}px`,
          background: c.color,
          borderRadius: c.circle ? "50%" : "2px",
          animationDuration: `${c.dur}s`,
          animationDelay: `${c.delay}s`,
        }} />
      ))}

      {/* Bg decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {["💕","✨","🌸","💫","🎀"].map((em, i) => (
          <div key={i} className="absolute select-none opacity-20"
            style={{
              top: `${[10,20,70,80,45][i]}%`,
              left: `${[5,88,3,92,50][i]}%`,
              fontSize: `${[40,30,50,35,45][i]}px`,
              animation: `wiggle ${2+i*0.4}s ease-in-out infinite`,
              animationDelay: `${i*0.3}s`,
            }}>{em}</div>
        ))}
      </div>

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-lg">

          {/* Edit button */}
          <div className="flex justify-end mb-3">
            <button onClick={onEdit}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold text-sm px-4 py-2 rounded-full backdrop-blur transition-all">
              <Icon name="Pencil" size={14} />
              Редактировать
            </button>
          </div>

          {/* DONE screen */}
          {phase === "done" && (
            <div className="quiz-card p-8 text-center animate-bounce-in">
              <div className="text-6xl mb-4 inline-block animate-star-spin">🏆</div>
              <h2 style={{ fontFamily:"Pacifico,cursive", background:"linear-gradient(135deg,#FF2D92,#A855F7)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", fontSize:"2rem" }}
                className="mb-3">Викторина окончена!</h2>
              <p className="text-purple-600 font-semibold text-lg mb-8">
                Вы прошли все {questions.length} вопросов 🎉
              </p>
              <button className="cta-btn w-full mb-3" onClick={handleRestart}>🔄 Пройти ещё раз</button>
              <button onClick={onEdit}
                className="w-full py-3 rounded-2xl border-2 border-purple-200 text-purple-500 font-bold hover:border-purple-400 transition-all">
                ✏️ Изменить вопросы
              </button>
            </div>
          )}

          {/* PLAYING */}
          {phase === "playing" && (
            <div>
              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white text-sm font-extrabold opacity-95">
                    Вопрос {current + 1} из {questions.length}
                  </span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>

              {/* Card */}
              <div key={cardKey} className="quiz-card p-6 animate-pop-in">
                <div className="text-5xl text-center mb-3">{q.emoji}</div>
                <h2 className="text-xl font-extrabold text-purple-900 text-center mb-6 leading-snug">
                  {q.text || "Вопрос без текста"}
                </h2>

                {/* Accordion answers */}
                <div className="flex flex-col gap-2 mb-5">
                  {q.answers.filter(a => a.text.trim()).map((ans, idx) => {
                    const isOpen = openAnswer === ans.id;
                    const isChosen = chosen === ans.id;
                    const labels = ["А","Б","В","Г","Д"];

                    return (
                      <div key={ans.id}
                        className="rounded-2xl overflow-hidden transition-all"
                        style={{
                          border: isChosen ? "2.5px solid #A855F7" : "2.5px solid #e9d5ff",
                          background: isChosen ? "linear-gradient(135deg,#f3e8ff,#fce7f3)" : "white",
                          boxShadow: isChosen ? "0 6px 20px rgba(168,85,247,0.2)" : "none",
                        }}>
                        {/* Нажатие выбирает ответ и раскрывает его */}
                        <button
                          className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all"
                          style={{ fontFamily:"Nunito,sans-serif" }}
                          disabled={!!chosen}
                          onClick={() => handleChoose(ans.id)}
                        >
                          <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 font-extrabold"
                            style={{
                              background: isChosen ? "#A855F7" : "#f3e8ff",
                              color: isChosen ? "white" : "#7c3aed",
                            }}>
                            {isChosen ? "✓" : labels[idx]}
                          </span>
                          <span className="flex-1 font-bold text-purple-400 tracking-widest">
                            {isOpen ? "" : "..."}
                          </span>
                          <span className="text-purple-400 transition-transform duration-300"
                            style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", display:"flex" }}>
                            <Icon name="ChevronDown" size={18} />
                          </span>
                        </button>

                        {/* Раскрывающийся блок с текстом ответа */}
                        <div style={{
                          maxHeight: isOpen ? "120px" : "0",
                          overflow: "hidden",
                          transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)",
                        }}>
                          <div className="px-4 pb-4 pt-1">
                            <div className="rounded-xl p-3 flex items-center gap-3"
                              style={{ background: "linear-gradient(135deg,#fdf4ff,#fce7f3)" }}>
                              <span className="text-2xl">{["💕","🌟","✨","🦋","🌸"][idx]}</span>
                              <p className="text-purple-800 font-bold text-base">
                                {ans.text}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Next button — appears after choosing */}
                {chosen && (
                  <button className="cta-btn w-full animate-pop-in" onClick={handleNext}>
                    {current < questions.length - 1 ? "Следующий вопрос →" : "Завершить викторину 🎉"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── EDIT mode ────────────────────────────────────────────────────────────────

function EditMode({ questions, onChange, onDone }: {
  questions: Question[];
  onChange: (qs: Question[]) => void;
  onDone: () => void;
}) {
  const [emojiPicker, setEmojiPicker] = useState<string | null>(null);

  const updateQuestion = (qId: string, patch: Partial<Question>) => {
    onChange(questions.map(q => q.id === qId ? { ...q, ...patch } : q));
  };

  const updateAnswer = (qId: string, aId: string, text: string) => {
    onChange(questions.map(q => q.id === qId
      ? { ...q, answers: q.answers.map(a => a.id === aId ? { ...a, text } : a) }
      : q
    ));
  };

  const addQuestion = () => {
    onChange([...questions, makeQuestion()]);
  };

  const removeQuestion = (qId: string) => {
    onChange(questions.filter(q => q.id !== qId));
  };

  return (
    <div className="quiz-bg min-h-screen">
      <div className="min-h-screen p-4">
        <div className="max-w-lg mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-6 pt-2">
            <div>
              <h1 className="text-white font-extrabold text-2xl" style={{ fontFamily:"Pacifico,cursive" }}>
                ✏️ Редактор
              </h1>
              <p className="text-white/70 text-sm font-semibold mt-0.5">Настрой свою викторину</p>
            </div>
            <button onClick={onDone} className="cta-btn" style={{ padding:"10px 20px", fontSize:"14px" }}>
              ▶ Запустить
            </button>
          </div>

          {/* Questions list */}
          <div className="flex flex-col gap-4">
            {questions.map((q, qi) => (
              <div key={q.id} className="quiz-card p-5 animate-fade-in">
                {/* Question header */}
                <div className="flex items-start gap-3 mb-4">
                  {/* Emoji picker */}
                  <div className="relative flex-shrink-0">
                    <button
                      onClick={() => setEmojiPicker(emojiPicker === q.id ? null : q.id)}
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl hover:scale-110 transition-all"
                      style={{ background:"linear-gradient(135deg,#f3e8ff,#fce7f3)", border:"2px solid #e9d5ff" }}
                    >
                      {q.emoji}
                    </button>
                    {emojiPicker === q.id && (
                      <div className="absolute top-14 left-0 z-50 quiz-card p-2 grid grid-cols-8 gap-1 w-64 animate-pop-in">
                        {EMOJI_OPTIONS.map(em => (
                          <button key={em}
                            onClick={() => { updateQuestion(q.id, { emoji: em }); setEmojiPicker(null); }}
                            className="text-xl p-1 rounded-lg hover:bg-purple-100 transition-all text-center">
                            {em}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wide">
                        Вопрос {qi + 1}
                      </span>
                    </div>
                    <input
                      className="w-full rounded-xl px-3 py-2 text-purple-900 font-bold text-base outline-none"
                      style={{ border:"2px solid #e9d5ff", fontFamily:"Nunito,sans-serif", background:"#faf5ff" }}
                      placeholder="Введи вопрос..."
                      value={q.text}
                      onChange={e => updateQuestion(q.id, { text: e.target.value })}
                    />
                  </div>

                  <button onClick={() => removeQuestion(q.id)}
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 transition-all mt-6">
                    <Icon name="Trash2" size={16} />
                  </button>
                </div>

                {/* Answers */}
                <div className="flex flex-col gap-2">
                  {q.answers.map((ans, ai) => {
                    const labels = ["А","Б","В","Г","Д"];
                    return (
                      <div key={ans.id} className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0"
                          style={{ background:"#f3e8ff", color:"#7c3aed" }}>
                          {labels[ai]}
                        </span>
                        <input
                          className="flex-1 rounded-xl px-3 py-2 text-purple-900 font-semibold text-sm outline-none"
                          style={{ border:"2px solid #e9d5ff", fontFamily:"Nunito,sans-serif", background:"#faf5ff" }}
                          placeholder={`Вариант ${labels[ai]}...`}
                          value={ans.text}
                          onChange={e => updateAnswer(q.id, ans.id, e.target.value)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Add question */}
          <button onClick={addQuestion}
            className="w-full mt-4 py-4 rounded-2xl font-extrabold text-white text-base flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            style={{ background:"rgba(255,255,255,0.2)", border:"2px dashed rgba(255,255,255,0.5)", backdropFilter:"blur(10px)" }}>
            <Icon name="Plus" size={20} />
            Добавить вопрос
          </button>

          {/* Launch */}
          <button className="cta-btn w-full mt-4 mb-8 text-lg" onClick={onDone}>
            ▶ Запустить викторину
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function Index() {
  const [mode, setMode] = useState<AppMode>("edit");
  const [questions, setQuestions] = useState<Question[]>(DEFAULT_QUESTIONS);

  return mode === "edit"
    ? <EditMode questions={questions} onChange={setQuestions} onDone={() => setMode("play")} />
    : <PlayMode questions={questions} onEdit={() => setMode("edit")} />;
}