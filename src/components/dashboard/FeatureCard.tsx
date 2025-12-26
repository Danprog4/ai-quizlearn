import React from 'react'
import { motion } from 'framer-motion'
import { X, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  longDescription?: string
  gradient: string
  accentColor: string
  delay: number
  preview?: React.ReactNode
  isComingSoon?: boolean
  onClick?: () => void
}

export function FeatureCard({
  icon,
  title,
  description,
  gradient,
  accentColor,
  delay,
  preview,
  isComingSoon = true,
  onClick,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      className={cn('relative group cursor-pointer')}
      onClick={onClick}
    >
      <div
        className={cn(
          'relative p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm overflow-hidden h-full transition-all duration-300',
          'group-hover:bg-white/[0.08] group-hover:border-white/20',
        )}
      >
        {/* Gradient overlay */}
        <div className={`absolute inset-0 ${gradient} opacity-50`} />

        {/* Coming soon badge */}
        {isComingSoon && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/20">
            <X size={10} className="text-white/60" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
              Soon
            </span>
          </div>
        )}

        {!isComingSoon && (
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
              <ChevronRight size={14} className="text-white/40" />
            </div>
          </div>
        )}

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-12 h-12 rounded-xl ${accentColor} flex items-center justify-center`}
            >
              {icon}
            </div>
            <h3 className="font-bold text-white text-lg">{title}</h3>
          </div>
          <p className="text-sm text-white/50 leading-relaxed mb-4">
            {description}
          </p>
          {preview && (
            <div
              className={cn(
                'mt-4 transition-opacity',
                isComingSoon ? 'opacity-40 pointer-events-none' : 'opacity-100',
              )}
            >
              {preview}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
