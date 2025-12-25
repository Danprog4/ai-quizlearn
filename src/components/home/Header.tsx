import React from "react";

interface HeaderProps {
  onRestart: () => void;
}

export function Header({ onRestart }: HeaderProps) {
  return (
    <header className="w-full max-w-7xl px-6 py-6 md:py-8 flex justify-between items-center z-10">
      <button
        onClick={onRestart}
        className="text-lg md:text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
        ai<span className="text-white/40">quiz</span>
      </button>
      <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] md:text-[11px] font-bold uppercase tracking-wider text-white/70">
        <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-indigo-500 animate-pulse" />
        Build in public • MVP
      </div>
    </header>
  );
}

