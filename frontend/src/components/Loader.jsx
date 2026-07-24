import { api } from '../lib/api'
import { useApiObject } from '../lib/useApiData'
import { useLogo } from '../lib/useLogo'
import { CHURCH } from '../data/content'

export default function Loader() {
  const { data } = useApiObject(api.getSettings, { churchName: CHURCH.name })
  const { src: logoSrc, onError: onLogoError, exhausted: logoExhausted } = useLogo()

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-ink">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <div className="absolute inset-0 animate-rayspin rounded-full border-2 border-dashed border-orange-400/40" />
        {!logoExhausted ? (
          <img
            src={logoSrc}
            alt="Church logo"
            onError={onLogoError}
            className="h-14 w-14 rounded-full object-cover"
          />
        ) : (
          <span className="font-display text-xl font-bold text-orange-300">RC</span>
        )}
      </div>
      <p className="eyebrow text-xs text-cream/60">{data.churchName}</p>
    </div>
  )
}
