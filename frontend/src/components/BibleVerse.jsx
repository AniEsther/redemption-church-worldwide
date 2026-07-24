import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import { VERSES } from '../data/content'

export default function BibleVerse() {
  const [verse] = useState(() => VERSES[Math.floor(Math.random() * VERSES.length)])

  return (
    <section className="relative overflow-hidden bg-brown-800 py-24 text-cream">
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <BookOpen className="mx-auto mb-6 h-8 w-8 text-orange-400" />
        <p className="font-display text-2xl italic leading-relaxed sm:text-3xl">
          &ldquo;{verse.text}&rdquo;
        </p>
        <p className="eyebrow mt-6 text-sm text-orange-300">{verse.ref}</p>
      </div>
    </section>
  )
}
