import { useEffect, useMemo, useState } from 'react'
import { X, ChevronLeft, ChevronRight, Expand } from 'lucide-react'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import { GALLERY } from '../data/content'
import { api } from '../lib/api'
import { useApiData } from '../lib/useApiData'

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(null)
  const [category, setCategory] = useState('All')
  const { data: images } = useApiData(api.getGallery, GALLERY)

  const categories = useMemo(() => {
    const set = new Set(images.map((img) => img.category || 'General'))
    return ['All', ...Array.from(set)]
  }, [images])

  const filtered = category === 'All' ? images : images.filter((img) => (img.category || 'General') === category)
  const active = activeIndex !== null ? filtered[activeIndex] : null

  const showPrev = () => setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length)
  const showNext = () => setActiveIndex((i) => (i + 1) % filtered.length)

  useEffect(() => {
    if (activeIndex === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') setActiveIndex(null)
      if (e.key === 'ArrowLeft') showPrev()
      if (e.key === 'ArrowRight') showNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, filtered.length])

  return (
    <>
      <PageHero eyebrow="Moments" title="Gallery" subtitle="Highlights from services, events, and church life" />

      <section className="bg-cream py-24 dark:bg-brown-900">
        <div className="mx-auto max-w-6xl px-6">
          {categories.length > 2 && (
            <Reveal className="mb-10 flex flex-wrap justify-center gap-2">
              {categories.map((cat) => {
                const count = cat === 'All' ? images.length : images.filter((img) => (img.category || 'General') === cat).length
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat)
                      setActiveIndex(null)
                    }}
                    className={`rounded-full border px-5 py-2 eyebrow text-[11px] transition-colors ${
                      category === cat
                        ? 'border-orange-400 bg-orange-400 text-white'
                        : 'border-brown-200 text-brown-600 hover:border-orange-400 hover:text-orange-500 dark:border-brown-600 dark:text-cream/70'
                    }`}
                  >
                    {cat} <span className="opacity-60">({count})</span>
                  </button>
                )
              })}
            </Reveal>
          )}

          {filtered.length === 0 ? (
            <p className="py-16 text-center text-sm text-brown-500 dark:text-cream/50">No photos in this category yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {filtered.map((img, i) => (
                <Reveal key={img._id || img.imageUrl} delay={(i % 4) + 1}>
                  <button
                    onClick={() => setActiveIndex(i)}
                    className="group relative block aspect-square w-full overflow-hidden rounded-2xl bg-brown-100 shadow-sm transition-shadow hover:shadow-lg dark:bg-brown-800"
                  >
                    <img
                      src={img.imageUrl}
                      alt={img.caption || 'Church gallery'}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-ink/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <Expand className="absolute right-3 top-3 h-5 w-5 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-90" />
                    {img.caption && (
                      <p className="absolute inset-x-0 bottom-0 translate-y-2 truncate px-3 py-2.5 text-left text-xs text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        {img.caption}
                      </p>
                    )}
                  </button>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {active && (
        <div
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-ink/95 p-4 sm:p-8"
          onClick={() => setActiveIndex(null)}
        >
          <button
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-cream hover:bg-white/10 sm:right-6 sm:top-6"
            aria-label="Close"
            onClick={() => setActiveIndex(null)}
          >
            <X className="h-6 w-6" />
          </button>

          {filtered.length > 1 && (
            <>
              <button
                className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-cream hover:bg-white/10 sm:left-6"
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation()
                  showPrev()
                }}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-cream hover:bg-white/10 sm:right-6"
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation()
                  showNext()
                }}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <img
            src={active.imageUrl}
            alt={active.caption || 'Enlarged gallery'}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[75vh] max-w-full rounded-xl object-contain"
          />
          {(active.caption || active.category) && (
            <div className="mt-4 text-center">
              {active.caption && <p className="text-sm text-cream">{active.caption}</p>}
              {active.category && <p className="eyebrow mt-1 text-[10px] text-orange-300">{active.category}</p>}
            </div>
          )}
        </div>
      )}
    </>
  )
}
