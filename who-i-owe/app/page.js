"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [people, setPeople] = useState([]);
  const [selected, setSelected] = useState(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [reveal, setReveal] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/people")
      .then((r) => r.json())
      .then(setPeople);
  }, []);

  async function submit() {
    setLoading(true);
    setError(false);
    const res = await fetch("/api/reveal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selected.id, password }),
    });
    setLoading(false);

    if (!res.ok) {
      setError(true);
      setPassword("");
      return;
    }
    setReveal(await res.json());
  }

  function reset() {
    setSelected(null);
    setPassword("");
    setError(false);
    setReveal(null);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">
        Who I Owe 💸
      </h1>
      <p className="text-gray-400 mb-10 text-center">
        Tap your name to see what's up
      </p>

      {!selected && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-xl">
          {people.map((p) => (
            <motion.button
              key={p.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelected(p)}
              className="bg-card border border-neon/20 rounded-2xl py-6 font-semibold text-lg hover:border-neon transition-colors"
            >
              {p.name}
            </motion.button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && !reveal && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card rounded-2xl p-8 w-full max-w-sm text-center"
          >
            <h2 className="text-xl mb-4">Hey {selected.name} 👋</h2>
            <motion.input
              animate={error ? { x: [0, -10, 10, -10, 10, 0] } : {}}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Your password"
              className="w-full bg-dark border border-neon/30 rounded-lg px-4 py-3 mb-4 outline-none focus:border-neon"
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-sm mb-4">Nope, try again 😅</p>
            )}
            <button
              onClick={submit}
              disabled={loading}
              className="bg-neon text-dark font-bold px-6 py-3 rounded-lg w-full hover:opacity-90 transition"
            >
              {loading ? "Checking..." : "Reveal"}
            </button>
            <button
              onClick={reset}
              className="text-gray-500 text-sm mt-4 block mx-auto"
            >
              ← back
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {reveal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl p-8 w-full max-w-sm text-center border border-neon"
          >
            <p className="text-gray-400 mb-2">You owe</p>
            <p className="text-4xl font-bold text-neon mb-4">
              {reveal.amount.toLocaleString()} TZS
            </p>
            <p className="italic text-gray-300 mb-6">"{reveal.message}"</p>
            <button
              onClick={reset}
              className="text-sm text-gray-500 underline"
            >
              close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}