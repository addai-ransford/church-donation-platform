import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { verses } from "../types";

export function GivingBibleVerse() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setIndex(() => Math.floor(Math.random() * verses.length));
    }, 8000);

    return () => clearInterval(interval);
  }, [paused]);

  const current = verses[index];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent pointer-events-none" />

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm italic text-slate-300 leading-relaxed">
            “{current.text}”
          </p>

          <p className="mt-3 text-[10px] text-yellow-500 font-black uppercase tracking-[0.2em]">
            {current.ref}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
