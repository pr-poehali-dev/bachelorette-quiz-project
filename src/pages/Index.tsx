import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const QUESTIONS = [
  {
    id: 1,
    question: "Как вы познакомились с невестой?",
    emoji: "👯‍♀️",
    answers: [
      "В школе / университете",
      "На работе",
      "Через общих друзей",
      "В интернете",
    ],
    hint: "Подсказка: спросите у именинницы! 😉",
  },
  {
    id: 2,
    question: "Какое любимое блюдо невесты?",
    emoji: "🍕",
    answers: ["Пицца", "Суши", "Паста", "Роллы"],
    hint: "Подсказка: она может есть это каждый день!",
  },
  {
    id: 3,
    question: "Куда невеста мечтает поехать в медовый месяц?",
    emoji: "✈️",
    answers: ["Мальдивы", "Париж", "Италия", "Таиланд"],
    hint: "Подсказка: она уже смотрела туры туда 😄",
  },
  {
    id: 4,
    question: "Каким словом лучше всего описать невесту?",
    emoji: "💖",
    answers: [
      "Весёлая и яркая",
      "Нежная и романтичная",
      "Смелая и решительная",
      "Мудрая и спокойная",
    ],
    hint: "Подсказка: спросите у жениха — он точно знает!",
  },
  {
    id: 5,
    question: "Сколько лет вы знакомы с невестой?",
    emoji: "📅",
    answers: ["Меньше года", "1–3 года", "3–7 лет", "Больше 7 лет"],
    hint: "Подсказка: вспомните, как вы впервые встретились!",
  },
  {
    id: 6,
    question: "Какой фильм невеста готова смотреть бесконечно?",
    emoji: "🎬",
    answers: [
      "Любовная комедия",
      "Фэнтези / приключения",
      "Триллер",
      "Анимация / мультики",
    ],
    hint: "Подсказка: она наверняка цитирует строчки из него!",
  },
  {
    id: 7,
    question: "Что невеста делает в первую очередь утром?",
    emoji: "☀️",
    answers: [
      "Проверяет телефон",
      "Пьёт кофе",
      "Занимается спортом",
      "Долго нежится в кровати",
    ],
    hint: "Подсказка: понаблюдайте за ней утром на девичнике!",
  },
  {
    id: 8,
    question: "Какое увлечение у невесты?",
    emoji: "🎨",
    answers: [
      "Спорт и активный отдых",
      "Творчество и искусство",
      "Путешествия",
      "Кулинария",
    ],
    hint: "Подсказка: это то, чем она занимается для души!",
  },
];

const RESULT_TIERS = [
  {
    min: 7,
    max: 8,
    tier: "S",
    title: "Лучшая подруга всех времён! 👑",
    desc: "Ты знаешь её лучше, чем она сама знает себя! Ваша дружба — настоящее сокровище. Поздравляем невесту с такой потрясающей подругой!",
    emoji: "🏆",
    color: "result-S",
  },
  {
    min: 5,
    max: 6,
    tier: "A",
    title: "Настоящая близкая подруга! 💜",
    desc: "Ты очень хорошо знаешь невесту! Вы столько всего пережили вместе, и это чувствуется в каждом ответе.",
    emoji: "💎",
    color: "result-A",
  },
  {
    min: 3,
    max: 4,
    tier: "B",
    title: "Хорошая подруга! 💙",
    desc: "Вы дружите, но у вас ещё столько всего впереди! Этот девичник — отличный повод узнать друг друга ещё лучше.",
    emoji: "🌟",
    color: "result-B",
  },
  {
    min: 0,
    max: 2,
    tier: "C",
    title: "Новая подруга с большим потенциалом! 🧡",
    desc: "Ничего страшного — вы только начинаете дружить! Впереди ещё так много интересных историй и совместных приключений!",
    emoji: "🌸",
    color: "result-C",
  },
];

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  size: number;
  duration: number;
  delay: number;
  isCircle: boolean;
}

interface FloatingEmoji {
  id: number;
  emoji: string;
  x: number;
}

type GameState = "start" | "playing" | "results";

export default function Index() {
  const [gameState, setGameState] = useState<GameState>("start");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [cardKey, setCardKey] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const EMOJIS_LIST = ["💕", "🌸", "✨", "💖", "🎉", "🦋", "💫", "🌺"];
  const CONFETTI_COLORS = [
    "#FF6EB4", "#C084FC", "#FBBF24", "#4ADE80", "#38BDF8", "#FF6B6B", "#818CF8",
  ];

  const spawnConfetti = () => {
    const pieces: ConfettiPiece[] = Array.from({ length: 70 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: Math.random() * 10 + 6,
      duration: Math.random() * 2 + 2,
      delay: Math.random() * 1.5,
      isCircle: Math.random() > 0.5,
    }));
    setConfetti(pieces);
    setTimeout(() => setConfetti([]), 5000);
  };

  const spawnEmoji = () => {
    const fe: FloatingEmoji = {
      id: Date.now(),
      emoji: EMOJIS_LIST[Math.floor(Math.random() * EMOJIS_LIST.length)],
      x: Math.random() * 80 + 10,
    };
    setFloatingEmojis((prev) => [...prev, fe]);
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((e) => e.id !== fe.id));
    }, 4000);
  };

  const handleStart = () => {
    setGameState("playing");
    setCurrentQuestion(0);
    setScore(0);
    setHintsLeft(3);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowHint(false);
    setCardKey((k) => k + 1);
  };

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelectedAnswer(idx);
    setIsAnswered(true);
    setShowHint(false);
    setScore((s) => s + 1);
    spawnEmoji();

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion((q) => q + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setShowHint(false);
        setCardKey((k) => k + 1);
      } else {
        spawnConfetti();
        setGameState("results");
      }
    }, 900);
  };

  const handleHint = () => {
    if (hintsLeft > 0 && !showHint && !isAnswered) {
      setShowHint(true);
      setHintsLeft((h) => h - 1);
    }
  };

  const handleRestart = () => {
    setGameState("start");
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowHint(false);
    setHintsLeft(3);
    setIsAnswered(false);
  };

  const getResult = (finalScore: number) => {
    return (
      RESULT_TIERS.find((t) => finalScore >= t.min && finalScore <= t.max) ||
      RESULT_TIERS[3]
    );
  };

  const progress = (currentQuestion / QUESTIONS.length) * 100;
  const q = QUESTIONS[currentQuestion];

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="quiz-bg">
      {/* Confetti */}
      {confetti.map((c) => (
        <div
          key={c.id}
          className="confetti-piece"
          style={{
            left: `${c.x}%`,
            top: "-20px",
            width: `${c.size}px`,
            height: `${c.size}px`,
            background: c.color,
            borderRadius: c.isCircle ? "50%" : "2px",
            animationDuration: `${c.duration}s`,
            animationDelay: `${c.delay}s`,
          }}
        />
      ))}

      {/* Floating emojis */}
      {floatingEmojis.map((e) => (
        <div
          key={e.id}
          className="floating-emoji"
          style={{ left: `${e.x}%`, bottom: "0", animationDuration: "3s" }}
        >
          {e.emoji}
        </div>
      ))}

      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {(["💕", "✨", "🌸", "💫", "🎀"] as const).map((em, i) => (
          <div
            key={i}
            className="absolute select-none opacity-20"
            style={{
              top: `${[10, 20, 70, 80, 45][i]}%`,
              left: `${[5, 88, 3, 92, 50][i]}%`,
              fontSize: `${[40, 30, 50, 35, 45][i]}px`,
              animation: `wiggle ${2 + i * 0.4}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          >
            {em}
          </div>
        ))}
      </div>

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-lg">

          {/* ─── START SCREEN ─── */}
          {gameState === "start" && (
            <div className="quiz-card p-8 text-center animate-bounce-in">
              <div className="text-7xl mb-4 inline-block animate-wiggle">👰</div>
              <h1
                style={{
                  fontFamily: "Pacifico, cursive",
                  background: "linear-gradient(135deg, #FF2D92, #A855F7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: "2.5rem",
                  lineHeight: 1.2,
                  marginBottom: "6px",
                }}
              >
                Викторина
              </h1>
              <h2
                style={{
                  fontFamily: "Pacifico, cursive",
                  background: "linear-gradient(135deg, #A855F7, #38BDF8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: "1.6rem",
                  marginBottom: "20px",
                }}
              >
                для девичника 💕
              </h2>
              <p
                className="text-purple-600 text-lg mb-8 leading-relaxed"
                style={{ fontWeight: 700 }}
              >
                Насколько хорошо ты знаешь невесту?
                <br />
                Пройди {QUESTIONS.length} вопросов и узнай!
              </p>

              <div className="flex justify-center gap-6 mb-8">
                {[
                  { icon: "HelpCircle", label: `${QUESTIONS.length} вопросов`, color: "#A855F7" },
                  { icon: "Lightbulb", label: "3 подсказки", color: "#FBBF24" },
                  { icon: "Trophy", label: "4 результата", color: "#FF6EB4" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-2">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        background: `${item.color}20`,
                        border: `2px solid ${item.color}60`,
                      }}
                    >
                      <Icon name={item.icon as "HelpCircle"} size={22} style={{ color: item.color }} />
                    </div>
                    <span
                      className="text-xs text-purple-500"
                      style={{ fontWeight: 700 }}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <button className="cta-btn w-full text-xl" onClick={handleStart}>
                🚀 Начать игру!
              </button>
            </div>
          )}

          {/* ─── PLAYING ─── */}
          {gameState === "playing" && (
            <div>
              {/* Progress header */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span
                    className="text-white text-sm"
                    style={{ fontWeight: 800, opacity: 0.95 }}
                  >
                    Вопрос {currentQuestion + 1} из {QUESTIONS.length}
                  </span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: hintsLeft }).map((_, i) => (
                      <span key={i} className="text-base">💡</span>
                    ))}
                    <span
                      className="text-white text-xs ml-1"
                      style={{ fontWeight: 700, opacity: 0.85 }}
                    >
                      подсказки
                    </span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>

              {/* Question card */}
              <div key={cardKey} className="quiz-card p-6 animate-pop-in">
                <div className="text-5xl text-center mb-4">{q.emoji}</div>
                <h2
                  className="text-xl text-purple-900 text-center mb-6 leading-snug"
                  style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800 }}
                >
                  {q.question}
                </h2>

                {/* Hint */}
                {showHint && (
                  <div className="hint-box mb-4 flex items-start gap-2">
                    <span className="text-lg flex-shrink-0">💡</span>
                    <span>{q.hint}</span>
                  </div>
                )}

                {/* Answers */}
                <div className="flex flex-col gap-3 mb-5">
                  {q.answers.map((ans, idx) => {
                    let cls = "answer-btn";
                    if (isAnswered && idx === selectedAnswer) cls += " correct";
                    else if (!isAnswered && selectedAnswer === idx) cls += " selected";
                    return (
                      <button
                        key={idx}
                        className={cls}
                        onClick={() => handleAnswer(idx)}
                        disabled={isAnswered}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                            style={{
                              fontWeight: 800,
                              background:
                                isAnswered && idx === selectedAnswer
                                  ? "rgba(255,255,255,0.3)"
                                  : "#f3e8ff",
                              color:
                                isAnswered && idx === selectedAnswer
                                  ? "white"
                                  : "#7c3aed",
                            }}
                          >
                            {["А", "Б", "В", "Г"][idx]}
                          </span>
                          {ans}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Hint button */}
                <div className="flex justify-center">
                  <button
                    className="hint-btn"
                    onClick={handleHint}
                    disabled={hintsLeft === 0 || showHint || isAnswered}
                  >
                    <Icon name="Lightbulb" size={15} />
                    {hintsLeft > 0
                      ? `Подсказка (осталось: ${hintsLeft})`
                      : "Подсказки кончились 😅"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── RESULTS ─── */}
          {gameState === "results" && (() => {
            const result = getResult(score);
            return (
              <div className="quiz-card p-8 text-center animate-bounce-in">
                <div
                  className="text-6xl mb-4 inline-block animate-star-spin"
                >
                  {result.emoji}
                </div>
                <div
                  className={`inline-block px-6 py-2 rounded-full text-white text-2xl mb-5 ${result.color}`}
                  style={{ fontFamily: "Pacifico, cursive", fontWeight: 900 }}
                >
                  {score} / {QUESTIONS.length}
                </div>
                <h2
                  className="text-2xl text-purple-900 mb-3 leading-tight"
                  style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900 }}
                >
                  {result.title}
                </h2>
                <p
                  className="text-purple-600 mb-8 leading-relaxed text-base"
                  style={{ fontWeight: 600 }}
                >
                  {result.desc}
                </p>

                {/* Score bar */}
                <div className="mb-8">
                  <div
                    className="flex justify-between text-sm text-purple-400 mb-2"
                    style={{ fontWeight: 700 }}
                  >
                    <span>Твой результат</span>
                    <span>{Math.round((score / QUESTIONS.length) * 100)}%</span>
                  </div>
                  <div className="progress-bar bg-purple-100" style={{ height: "12px" }}>
                    <div
                      className="progress-fill"
                      style={{
                        width: `${(score / QUESTIONS.length) * 100}%`,
                        height: "12px",
                      }}
                    />
                  </div>
                </div>

                {/* Tier badges */}
                <div className="flex justify-center gap-3 mb-8">
                  {[...RESULT_TIERS].reverse().map((t) => (
                    <div
                      key={t.tier}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm ${t.color}`}
                      style={{
                        fontWeight: 900,
                        fontFamily: "Nunito, sans-serif",
                        opacity: result.tier === t.tier ? 1 : 0.3,
                        transform: result.tier === t.tier ? "scale(1.25)" : "scale(1)",
                        transition: "all 0.3s",
                      }}
                    >
                      {t.tier}
                    </div>
                  ))}
                </div>

                <button className="cta-btn w-full text-lg" onClick={handleRestart}>
                  🔄 Пройти ещё раз
                </button>
              </div>
            );
          })()}

        </div>
      </div>
    </div>
  );
}
