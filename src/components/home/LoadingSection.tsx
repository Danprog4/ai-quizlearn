import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export function LoadingSection() {
  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="text-center space-y-8">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 mx-auto">
          <Loader2 className="w-20 h-20 text-indigo-500" />
        </motion.div>
        <motion.div
          className="absolute inset-0 w-20 h-20 mx-auto rounded-full bg-indigo-500/20 blur-xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-white">
          Generating your quiz...
        </h2>
        <p className="text-white/50">
          AI is analyzing the documentation
        </p>
      </div>

      <div className="flex flex-col items-center gap-2 text-sm text-white/30">
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}>
          📖 Reading content...
        </motion.span>
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}>
          🧠 Extracting key concepts...
        </motion.span>
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}>
          ✨ Creating questions...
        </motion.span>
      </div>
    </motion.div>
  );
}

