import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";

interface InputSectionProps {
  url: string;
  setUrl: (url: string) => void;
  handleSubmit: (e?: React.FormEvent) => void;
  inputError: string | null;
  handleChipClick: (url: string) => void;
}

const EXAMPLES = [
  { name: "React docs", url: "https://react.dev" },
  { name: "Stripe API", url: "https://docs.stripe.com/api" },
  {
    name: "Kubernetes",
    url: "https://kubernetes.io/docs/home/",
  },
  { name: "README", url: "https://github.com/framer/motion" },
];

export function InputSection({
  url,
  setUrl,
  handleSubmit,
  inputError,
  handleChipClick,
}: InputSectionProps) {
  return (
    <motion.div
      key="input"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
          Turn docs into a quiz.{" "}
          <span className="text-indigo-500/80">With AI.</span>
        </h1>
        <p className="text-base md:text-lg text-white/60 font-light">
          Paste a documentation URL to check your understanding. No sign-up.
        </p>
      </div>

      <div className="w-full space-y-6">
        <form onSubmit={handleSubmit} className="relative group">
          <div
            className={cn(
              "relative flex flex-col sm:flex-row sm:items-center p-2 rounded-2xl bg-white/5 border transition-all duration-300",
              "border-white/10 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/20",
              inputError ? "border-red-500/50" : ""
            )}>
            <div className="hidden sm:flex pl-4 pr-3 text-white/40 group-focus-within:text-indigo-400 transition-colors">
              <Link2 size={20} />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste your docs URL..."
              className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/25 py-3 px-4 sm:px-0 text-lg w-full"
            />
            <button
              type="submit"
              className="w-full sm:w-auto mt-2 sm:mt-0 sm:ml-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold transition-all hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] active:scale-[0.98] whitespace-nowrap">
              Generate quiz
            </button>
          </div>
        </form>

        <AnimatePresence mode="wait">
          {inputError && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-red-400 text-center">
              {inputError}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Example chips */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-white/20 mr-1">
            Try:
          </span>
          {EXAMPLES.map((chip) => (
            <button
              key={chip.name}
              onClick={() => handleChipClick(chip.url)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/40 hover:bg-indigo-500/15 hover:border-indigo-500/30 hover:text-indigo-400 transition-all active:scale-95">
              {chip.name}
            </button>
          ))}
        </div>

        {/* How it works */}
        <div className="pt-12 flex justify-center">
          <div className="flex items-center gap-6 text-[11px] font-medium uppercase tracking-[0.2em] text-white/20">
            <span>Paste</span>
            <ArrowRight size={10} className="text-white/10" />
            <span>5 questions</span>
            <ArrowRight size={10} className="text-white/10" />
            <span>Score + recap</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

