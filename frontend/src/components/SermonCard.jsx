import { useState } from 'react'
import { PlayCircle, Pause } from 'lucide-react'
import { formatDate } from '../lib/useApiData'

const AUDIO_FILE_PATTERN = /\.(mp3|wav|m4a|ogg|aac)(\?|$)/i

export default function SermonCard({ sermon: s, index = 0 }) {
  const [playingAudio, setPlayingAudio] = useState(false)
  const isDirectAudioFile = s.audioUrl && AUDIO_FILE_PATTERN.test(s.audioUrl)

  const handleListen = (e) => {
    if (isDirectAudioFile) {
      e.preventDefault()
      setPlayingAudio((p) => !p)
    }
    // otherwise (Spotify/Telegram/SoundCloud/etc.) let the link open normally —
    // those platforms need their own player, we can't embed & autoplay them
  }

  return (
    <div className="card-hover-zoom group overflow-hidden rounded-2xl border border-brown-100 bg-white shadow-sm dark:border-brown-700 dark:bg-brown-800">
      <div className="relative h-48 overflow-hidden bg-brown-700">
        <img
          src={s.thumbnailUrl || `https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=800&auto=format&fit=crop&sig=${index}`}
          alt={s.title}
          className="h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-ink/30 opacity-0 transition-opacity group-hover:opacity-100">
          <PlayCircle className="h-12 w-12 text-orange-300" />
        </div>
        {s.topic && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/70 px-3 py-1 text-[10px] text-orange-300">
            {s.topic}
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-ink/70 px-3 py-1 text-[10px] text-cream/80">
          {s.videoUrl ? 'Video' : s.audioUrl ? 'Audio' : ''}
        </span>
      </div>
      <div className="p-6">
        <p className="eyebrow text-[10px] text-orange-500">{formatDate(s.date)}</p>
        <h3 className="mt-2 font-display text-lg font-bold text-brown-700 dark:text-cream">{s.title}</h3>
        <p className="mt-1 text-xs text-brown-500 dark:text-cream/50">{s.speaker}</p>

        <div className="mt-5 flex flex-wrap gap-4 eyebrow text-[10px] text-brown-500 dark:text-cream/60">
          {s.videoUrl ? (
            <a href={s.videoUrl} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500">Watch</a>
          ) : (
            <span className="opacity-40">Watch</span>
          )}
          {s.audioUrl ? (
            <a
              href={s.audioUrl}
              target={isDirectAudioFile ? undefined : '_blank'}
              rel="noopener noreferrer"
              onClick={handleListen}
              className="flex items-center gap-1 hover:text-orange-500"
            >
              {isDirectAudioFile && (playingAudio ? <Pause className="h-3 w-3" /> : <PlayCircle className="h-3 w-3" />)}
              Listen
            </a>
          ) : (
            <span className="opacity-40">Listen</span>
          )}
          {s.downloadUrl ? (
            <a href={s.downloadUrl} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500">Download</a>
          ) : (
            <span className="opacity-40">Download</span>
          )}
        </div>

        {playingAudio && isDirectAudioFile && (
          <audio controls autoPlay src={s.audioUrl} className="mt-4 h-9 w-full">
            Your browser doesn't support inline audio playback.
          </audio>
        )}
      </div>
    </div>
  )
}
