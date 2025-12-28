import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Check, Crown } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

export function PremiumAd() {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-8 relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5 p-6 md:p-8 text-center"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Crown size={120} />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-4 inline-flex items-center justify-center rounded-full bg-amber-500/10 p-3 ring-1 ring-amber-500/20">
          <Sparkles className="h-6 w-6 text-amber-500" />
        </div>

        <h3 className="mb-2 text-xl font-bold text-white">
          Level Up Your Learning
        </h3>
        <p className="mb-6 max-w-md text-sm text-white/60">
          Get unlimited quizzes, AI-powered personalized recommendations, and
          detailed analytics to master any topic faster.
        </p>

        <ul className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-2 text-left">
          {[
            'Unlimited AI Quizzes',
            'Personalized Learning Paths',
            'Advanced Analytics',
            'Priority Support',
          ].map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-2 text-xs text-white/80"
            >
              <Check size={14} className="text-amber-500" />
              {feature}
            </li>
          ))}
        </ul>

        <button
          onClick={() => navigate({ to: '/pricing' })}
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-8 py-3 text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_24px_rgba(245,158,11,0.4)]"
        >
          Upgrade to Pro
          <Crown
            size={16}
            className="transition-transform group-hover:rotate-12"
          />
        </button>
      </div>
    </motion.div>
  )
}
