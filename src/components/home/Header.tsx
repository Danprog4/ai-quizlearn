import React from 'react'
import { UserButton, useUser } from '@clerk/tanstack-react-start'

interface HeaderProps {
  onRestart: () => void
}

export function Header({ onRestart }: HeaderProps) {
  const { user, isLoaded } = useUser()
  const displayName =
    user?.firstName || user?.fullName || user?.username || 'Learner'
  const email =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress

  return (
    <header className="w-full max-w-7xl px-6 py-6 md:py-8 flex justify-between items-center z-10">
      <button
        onClick={onRestart}
        className="text-lg md:text-xl font-bold tracking-tight hover:opacity-80 transition-opacity"
      >
        <span className="text-white/40">quizler</span>
      </button>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] md:text-[11px] font-bold uppercase tracking-wider text-white/70">
          <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          Build in public • MVP
        </div>
        {isLoaded && user && (
          <div className="flex flex-col items-end text-right">
            <span className="text-xs font-semibold text-white/90">
              {displayName}
            </span>
            {email && (
              <span className="hidden sm:block text-[10px] text-white/50">
                {email}
              </span>
            )}
          </div>
        )}
        <UserButton />
      </div>
    </header>
  )
}
