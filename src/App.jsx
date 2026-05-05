import { useState, useRef } from "react";
import { ALL_QUOTES, MARKETERS } from "./data.js";

function getRandomPair(lastQuote) {
  let quote;
  do {
    quote = ALL_QUOTES[Math.floor(Math.random() * ALL_QUOTES.length)];
  } while (quote === lastQuote && ALL_QUOTES.length > 1);
  const marketer = MARKETERS[Math.floor(Math.random() * MARKETERS.length)];
  return { quote, marketer };
}

export default function App() {
  const [state, setState] = useState("idle"); // idle | shaking | revealing | revealed
  const [current, setCurrent] = useState(null);
  const timeouts = useRef([]);

  const clearTimeouts = () => timeouts.current.forEach(clearTimeout);

  const shake = () => {
    if (state === "shaking") return;
    clearTimeouts();

    setState("shaking");

    const t1 = setTimeout(() => {
      setState("revealing");
      const pair = getRandomPair(current?.quote);
      setCurrent(pair);
    }, 700);

    const t2 = setTimeout(() => {
      setState("revealed");
    }, 1100);

    timeouts.current = [t1, t2];
  };

  const revealed = state === "revealed" || state === "revealing";

  return (
    <div style={s.page}>
      <div style={s.grain} />

      <header style={s.header}>
        <p style={s.eyebrow}>◆ ASK THE ORACLE ◆</p>
        <h1 style={s.title}>
          Marketing<br />
          <em style={s.titleAccent}>8-Ball</em>
        </h1>
        <p style={s.subtitle}>
          Think of your burning marketing question.<br />
          <span style={s.subtitleMute}>The oracle already knows the answer.</span>
        </p>
      </header>

      <main style={s.main}>
        {/* Ball button */}
        <button
          style={{
            ...s.ballWrap,
            ...(state === "shaking" ? s.ballShaking : {}),
            cursor: state === "shaking" ? "default" : "pointer",
          }}
          onClick={shake}
          aria-label="Shake the Magic 8-Ball"
        >
          <div style={s.ball}>
            <div style={s.shine} />
            <div style={s.window}>
              {state === "idle" && (
                <span style={s.eight}>8</span>
              )}
              {state === "shaking" && (
                <div style={s.windowDots}>
                  <span style={{ ...s.wdot, animationDelay: "0s" }} />
                  <span style={{ ...s.wdot, animationDelay: "0.15s" }} />
                  <span style={{ ...s.wdot, animationDelay: "0.3s" }} />
                </div>
              )}
              {revealed && current && (
                <p style={{
                  ...s.windowQuote,
                  opacity: state === "revealed" ? 1 : 0,
                  transform: state === "revealed" ? "translateY(0)" : "translateY(6px)",
                }}>
                  {current.quote}
                </p>
              )}
            </div>
          </div>
        </button>

        {state === "idle" && (
          <p style={s.hint}>tap to shake</p>
        )}

        {/* Attribution below ball */}
        {revealed && current && (
          <div style={{
            ...s.attribution,
            opacity: state === "revealed" ? 1 : 0,
            transform: state === "revealed" ? "translateY(0)" : "translateY(8px)",
          }}>
            <div style={s.attrLine} />
            <p style={s.attrName}>— {current.marketer.name}</p>
            <p style={s.attrTitle}>
              {current.marketer.title} · {current.marketer.company}
            </p>
            <button style={s.againBtn} onClick={shake}>
              ↻ &nbsp;Ask again
            </button>
          </div>
        )}
      </main>

      <footer style={s.footer}>
        <p style={s.footerText}>
          A satirical mirror for the marketing industry.<br />
          All gurus are fictional. The wisdom is not.
        </p>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080808; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%   { transform: rotate(0deg)  scale(1);    }
          10%  { transform: rotate(-8deg) scale(1.03); }
          20%  { transform: rotate(8deg)  scale(1.05); }
          30%  { transform: rotate(-6deg) scale(1.04); }
          40%  { transform: rotate(6deg)  scale(1.05); }
          50%  { transform: rotate(-4deg) scale(1.03); }
          60%  { transform: rotate(4deg)  scale(1.02); }
          70%  { transform: rotate(-2deg) scale(1.01); }
          85%  { transform: rotate(2deg)  scale(1);    }
          100% { transform: rotate(0deg)  scale(1);    }
        }
        @keyframes winkle {
          0%,100% { opacity: 0.2; transform: scale(0.6); }
          50%      { opacity: 1;   transform: scale(1.2); }
        }
        button:focus-visible {
          outline: 2px solid #4a7fa5;
          outline-offset: 4px;
        }
        button:hover { opacity: 0.9; }
      `}</style>
    </div>
  );
}

const BALL = 380;
const WIN  = 240;

const s = {
  page: {
    minHeight: "100vh",
    background: "#080808",
    color: "#e5dfd2",
    fontFamily: "'DM Sans', sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    overflowX: "hidden",
  },
  grain: {
    position: "fixed",
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
    pointerEvents: "none",
    zIndex: 0,
  },

  // Header
  header: {
    position: "relative",
    zIndex: 1,
    textAlign: "center",
    padding: "56px 24px 40px",
    animation: "fadeUp 0.7s ease both",
  },
  eyebrow: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "9px",
    letterSpacing: "0.3em",
    color: "#4a7fa5",
    marginBottom: "20px",
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(48px, 10vw, 88px)",
    fontWeight: 900,
    lineHeight: 1.0,
    color: "#e5dfd2",
    marginBottom: "20px",
  },
  titleAccent: {
    color: "#4a7fa5",
    fontStyle: "italic",
  },
  subtitle: {
    fontSize: "15px",
    lineHeight: 1.6,
    color: "#555",
    fontWeight: 300,
  },
  subtitleMute: {
    fontSize: "12px",
    color: "#333",
    fontStyle: "italic",
  },

  // Main
  main: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "28px",
    padding: "0 24px 64px",
    width: "100%",
    maxWidth: "600px",
  },

  // Ball
  ballWrap: {
    background: "transparent",
    border: "none",
    padding: 0,
    display: "block",
    animation: "fadeUp 0.7s 0.1s ease both",
    filter: "drop-shadow(0 32px 80px rgba(0,0,0,0.9)) drop-shadow(0 8px 24px rgba(74,127,165,0.08))",
  },
  ballShaking: {
    animation: "shake 0.7s ease both",
  },
  ball: {
    width: `${BALL}px`,
    height: `${BALL}px`,
    borderRadius: "50%",
    background: "radial-gradient(circle at 35% 28%, #242424 0%, #0e0e0e 45%, #030303 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    boxShadow: "inset 0 -8px 32px rgba(0,0,0,0.8), inset 0 2px 8px rgba(255,255,255,0.03)",
  },
  shine: {
    position: "absolute",
    top: "13%",
    left: "20%",
    width: "26%",
    height: "16%",
    borderRadius: "50%",
    background: "radial-gradient(ellipse, rgba(255,255,255,0.06) 0%, transparent 100%)",
    transform: "rotate(-25deg)",
    pointerEvents: "none",
  },

  // Inner window
  window: {
    width: `${WIN}px`,
    height: `${WIN}px`,
    borderRadius: "50%",
    background: "radial-gradient(circle at 38% 32%, #162a3d 0%, #0a1a28 55%, #040d14 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "22px",
    boxShadow: "inset 0 2px 12px rgba(0,0,0,0.6)",
    overflow: "hidden",
  },
  eight: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "80px",
    fontWeight: 900,
    color: "#0d1e2d",
    lineHeight: 1,
    userSelect: "none",
  },
  windowDots: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  wdot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#4a7fa5",
    display: "inline-block",
    animation: "winkle 0.8s ease-in-out infinite",
  },
  windowQuote: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    lineHeight: 1.55,
    color: "#7ab0cc",
    textAlign: "center",
    fontWeight: 400,
    transition: "opacity 0.45s ease, transform 0.45s ease",
    userSelect: "none",
  },

  hint: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "10px",
    letterSpacing: "0.2em",
    color: "#222",
    marginTop: "-12px",
  },

  // Attribution
  attribution: {
    textAlign: "center",
    transition: "opacity 0.5s ease 0.3s, transform 0.5s ease 0.3s",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
  },
  attrLine: {
    width: "1px",
    height: "28px",
    background: "linear-gradient(to bottom, transparent, #4a7fa5)",
    marginBottom: "6px",
  },
  attrName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "19px",
    fontWeight: 700,
    color: "#e5dfd2",
  },
  attrTitle: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "10px",
    color: "#2d5570",
    letterSpacing: "0.06em",
  },
  againBtn: {
    marginTop: "18px",
    background: "transparent",
    border: "1px solid #141e25",
    color: "#2d5570",
    padding: "9px 20px",
    fontFamily: "'DM Mono', monospace",
    fontSize: "10px",
    letterSpacing: "0.15em",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  // Footer
  footer: {
    position: "relative",
    zIndex: 1,
    borderTop: "1px solid #0e0e0e",
    padding: "32px 24px",
    textAlign: "center",
    width: "100%",
    marginTop: "auto",
  },
  footerText: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "10px",
    color: "#1a1a1a",
    lineHeight: 1.9,
    letterSpacing: "0.05em",
  },
};
