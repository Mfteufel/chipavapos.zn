import { AnimatePresence, m } from 'framer-motion'
import { useUiStore } from '../../store/uiStore'

export function ToastHost() {
  const toasts = useUiStore((s) => s.toasts)
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-20 z-[70] flex flex-col items-center gap-2 px-4"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <m.div
            key={t.id}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-line bg-surface2 px-4 py-3 text-sm font-medium shadow-lg"
          >
            ✅ {t.message}
          </m.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
