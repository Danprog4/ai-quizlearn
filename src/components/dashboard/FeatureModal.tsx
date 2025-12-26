import { motion } from 'framer-motion'
import { X, Sparkles } from 'lucide-react'
import { FeatureCardProps } from './FeatureCard'

export function FeatureModal({
  feature,
  onClose,
}: {
  feature: Omit<FeatureCardProps, 'delay'> | null
  onClose: () => void
}) {
  if (!feature) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080808]/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-lg bg-[#0c0c0c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`h-32 relative ${feature.gradient} opacity-50`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors z-20"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 -mt-12 relative z-10">
          <div
            className={`w-16 h-16 rounded-2xl ${feature.accentColor} flex items-center justify-center mb-6 shadow-xl`}
          >
            {feature.icon}
          </div>

          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-white">{feature.title}</h2>
            {feature.isComingSoon && (
              <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white/40">
                Soon
              </span>
            )}
          </div>

          <p className="text-white/60 leading-relaxed mb-8">
            {feature.longDescription || feature.description}
          </p>

          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4 flex items-center gap-2">
              <Sparkles size={12} className="text-indigo-400" />
              Preview Interaction
            </h4>
            <div className="opacity-80">{feature.preview}</div>
          </div>

          <button
            onClick={onClose}
            className={`w-full mt-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-all flex items-center justify-center gap-2`}
          >
            Close Details
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
