import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react'

const variants = {
  enter: (direction) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction > 0 ? '-100%' : '100%', opacity: 0 }),
}

export default function HomeTestimonialSlider({ testimonials, intervalMs = 5000 }) {
  const [[index, direction], setPage] = useState([0, 1])

  const paginate = (dir) => {
    setPage(([i]) => [(i + dir + testimonials.length) % testimonials.length, dir])
  }

  useEffect(() => {
    if (testimonials.length <= 1) return
    const id = setInterval(() => paginate(1), intervalMs)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, testimonials.length])

  if (testimonials.length === 0) return null

  const t = testimonials[index]

  return (
    <div className="relative mt-12 overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-brown-800">
      <div className="relative min-h-[220px] px-10 py-10 sm:min-h-[190px]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center"
          >
            <Quote className="h-8 w-8 text-orange-400" />
            <p className="mt-6 font-display text-lg italic leading-relaxed text-brown-700 dark:text-cream">
              &ldquo;{t.text}&rdquo;
            </p>
            <p className="eyebrow mt-6 text-xs text-orange-500">{t.name}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-4 pb-8">
        <button onClick={() => paginate(-1)} className="rounded-full border border-brown-200 p-2 text-brown-500 hover:border-orange-400 hover:text-orange-500 dark:border-brown-600">
          <ChevronLeft className="h-4 w-4" />
        </button>
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setPage([i, i > index ? 1 : -1])}
            aria-label={`Testimonial ${i + 1}`}
            className={`h-2 w-2 rounded-full transition-all ${i === index ? 'w-6 bg-orange-400' : 'bg-brown-200 dark:bg-brown-600'}`}
          />
        ))}
        <button onClick={() => paginate(1)} className="rounded-full border border-brown-200 p-2 text-brown-500 hover:border-orange-400 hover:text-orange-500 dark:border-brown-600">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
