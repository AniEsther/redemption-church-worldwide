import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Mail,
  HandHeart,
  Users,
  Mic2,
  CalendarDays,
  ClipboardList,
  HeartHandshake,
  Quote,
  Images,
  UserCog,
  Building2,
  Settings,
  LogOut,
} from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext'

const NAV = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/messages', label: 'Messages', icon: Mail },
  { to: '/admin/prayer-requests', label: 'Prayer Requests', icon: HandHeart },
  { to: '/admin/subscribers', label: 'Subscribers', icon: Users },
  { to: '/admin/pastors', label: 'Pastors', icon: UserCog },
  { to: '/admin/branches', label: 'Branches', icon: Building2 },
  { to: '/admin/sermons', label: 'Sermons', icon: Mic2 },
  { to: '/admin/events', label: 'Events', icon: CalendarDays },
  { to: '/admin/event-registrations', label: 'Event Registrations', icon: ClipboardList },
  { to: '/admin/ministries', label: 'Ministries', icon: HeartHandshake },
  { to: '/admin/testimonies', label: 'Testimonies', icon: Quote },
  { to: '/admin/gallery', label: 'Gallery', icon: Images },
  { to: '/admin/settings', label: 'Site Settings', icon: Settings },
]

export default function AdminLayout() {
  const { authed, logout, sessionExpired } = useAdminAuth()
  const location = useLocation()

  if (!authed) {
    return <Navigate to="/admin/login" state={{ from: location.pathname, sessionExpired }} replace />
  }

  return (
    <div className="flex min-h-screen bg-cream dark:bg-ink">
      <aside className="hidden w-64 flex-shrink-0 flex-col bg-brown-800 text-cream lg:sticky lg:top-0 lg:flex lg:h-screen">
        <div className="px-6 py-6">
          <p className="font-display text-lg font-bold text-orange-200">Admin Dashboard</p>
          <p className="eyebrow mt-1 text-[10px] text-cream/50">Redemption Church</p>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive ? 'bg-orange-400 text-white' : 'text-cream/70 hover:bg-white/5 hover:text-cream'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={logout}
          className="mx-3 mb-6 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-cream/70 transition-colors hover:bg-white/5 hover:text-cream"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </aside>

      <div className="flex-1">
        <MobileNav logout={logout} />
        <main className="mx-auto max-w-5xl px-6 py-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function MobileNav({ logout }) {
  return (
    <div className="flex items-center justify-between border-b border-brown-100 bg-brown-800 px-4 py-3 text-cream lg:hidden">
      <p className="font-display text-sm font-bold text-orange-200">Admin Dashboard</p>
      <div className="flex items-center gap-3 overflow-x-auto">
        {NAV.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `whitespace-nowrap text-xs ${isActive ? 'text-orange-300' : 'text-cream/60'}`
            }
          >
            {label}
          </NavLink>
        ))}
        <button onClick={logout} className="whitespace-nowrap text-xs text-cream/60">
          Log Out
        </button>
      </div>
    </div>
  )
}
