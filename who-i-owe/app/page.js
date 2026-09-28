"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, MotionConfig, animate } from "framer-motion";

const COLORS = ["#ff9500", "#34c759", "#007aff", "#af52de", "#ff2d55", "#5ac8fa", "#ff3b30", "#5856d6"];

const initials = (name = "") =>
  name.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

/* lifts the sheet above the on-screen keyboard */
function useKeyboardOffset() {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () =>
      setOffset(Math.max(0, window.innerHeight - vv.height - vv.offsetTop));
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);
  return offset;
}

function Avatar({ name, index, size = 40 }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        background: COLORS[index % COLORS.length],
      }}
    >
      {initials(name)}
    </div>
  );
}

function Chevron() {
  return (
    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" style={{ color: "var(--label3)" }}>
      <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CountUp({ value }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const c = animate(0, value, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => c.stop();
  }, [value]);
  return <>{n.toLocaleString()}</>;
}

function Sheet({ children, bottom }) {
  return (
    <motion.div
      className="fixed inset-x-0 z-50 mx-auto w-full max-w-md rounded-t-[28px] px-5 pt-3"
      style={{
        bottom,
        background: "var(--card)",
        paddingBottom: "max(env(safe-area-inset-bottom), 20px)",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
      }}
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 34, stiffness: 380 }}
    >
      <div className="mx-auto mb-5 h-[5px] w-9 rounded-full" style={{ background: "var(--label3)" }} />
      {children}
    </motion.div>
  );
}

export default function Home() {
  const [people, setPeople] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [selected, setSelected] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [password, setPassword] = useState("");
  const [errorTick, setErrorTick] = useState(0);
  const [reveal, setReveal] = useState(null);
  const [loading, setLoading] = useState(false);
  const kb = useKeyboardOffset();

  useEffect(() => {
    fetch("/api/people")
      .then((r) => r.json())
      .then((d) => setPeople(Array.isArray(d) ? d : []))
      .catch(() => setPeople([]))
      .finally(() => setLoadingList(false));
  }, []);

  async function submit() {
    if (!password || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/reveal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selected.id, password }),
      });
      if (!res.ok) throw new Error("bad");
      setReveal(await res.json());
      document.activeElement?.blur();
    } catch {
      setErrorTick((t) => t + 1);
      setPassword("");
      navigator.vibrate?.(60);
    } finally {
      setLoading(false);
    }
  }

  function close() {
    setSelected(null);
    setPassword("");
    setErrorTick(0);
    setReveal(null);
  }

  const muted = { color: "var(--label2)" };

  return (
    <MotionConfig reducedMotion="user">
      <main
        className="mx-auto min-h-dvh w-full max-w-md px-4"
        style={{
          paddingTop: "max(env(safe-area-inset-top), 24px)",
          paddingBottom: "max(env(safe-area-inset-bottom), 32px)",
        }}
      >
        <header className="px-1 pb-7 pt-6">
          <h1 className="text-[34px] font-bold leading-[1.1] tracking-tight">Who I Owe</h1>
          <p className="mt-2 text-[17px] leading-snug" style={muted}>
            Thanks for having my back on the bills. Pick your name to see where we stand.
          </p>
        </header>

        <p className="mb-2 px-4 text-[13px] uppercase tracking-wide" style={muted}>
          Friends
        </p>

        <div className="overflow-hidden rounded-[14px]" style={{ background: "var(--card)" }}>
          {loadingList &&
            [0, 1, 2, 3].map((i) => (
              <div key={i} className="row animate-pulse">
                <div className="h-10 w-10 rounded-full" style={{ background: "var(--fill)" }} />
                <div className="h-4 w-32 rounded" style={{ background: "var(--fill)" }} />
              </div>
            ))}

          {!loadingList &&
            people.map((p, i) => (
              <motion.button
                key={p.id}
                className="row"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => {
                  setSelectedIndex(i);
                  setSelected(p);
                }}
              >
                <Avatar name={p.name} index={i} />
                <span className="flex-1 text-[17px] font-medium">{p.name}</span>
                <Chevron />
              </motion.button>
            ))}

          {!loadingList && people.length === 0 && (
            <p className="p-5 text-center text-[15px]" style={muted}>
              No names yet.
            </p>
          )}
        </div>

        <p className="mt-3 px-4 text-[13px] leading-snug" style={muted}>
          Your amount and note are only shown after you enter your own password.
        </p>
      </main>

      {/* dim backdrop */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* password sheet */}
        {selected && !reveal && (
          <Sheet key="pw" bottom={kb}>
            <div className="flex flex-col items-center text-center">
              <Avatar name={selected.name} index={selectedIndex} size={64} />
              <h2 className="mt-3 text-[22px] font-bold">Hi, {selected.name}</h2>
              <p className="mt-1 text-[15px]" style={muted}>
                Enter your password to continue.
              </p>
            </div>

            <motion.div
              key={errorTick}
              className="mt-5"
              animate={errorTick ? { x: [0, -10, 10, -6, 6, 0] } : {}}
              transition={{ duration: 0.35 }}
            >
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="Password"
                autoFocus
                autoComplete="off"
                enterKeyHint="go"
                className="h-[52px] w-full rounded-[14px] px-4 text-[17px] outline-none"
                style={{
                  background: "var(--fill)",
                  color: "var(--label)",
                  boxShadow: errorTick ? "inset 0 0 0 1.5px var(--red)" : "none",
                }}
              />
            </motion.div>

            <p className="h-6 pt-1.5 text-center text-[13px]" style={{ color: "var(--red)" }}>
              {errorTick > 0 && "Incorrect password. Try again."}
            </p>

            <button
              onClick={submit}
              disabled={!password || loading}
              className="mt-1 h-[52px] w-full rounded-[14px] text-[17px] font-semibold text-white transition active:scale-[0.98] active:opacity-80 disabled:opacity-40"
              style={{ background: "var(--blue)" }}
            >
              {loading ? "Checking…" : "Continue"}
            </button>
            <button
              onClick={close}
              className="mt-2 h-[48px] w-full text-[17px]"
              style={{ color: "var(--blue)" }}
            >
              Cancel
            </button>
          </Sheet>
        )}

        {/* reveal sheet */}
        {reveal && (
          <Sheet key="rv" bottom={0}>
            <div className="flex flex-col items-center text-center">
              <Avatar name={reveal.name} index={selectedIndex} size={56} />
              <p className="mt-2 text-[15px] font-medium" style={muted}>
                {reveal.name}
              </p>

              {reveal.amount > 0 ? (
                <>
                  <p className="mt-6 text-[15px]" style={muted}>
                    I owe you
                  </p>
                  <p className="tnum mt-1 text-[48px] font-bold leading-none tracking-tight sm:text-[56px]">
                    <CountUp value={reveal.amount} />
                  </p>
                  <p className="mt-2 text-[15px] font-semibold tracking-wide" style={muted}>
                    TZS
                  </p>
                </>
              ) : (
                <>
                  <div
                    className="mt-6 flex h-14 w-14 items-center justify-center rounded-full"
                    style={{ background: "var(--green)" }}
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                  </div>
                  <p className="mt-3 text-[28px] font-bold">We're square</p>
                  <p className="mt-1 text-[15px]" style={muted}>
                    I don't owe you anything.
                  </p>
                </>
              )}
            </div>

            <div className="mt-6 rounded-[14px] p-4" style={{ background: "var(--fill)" }}>
              <p className="mb-1 text-[13px] uppercase tracking-wide" style={muted}>
                A note from me
              </p>
              <p className="text-[17px] leading-snug">{reveal.message}</p>
            </div>

            <button
              onClick={close}
              className="mt-5 h-[52px] w-full rounded-[14px] text-[17px] font-semibold text-white transition active:scale-[0.98] active:opacity-80"
              style={{ background: "var(--blue)" }}
            >
              Done
            </button>
          </Sheet>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}