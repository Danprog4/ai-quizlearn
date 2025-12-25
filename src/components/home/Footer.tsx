import React from "react";

export function Footer() {
  return (
    <footer className="w-full max-w-7xl px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4 z-10 text-center md:text-left">
      <div className="text-[10px] md:text-[11px] text-white/20 tracking-wider">
        © 2025 AI QUIZ. ALL RIGHTS RESERVED.
      </div>
      <a
        href="https://x.com"
        target="_blank"
        rel="noreferrer"
        className="text-[10px] md:text-[11px] text-white/20 hover:text-indigo-400 transition-colors tracking-wider">
        BUILT IN PUBLIC ON X
      </a>
    </footer>
  );
}
