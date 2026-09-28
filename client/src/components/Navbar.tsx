import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Building2,
  Briefcase,
  CheckSquare,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/utils/cn';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/leads', label: 'Leads', icon: Users },
  { to: '/contacts', label: 'Contacts', icon: UserCircle },
  { to: '/companies', label: 'Companies', icon: Building2 },
  { to: '/deals', label: 'Deals', icon: Briefcase },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { unreadCount } = useAppSelector((state) => state.notifications);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      {/* Mobile header */}
      <div
        className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:hidden"
        data-icod-id="src_components_navbar_tsx_6745">
        <div
          className="flex items-center gap-2"
          data-icod-id="src_components_navbar_tsx_3d24">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            data-icod-id="src_components_navbar_tsx_a7c1">
            <Menu className="h-5 w-5" data-icod-id="src_components_navbar_tsx_ce02" />
          </Button>
          <span
            className="text-lg font-bold text-foreground"
            data-icod-id="src_components_navbar_tsx_ad2f">ClientHub</span>
        </div>
        <div className="relative" data-icod-id="src_components_navbar_tsx_e28f">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            data-icod-id="src_components_navbar_tsx_addb">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground"
              data-icod-id="src_components_navbar_tsx_a754">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </Button>
          {userMenuOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-border bg-card p-1 shadow-lg"
              data-icod-id="src_components_navbar_tsx_2a7c">
              <div
                className="px-3 py-2 text-sm"
                data-icod-id="src_components_navbar_tsx_d00c">
                <p
                  className="font-medium text-foreground"
                  data-icod-id="src_components_navbar_tsx_349b">{user?.name}</p>
                <p
                  className="text-xs text-muted-foreground"
                  data-icod-id="src_components_navbar_tsx_7992">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-muted"
                data-icod-id="src_components_navbar_tsx_564c">
                <LogOut className="h-4 w-4" data-icod-id="src_components_navbar_tsx_61e3" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-foreground/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          data-icod-id="src_components_navbar_tsx_d28d" />
      )}
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-border bg-card transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        data-icod-id="src_components_navbar_tsx_d4eb">
        <div
          className="flex h-16 items-center justify-between border-b border-border px-4"
          data-icod-id="src_components_navbar_tsx_4e37">
          <span
            className="text-xl font-bold text-foreground"
            data-icod-id="src_components_navbar_tsx_1c58">ClientHub</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
            data-icod-id="src_components_navbar_tsx_3e81">
            <X className="h-5 w-5" data-icod-id="src_components_navbar_tsx_c90a" />
          </Button>
        </div>

        <nav
          className="flex-1 overflow-y-auto p-3"
          data-icod-id="src_components_navbar_tsx_a836">
          <ul className="space-y-1" data-icod-id="src_components_navbar_tsx_214a">
            {navItems.map((item) => (
              <li key={item.to} data-icod-id={`src_components_navbar_tsx_9a00_${item.to}`}>
                <NavLink
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )
                  }
                  data-icod-id={`src_components_navbar_tsx_4740_${item.to}`}>
                  <item.icon className="h-5 w-5" />
                  {item.label}
                  {item.to === '/notifications' && unreadCount > 0 && (
                    <span
                      className="ml-auto flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-medium text-destructive-foreground"
                      data-icod-id={`src_components_navbar_tsx_803f_${item.to}`}>
                      {unreadCount}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div
          className="border-t border-border p-3"
          data-icod-id="src_components_navbar_tsx_9748">
          <div
            className="flex items-center gap-3 rounded-lg px-3 py-2"
            data-icod-id="src_components_navbar_tsx_6c3a">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground"
              data-icod-id="src_components_navbar_tsx_c735">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div
              className="flex-1 overflow-hidden"
              data-icod-id="src_components_navbar_tsx_c755">
              <p
                className="truncate text-sm font-medium text-foreground"
                data-icod-id="src_components_navbar_tsx_0186">{user?.name}</p>
              <p
                className="truncate text-xs text-muted-foreground"
                data-icod-id="src_components_navbar_tsx_0c6c">{user?.email}</p>
            </div>
            <div className="relative" data-icod-id="src_components_navbar_tsx_54c0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                data-icod-id="src_components_navbar_tsx_09e5">
                <ChevronDown className="h-4 w-4" data-icod-id="src_components_navbar_tsx_7794" />
              </Button>
              {userMenuOpen && (
                <div
                  className="absolute bottom-full right-0 mb-2 w-48 rounded-lg border border-border bg-card p-1 shadow-lg"
                  data-icod-id="src_components_navbar_tsx_01e9">
                  <div
                    className="px-3 py-2 text-sm lg:hidden"
                    data-icod-id="src_components_navbar_tsx_3302">
                    <p
                      className="font-medium text-foreground"
                      data-icod-id="src_components_navbar_tsx_f34d">{user?.name}</p>
                    <p
                      className="text-xs text-muted-foreground"
                      data-icod-id="src_components_navbar_tsx_7d59">{user?.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-muted"
                    data-icod-id="src_components_navbar_tsx_3045">
                    <LogOut className="h-4 w-4" data-icod-id="src_components_navbar_tsx_4481" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
