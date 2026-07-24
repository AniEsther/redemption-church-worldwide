import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const variants = {
  enter: (direction) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction > 0 ? '-100%' : '100%', opacity: 0 }),
}

export default function HomeGallerySlider({ images, intervalMs = 4000, onSelect }) {
  const [[index, direction], setPage] = useState([0, 1])

  const paginate = (dir) => {
    setPage(([i]) => [(i + dir + images.length) % images.length, dir])
  }

  // Auto-advance — resets whenever the slide changes (auto or manual) so a
  // manual click doesn't get immediately overridden by the timer.
  useEffect(() => {
    if (images.length <= 1) return
    const id = setInterval(() => paginate(1), intervalMs)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, images.length])

  if (images.length === 0) return null

  const current = images[index]
  const src = typeof current === 'string' ? current : current.imageUrl

  return (
    <div className="relative mx-auto aspect-[16/10] max-w-3xl overflow-hidden rounded-2xl bg-brown-100 shadow-lg dark:bg-brown-800">
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={index}
          src={src}
          alt="Church gallery"
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => onSelect?.(src)}
          className="absolute inset-0 h-full w-full cursor-pointer object-cover"
        />
      </AnimatePresence>

      {images.length > 1 && (
        <>
          <button
            onClick={() => paginate(-1)}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink/50 text-white transition-colors hover:bg-ink/70"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => paginate(1)}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink/50 text-white transition-colors hover:bg-ink/70"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
    </div>
  )
}
