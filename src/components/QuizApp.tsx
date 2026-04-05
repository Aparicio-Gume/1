import React from "react";
import { useState, useEffect, useRef } from "react";
import bandeira from "@/assets/bandeira.jpeg";
import cocaCola from "@/assets/coca-cola.jpg";
import emola from "@/assets/emola.jpeg";
import netflixLogo from "@/assets/netflix.jpeg";
import testimonial1 from "@/assets/testimonial1.jpg";
import testimonial2 from "@/assets/testimonial2.jpg";
import testimonial3 from "@/assets/testimonial3.jpg";
import testimonial4 from "@/assets/testimonial4.jpg";

type Step = "landing" | "quiz" | "completion" | "testimonials";

interface Question {
  id: number;
  image: string;
  question: string;
  options: string[];
  correct: number;
  reward: number;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    image: cocaCola,
    question: "Qual é a marca do refresco?",
    options: ["Coca-Cola", "Sprite", "Fanta", "Compal"],
    correct: 0,
    reward: 200,
  },
  {
    id: 2,
    image: bandeira,
    question: "Qual é a capital de Moçambique?",
    options: ["Beira", "Nampula", "Maputo", "Manica"],
    correct: 2,
    reward: 200,
  },
  {
    id: 3,
    image: bandeira,
    question: "Qual é o presidente actual de Moçambique?",
    options: [
      "Venâncio Mondlane",
      "Samora Machel",
      "Daniel Chapo",
      "Armando Guebuza",
    ],
    correct: 2,
    reward: 200,
  },
  {
    id: 4,
    image: emola,
    question: "Qual é o método de pagamento que você mais utiliza?",
    options: ["M-Pesa", "E-Mola"],
    correct: -1,
    reward: 200,
  },
];

const INITIAL_BALANCE = 50;

const cardStyle: React.CSSProperties = {
  background: "hsl(0 0% 10%)",
  border: "2px solid hsl(0 0% 22%)",
  borderRadius: "0.4rem",
  padding: "1.5rem",
};

const rectBorderBox = (borderColor = "hsl(0 0% 28%)"): React.CSSProperties => ({
  border: `2px solid ${borderColor}`,
  borderRadius: "0.4rem",
  padding: "0.85rem 1rem",
  background: "hsl(0 0% 8%)",
});

function BalanceBadge({ balance, pop }: { balance: number; pop: boolean }) {
  return (
    <div className={`balance-badge fixed top-4 right-4 z-50 ${pop ? "balance-pop" : ""}`}>
      <span>💵</span>
      <span>${balance.toFixed(2)}</span>
    </div>
  );
}

function RadioCircle({ selected }: { selected: boolean }) {
  return (
    <span
      style={{
        width: 20,
        height: 20,
        borderRadius: "0.2rem",
        border: `2px solid ${selected ? "hsl(0 85% 45%)" : "hsl(0 0% 50%)"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {selected && (
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "0.1rem",
            background: "hsl(0 85% 45%)",
          }}
        />
      )}
    </span>
  );
}

export default function QuizApp() {
  const [step, setStep] = useState<Step>("landing");
  const [currentQ, setCurrentQ] = useState(0);
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [balancePop, setBalancePop] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastGain, setToastGain] = useState(0);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/money-sound.mpeg");
  }, []);

  useEffect(() => {
    if (!document.querySelector('script[src*="smartplayer-wc"]')) {
      const s = document.createElement("script");
      s.src = "https://scripts.converteai.net/lib/js/smartplayer-wc/v4/sdk.js";
      s.async = true;
      document.head.appendChild(s);
    }
  }, []);

  const playMoneySound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const triggerBalanceIncrease = (amount: number) => {
    setBalance((prev) => prev + amount);
    setBalancePop(true);
    setToastGain(amount);
    setShowToast(true);
    playMoneySound();
    setTimeout(() => setBalancePop(false), 500);
    setTimeout(() => setShowToast(false), 2500);
  };

  const goNext = () => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ((prev) => prev + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setStep("completion");
    }
  };

  const handleOptionSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const q = QUESTIONS[currentQ];
    triggerBalanceIncrease(q.reward);
    setTimeout(() => {
      goNext();
    }, 1800);
  };

  const handleWithdraw = () => {
    if (!paymentMethod || !name || phone.length < 9) return;
    setShowWithdrawModal(true);
    // Auto-advance to testimonials after 3 seconds
    setTimeout(() => {
      setShowWithdrawModal(false);
      setStep("testimonials");
    }, 3000);
  };

  const q = QUESTIONS[currentQ];
  const progressPct = (currentQ / QUESTIONS.length) * 100;

  // ─── LANDING ──────────────────────────────────────────────────────────────
  if (step === "landing") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "hsl(0 0% 7%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem",
        }}
      >
        <BalanceBadge balance={INITIAL_BALANCE} pop={false} />

        <div style={{ ...cardStyle, maxWidth: 420, width: "100%" }}>
          {/* Netflix logo image */}
          <div
            style={{
              ...rectBorderBox("hsl(0 85% 45%)"),
              textAlign: "center",
              marginBottom: "1.5rem",
              background: "hsl(0 0% 0%)",
              padding: 0,
              overflow: "hidden",
            }}
          >
            <img
              src={netflixLogo}
              alt="Netflix"
              style={{ width: "100%", height: 140, objectFit: "contain", display: "block" }}
            />
          </div>

          <h1
            style={{
              fontSize: "1.9rem",
              fontWeight: 800,
              textAlign: "center",
              marginBottom: "0.75rem",
            }}
          >
            Parabéns! 🎁
          </h1>

          <p
            style={{
              color: "hsl(0 0% 65%)",
              textAlign: "center",
              marginBottom: "1.25rem",
              fontSize: "0.95rem",
              lineHeight: 1.6,
            }}
          >
            Você foi selecionado para o novo sistema de recompensas do Netflix Rewards.
          </p>

          {/* Already earned box */}
          <div
            style={{
              ...rectBorderBox("hsl(0 85% 45%)"),
              textAlign: "center",
              marginBottom: "1rem",
              background: "hsl(0 85% 45% / 0.08)",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: "1rem" }}>
              Você já ganhou $50! 🤑
            </span>
          </div>

          {/* Gain info box */}
          <div
            style={{
              ...rectBorderBox(),
              textAlign: "center",
              marginBottom: "0.75rem",
              color: "hsl(0 0% 80%)",
              fontSize: "0.9rem",
              lineHeight: 1.5,
            }}
          >
            Ganhe +$200 por cada pergunta respondida!
          </div>

          <p
            style={{
              textAlign: "center",
              color: "hsl(0 0% 55%)",
              fontSize: "0.85rem",
              marginBottom: "1.25rem",
            }}
          >
            Responda mais 4 perguntas e faça o seu primeiro levantamento!
          </p>

          <button className="btn-red" onClick={() => setStep("quiz")}>
            Clique aqui para começar.
          </button>
        </div>
      </div>
    );
  }

  // ─── QUIZ ─────────────────────────────────────────────────────────────────
  if (step === "quiz") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "hsl(0 0% 7%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "1.5rem",
          paddingTop: "5rem",
        }}
      >
        <BalanceBadge balance={balance} pop={balancePop} />

        {showToast && (
          <div className="balance-toast">
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <span style={{ fontSize: "1.2rem" }}>💰</span>
              <div>
                <div style={{ color: "hsl(43 96% 56%)", fontWeight: 700, fontSize: "0.95rem" }}>
                  +${toastGain}
                </div>
                <div style={{ color: "hsl(0 0% 70%)", fontSize: "0.8rem" }}>
                  Saldo: ${balance.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ maxWidth: 420, width: "100%" }}>
          <div style={cardStyle}>
            {/* Progress */}
            <p
              style={{
                color: "hsl(0 0% 55%)",
                textAlign: "center",
                fontSize: "0.9rem",
                marginBottom: "0.75rem",
              }}
            >
              Pergunta {currentQ + 1} de {QUESTIONS.length}
            </p>

            {/* Progress bar */}
            <div
              style={{
                background: "hsl(0 0% 22%)",
                height: 4,
                borderRadius: "0.2rem",
                marginBottom: "1.25rem",
                border: "1px solid hsl(0 0% 18%)",
              }}
            >
              <div
                className="progress-bar-fill"
                style={{
                  width: `${answered ? ((currentQ + 1) / QUESTIONS.length) * 100 : progressPct}%`,
                }}
              />
            </div>

            {/* Question image */}
            <div
              style={{
                borderRadius: "0.4rem",
                overflow: "hidden",
                marginBottom: "1.25rem",
                border: "2px solid hsl(0 0% 22%)",
              }}
            >
              <img
                src={q.image}
                alt="Pergunta"
                style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
              />
            </div>

            {/* Question text */}
            <h2
              style={{
                fontSize: "1.4rem",
                fontWeight: 800,
                textAlign: "center",
                marginBottom: "1.25rem",
                lineHeight: 1.35,
              }}
            >
              {q.question}
            </h2>

            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {q.options.map((opt, idx) => {
                let cls = "option-btn";
                if (answered) {
                  if (q.correct === -1) {
                    if (idx === selected) cls += " correct";
                  } else {
                    if (idx === q.correct) cls += " correct";
                    else if (idx === selected && idx !== q.correct) cls += " wrong";
                  }
                } else if (idx === selected) {
                  cls += " selected";
                }

                return (
                  <button
                    key={idx}
                    className={cls}
                    onClick={() => handleOptionSelect(idx)}
                    disabled={answered}
                    style={{ borderRadius: "0.4rem" }}
                  >
                    <RadioCircle selected={selected === idx} />
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {answered && (
              <div
                style={{
                  marginTop: "1rem",
                  textAlign: "center",
                  color: "hsl(0 0% 55%)",
                  fontSize: "0.85rem",
                }}
              >
                A avançar...
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── COMPLETION ───────────────────────────────────────────────────────────
  if (step === "completion") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "hsl(0 0% 7%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "1.5rem",
          paddingTop: "4rem",
        }}
      >
        <BalanceBadge balance={balance} pop={false} />

        {/* Withdraw modal - auto closes */}
        {showWithdrawModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "hsl(0 0% 0% / 0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 200,
              padding: "1.5rem",
            }}
          >
            <div
              style={{
                background: "hsl(0 0% 10%)",
                border: "2px solid hsl(0 85% 45%)",
                borderRadius: "0.4rem",
                padding: "2rem 1.5rem",
                textAlign: "center",
                maxWidth: 360,
                width: "100%",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>✅</div>
              <h2 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: "1rem" }}>
                Levantamento Processando!
              </h2>
              <p style={{ color: "hsl(0 0% 70%)", lineHeight: 1.6, fontSize: "0.95rem" }}>
                O levantamento de{" "}
                <span style={{ color: "hsl(0 85% 55%)", fontWeight: 700 }}>
                  ${balance.toFixed(2)}
                </span>{" "}
                irá cair na sua conta depois de assistir este vídeo.
              </p>
              <p style={{ color: "hsl(0 0% 50%)", fontSize: "0.82rem", marginTop: "1rem" }}>
                A redirecionar automaticamente...
              </p>
            </div>
          </div>
        )}

        <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🎉</div>

        <h1 style={{ fontSize: "2rem", fontWeight: 800, textAlign: "center", marginBottom: "0.5rem" }}>
          Parabéns! 🎊
        </h1>
        <p style={{ color: "hsl(0 0% 60%)", textAlign: "center", marginBottom: "1.5rem" }}>
          Você completou todas as perguntas!
        </p>

        {/* Total earned */}
        <div
          style={{
            border: "2px solid hsl(0 85% 45%)",
            borderRadius: "0.4rem",
            padding: "1.25rem",
            textAlign: "center",
            width: "100%",
            maxWidth: 420,
            marginBottom: "1.75rem",
            background: "hsl(0 85% 10% / 0.4)",
          }}
        >
          <p style={{ color: "hsl(0 0% 55%)", marginBottom: "0.5rem" }}>Total ganho:</p>
          <p style={{ fontSize: "2.5rem", fontWeight: 800, color: "hsl(0 85% 65%)" }}>
            ${balance.toFixed(2)}
          </p>
        </div>

        {/* Payment form */}
        <div style={{ width: "100%", maxWidth: 420 }}>
          <h3 style={{ fontWeight: 700, marginBottom: "0.75rem", fontSize: "1rem" }}>
            Método de Pagamento
          </h3>

          {["M-Pesa", "E-Mola"].map((method) => (
            <button
              key={method}
              onClick={() => setPaymentMethod(method)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                width: "100%",
                background: paymentMethod === method ? "hsl(0 85% 45% / 0.12)" : "hsl(0 0% 8%)",
                border: `2px solid ${paymentMethod === method ? "hsl(0 85% 45%)" : "hsl(0 0% 28%)"}`,
                borderRadius: "0.4rem",
                padding: "0.85rem 1rem",
                color: "hsl(0 0% 95%)",
                fontSize: "1rem",
                cursor: "pointer",
                marginBottom: "0.6rem",
                textAlign: "left",
              }}
            >
              <RadioCircle selected={paymentMethod === method} />
              <span>{method}</span>
            </button>
          ))}

          <h3 style={{ fontWeight: 700, marginBottom: "0.75rem", marginTop: "1rem", fontSize: "1rem" }}>
            Nome Completo
          </h3>
          <input
            type="text"
            placeholder="O seu nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              background: "hsl(0 0% 8%)",
              border: "2px solid hsl(0 0% 28%)",
              borderRadius: "0.4rem",
              padding: "0.85rem 1rem",
              color: "hsl(0 0% 90%)",
              fontSize: "1rem",
              marginBottom: "1rem",
              outline: "none",
              boxSizing: "border-box",
            }}
          />

          <h3 style={{ fontWeight: 700, marginBottom: "0.75rem", fontSize: "1rem" }}>
            Número de Telefone
          </h3>
          <input
            type="tel"
            placeholder="8XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={9}
            style={{
              width: "100%",
              background: "hsl(0 0% 8%)",
              border: "2px solid hsl(0 0% 28%)",
              borderRadius: "0.4rem",
              padding: "0.85rem 1rem",
              color: "hsl(0 0% 90%)",
              fontSize: "1rem",
              marginBottom: "0.4rem",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          <p style={{ color: "hsl(0 0% 50%)", fontSize: "0.82rem", marginBottom: "1.25rem" }}>
            Digite 9 dígitos
          </p>

          <button
            className="btn-red"
            onClick={handleWithdraw}
            style={{
              opacity: paymentMethod && name && phone.length >= 9 ? 1 : 0.6,
              cursor: paymentMethod && name && phone.length >= 9 ? "pointer" : "not-allowed",
            }}
          >
            Levantar ${balance.toFixed(2)}
          </button>
        </div>
      </div>
    );
  }

  // ─── TESTIMONIALS (last page) ─────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "hsl(0 0% 7%)", padding: "1.5rem" }}>
      {/* Header */}
      <div style={{ ...cardStyle, marginBottom: "1.25rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.25rem" }}>
          <span style={{ color: "hsl(0 85% 45%)" }}>Netflix</span>{" "}
          <span style={{ color: "hsl(0 0% 90%)" }}>pay</span>
        </h1>
        <p style={{ fontWeight: 700, lineHeight: 1.5, marginBottom: "0.75rem" }}>
          Ainda vais a tempo de transformar o teu conhecimento em saldo real no mpesa/emola
        </p>
        <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>✅</div>
        <p style={{ color: "hsl(0 0% 65%)", fontSize: "0.9rem", lineHeight: 1.5 }}>
          Vê o vídeo abaixo e aprende como fazer isso passo a passo! ⬇️
        </p>
      </div>

{/* Video embed */}
      <div style={{ ...cardStyle, marginBottom: "1.5rem", padding: "0.75rem" }}>
        <div id="ifr_69bfbe6c0817c06e8a7b61b9_wrapper" style={{ margin: "0 auto", width: "100%" }}>
          <div style={{ position: "relative", paddingTop: "56.25%" }} id="ifr_69bfbe6c0817c06e8a7b61b9_aspect">
            <iframe
              frameBorder={0}
              allowFullScreen
              src="about:blank"
              id="ifr_69bfbe6c0817c06e8a7b61b9"
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius: "0.3rem" }}
              // Alterado para no-referrer para tentar contornar o bloqueio de domínio "perigoso"
              referrerPolicy="no-referrer"
              ref={(el) => {
                if (el && el.src === "about:blank") {
                  el.onload = null;
                  // Nova URL e ID fornecidos por você
                  const videoUrl = `https://scripts.converteai.net/441d2721-6f8b-4d47-9522-21d00977564f/players/69bfbe6c0817c06e8a7b61b9/v4/embed.html${window.location.search || "?"}&vl=${encodeURIComponent(window.location.href)}`;
                  el.src = videoUrl;
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Comments title */}
      <div style={{ ...cardStyle, marginBottom: "1rem", background: "hsl(0 0% 9%)" }}>
        <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "hsl(0 0% 80%)" }}>
          💬 Comentários sobre o Netflix Pay
        </h2>
      </div>

      {/* Testimonials */}
      {[
        {
          photo: testimonial1,
          name: "Hermínio Mabiala",
          time: "há 2 minutos",
          likes: 15,
          text: "Quem ainda tá a duvidar é porque gosta de sofrer. Isso é dos truques mais frescos que já vi online. Recomendo mesmo!",
        },
        {
          photo: testimonial2,
          name: "Anabela Sitoe",
          time: "há 5 minutos",
          likes: 23,
          text: "Kkkk juro que pensei que era mentira, mas resolvi testar e não é! Já caiu 1.200 na minha conta do M-Pesa. Vocês são os melhores!",
        },
        {
          photo: testimonial3,
          name: "Lurdes Cumbe",
          time: "há 8 minutos",
          likes: 41,
          text: "Nunca pensei que responder perguntas simples me ia dar dinheiro. Já levantei duas vezes e caiu certinho no E-Mola. Obrigada Netflix!",
        },
        {
          photo: testimonial4,
          name: "Carlos Muiambo",
          time: "há 12 minutos",
          likes: 9,
          text: "Fiz o quiz em menos de 2 minutos e já tenho $850 para levantar. Partilhei com toda a família. Não parem com isso, por favor!",
        },
      ].map((t, i) => (
        <div
          key={i}
          style={{
            ...cardStyle,
            display: "flex",
            gap: "0.75rem",
            marginBottom: "0.75rem",
            alignItems: "flex-start",
            padding: "1rem",
          }}
        >
          <img
            src={t.photo}
            alt={t.name}
            style={{
              width: 44,
              height: 44,
              borderRadius: "0.3rem",
              objectFit: "cover",
              flexShrink: 0,
              border: "2px solid hsl(0 85% 45%)",
            }}
          />
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, marginBottom: "0.3rem", fontSize: "0.95rem" }}>{t.name}</p>
            <p style={{ color: "hsl(0 0% 75%)", fontSize: "0.88rem", lineHeight: 1.5, marginBottom: "0.5rem" }}>
              {t.text}
            </p>
            <div style={{ display: "flex", gap: "1rem", fontSize: "0.8rem", color: "hsl(0 0% 50%)" }}>
              <span>👍 Curtir · {t.likes}</span>
              <span>Responder</span>
              <span>{t.time}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
