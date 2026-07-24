import { MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function MessageButton() {
  return (
    <Link
      to="/contact"
      aria-label="Send a message to the church"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-orange-400 text-white shadow-xl transition-transform hover:scale-110"
    >
      <MessageCircle className="h-6 w-6" />
    </Link>
  )
}
