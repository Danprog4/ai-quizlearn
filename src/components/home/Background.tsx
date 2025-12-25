import React from "react";

export function Background() {
  return (
    <>
      <div className="fixed inset-0 bg-noise pointer-events-none" />
      <div className="fixed inset-0 bg-grid pointer-events-none" />

      {/* Glow spots */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
    </>
  );
}

