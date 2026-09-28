"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";

/* ---------- small helpers ---------- */

const GRADIENTS = [
  "from-emerald-400 to-cyan-500",
  "from-fuchsia-500 to-orange-400",
  "from-violet-500 to-sky-400",
  "from-lime-400 to-emerald-500",
  "from-rose-500 to-amber-400",
  "from-indigo-500 to-fuchsia-500",
];

function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function LockIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="10.5" width="16" height="10" rx="2.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
      <circle cx="12" cy="15.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

function ArrowIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/* ---------- animated background ---------- */

function Aurora() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-ink">
      <div className="absolute -top-40 -left-40 h-[45rem] w-[45rem] rounded-full bg-emerald-500/25 blur-[120px] animate-drift1" />
      <div className="absolute top-1/3 -right-40 h-[40rem] w-[40rem] rounded-full bg-fuchsia-600/20 blur-[130px] animate-drift2" />
      <div className="absolute -bottom-52 left-1/4 h-[42rem] w-[42rem] rounded-full bg-cyan-500/20 blur-[130px] animate-drift3" />
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
    </div>
  );
}

/* ---------- confetti (no dependencies) ---------- */

function Confetti({ fire }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!fire) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const w = (canvas.width = window.innerWidth * dpr);
    const h = (canvas.height = window.innerHeight * dpr);
    const colors = ["#39ff88", "#ffffff", "#22d3ee", "#f472b6", "#fbbf24", "#a78bfa"];

    const parts = Array.from({ length: 150 }, () => ({
      x: w / 2,
      y: h * 0.42,
      vx: (Math.random() - 0.5) * 24 * dpr,
      vy: (Math.random() * -18 - 6) * dpr,
      s: (Math.random() * 6 + 4) * dpr,
      r: Math.random() * 6.28,
      vr: (Math.random() - 0.5) * 0.4,
      c: colors[(Math.random() * colors.length) | 0],
    }));

    let raf;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      let alive = false;
      for (const p of parts) {
        p.vy += 0.45 * dpr;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.r += p.vr;
        if (p.y < h + 40) alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
        ctx.restore();
      }
      if (alive) raf = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, w, h);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [fire]);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
    />
  );
}

/* ---------- count-up number ---------- */

function CountUp({ value }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [value]);
  return <>{n.toLocaleString()}</>;
}

/* ---------- person card ---------- */

function PersonCard({ person, index, onPick }) {
  function onMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.07, type: "spring", stiffness: 220, damping: 22 }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.96 }}
      onMouseMove={onMove}
      onClick={() => onPick(person)}
      className="spot group rounded-3xl p-5 text-left"
    >
      <div
        className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${
          GRADIENTS[index % GRADIENTS.length]
        } font-display text-lg font-extrabold text-black shadow-lg`}
      >
        {initials(person.name)}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">Tap in</p>
          <p className="font-display text-xl font-bold leading-tight">{person.name}</p>
        </div>
        <ArrowIcon className="h-5 w-5 text-white/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-neon" />
      </div>
    </motion.button>
  );
}

/* ---------- page ---------- */

export default function Home() {
  const [people, setPeople] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [selected, setSelected] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [password, setPassword] = useState("");
  const [errorTick, setErrorTick] = useState(0);
  const [reveal, setReveal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fire, setFire] = useState(0);
  const [greeting, setGreeting] = useState("Hey");

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");

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
      if (!res.ok) {
        setErrorTick((t) => t + 1);
        setPassword("");
        return;
      }
      setReveal(await res.json());
      setFire((f) => f + 1);
    } catch {
      setErrorTick((t) => t + 1);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setSelected(null);
    setPassword("");
    setErrorTick(0);
    setReveal(null);
  }

  function pick(p) {
    setSelectedIndex(people.findIndex((x) => x.id === p.id));
    setSelected(p);
  }

  const gradient = GRADIENTS[selectedIndex % GRADIENTS.length];

  return (
    <>
      <Aurora />
      <Confetti fire={fire} />

      <main className="relative mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-5 py-16">
        {/* header */}
        <AnimatePresence mode="wait">
          {!selected && (
            <motion.header
              key="head"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="mb-12 text-center"
            >
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-white/60 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shadow-[0_0_10px_#39ff88]" />
                Private ledger
              </span>
              <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl">
                Who I <span className="text-shine">Owe</span> 💸
              </h1>
              <p className="mx-auto mt-5 max-w-md text-base text-white/50 sm:text-lg">
                Thanks for holding me down while I covered the bills. Find your
                name and see where we stand.
              </p>
            </motion.header>
          )}
        </AnimatePresence>

        {/* name grid */}
        {!selected && (
          <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3">
            {loadingList &&
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[152px] animate-pulse rounded-3xl border border-white/5 bg-white/[0.03]"
                />
              ))}

            {!loadingList &&
              people.map((p, i) => (
                <PersonCard key={p.id} person={p} index={i} onPick={pick} />
              ))}

            {!loadingList && people.length === 0 && (
              <p className="col-span-full text-center text-white/40">
                No names yet. Check back soon.
              </p>
            )}
          </div>
        )}

        {/* password stage */}
        <AnimatePresence mode="wait">
          {selected && !reveal && (
            <motion.div
              key="pass"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 240, damping: 24 }}
              className="spot w-full max-w-sm rounded-[2rem] p-8 text-center"
            >
              <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-neon/30 animate-pulseRing" />
                <div
                  className={`relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-black shadow-xl`}
                >
                  <LockIcon className="h-9 w-9" />
                </div>
              </div>

              <p className="text-sm text-white/50">{greeting},</p>
              <h2 className="mb-6 font-display text-3xl font-extrabold">
                {selected.name}
              </h2>

              <motion.div
                key={errorTick}
                animate={errorTick ? { x: [0, -12, 12, -8, 8, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  placeholder="Enter your password"
                  autoFocus
                  className={`w-full rounded-2xl border bg-black/40 px-5 py-4 text-center text-lg tracking-widest outline-none transition-colors ${
                    errorTick
                      ? "border-red-500/70"
                      : "border-white/10 focus:border-neon"
                  }`}
                />
              </motion.div>

              <div className="h-6 pt-2 text-sm text-red-400">
                {errorTick > 0 && "Nope, that's not it. Try again 😅"}
              </div>

              <button
                onClick={submit}
                disabled={loading || !password}
                className="mt-2 w-full rounded-2xl bg-neon py-4 font-display text-base font-bold text-black shadow-[0_0_30px_-4px_rgba(57,255,136,0.7)] transition hover:brightness-110 active:scale-[0.98] disabled:opacity-40 disabled:shadow-none"
              >
                {loading ? "Checking..." : "Unlock"}
              </button>

              <button
                onClick={reset}
                className="mt-5 text-sm text-white/40 transition hover:text-white"
              >
                ← Not me
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* reveal stage */}
        <AnimatePresence>
          {reveal && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, scale: 0.85, rotateX: 20 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 18 }}
              className="relative w-full max-w-md"
            >
              <div className="absolute -inset-1 rounded-[2.2rem] bg-gradient-to-br from-neon via-cyan-400 to-fuchsia-500 opacity-60 blur-xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-[#0c0c12]/90 p-8 text-center backdrop-blur-xl">
                <div
                  className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} font-display text-xl font-extrabold text-black`}
                >
                  {initials(reveal.name)}
                </div>

                <p className="text-sm uppercase tracking-[0.25em] text-white/40">
                  {reveal.name}, here's the damage
                </p>

                {reveal.amount > 0 ? (
                  <>
                    <p className="mt-4 font-display text-6xl font-extrabold text-neon sm:text-7xl">
                      <CountUp value={reveal.amount} />
                    </p>
                    <p className="mt-1 font-display text-lg font-bold tracking-widest text-white/60">
                      TZS
                    </p>
                  </>
                ) : (
                  <>
                    <p className="mt-4 font-display text-5xl font-extrabold text-neon sm:text-6xl">
                      All clear 🎉
                    </p>
                    <p className="mt-2 text-white/50">Nothing owed. We're square.</p>
                  </>
                )}

                <div className="my-7 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <p className="text-lg italic leading-relaxed text-white/80">
                  “{reveal.message}”
                </p>

                <button
                  onClick={reset}
                  className="mt-8 rounded-full border border-white/15 px-6 py-2.5 text-sm text-white/70 transition hover:border-neon hover:text-neon"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-16 text-xs text-white/25">
          Built with love and unpaid receipts
        </p>
      </main>
    </>
  );
}