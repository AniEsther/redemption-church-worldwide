export default function PageHero({ eyebrow, title, subtitle }) {
  return (
    <section className="relative bg-brown-700 pb-20 pt-40 text-center text-cream">
      <div className="relative mx-auto max-w-3xl px-6">
        {eyebrow && <p className="eyebrow mb-4 text-xs text-orange-300">{eyebrow}</p>}
        <h1 className="font-display text-4xl font-bold sm:text-5xl">{title}</h1>
        {subtitle && <p className="mx-auto mt-4 max-w-xl text-cream/70">{subtitle}</p>}
      </div>
    </section>
  )
}
