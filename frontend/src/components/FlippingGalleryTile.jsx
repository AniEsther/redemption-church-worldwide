import { useEffect, useState } from 'react'

// Cycles through `images` on its own timer, flipping to the next photo with a
// 3D rotation instead of sitting static. `startDelay` staggers tiles so they
// don't all flip in perfect unison.
export default function FlippingGalleryTile({ images, startIndex = 0, intervalMs = 4000, startDelay = 0, onSelect }) {
  const [index, setIndex] = useState(startIndex % images.length)

  useEffect(() => {
    if (images.length <= 1) return
    let intervalId
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        setIndex((i) => (i + 1) % images.length)
      }, intervalMs)
    }, startDelay)

    return () => {
      clearTimeout(timeoutId)
      if (intervalId) clearInterval(intervalId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length])

  const current = images[index]
  const src = typeof current === 'string' ? current : current.imageUrl

  return (
    <button
      onClick={() => onSelect?.(src)}
      className="block aspect-square w-full overflow-hidden rounded-2xl bg-brown-100 shadow-sm transition-shadow hover:shadow-lg dark:bg-brown-800"
      style={{ perspective: '1000px' }}
    >
      <img
        key={index}
        src={src}
        alt="Church gallery"
        loading="lazy"
        className="h-full w-full animate-flipIn object-cover"
        style={{ transformStyle: 'preserve-3d' }}
      />
    </button>
  )
}
