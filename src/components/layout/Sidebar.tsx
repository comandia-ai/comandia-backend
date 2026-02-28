import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  MessageCircle,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { useAppStore } from '@/hooks/useStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, labelKey: 'nav.dashboard' as const },
  { path: '/orders', icon: ShoppingCart, labelKey: 'nav.orders' as const },
  { path: '/products', icon: Package, labelKey: 'nav.products' as const },
  { path: '/customers', icon: Users, labelKey: 'nav.customers' as const },
  { path: '/whatsapp', icon: MessageCircle, labelKey: 'nav.whatsapp' as const },
  { path: '/analytics', icon: BarChart3, labelKey: 'nav.analytics' as const },
  { path: '/settings', icon: Settings, labelKey: 'nav.settings' as const },
];

export function Sidebar() {
  const location = useLocation();
  const { t } = useLanguage();
  const { sidebarCollapsed, toggleSidebar, currentTenant, currentUser, logout } = useAppStore();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-white border-r border-slate-200 transition-all duration-300 flex flex-col',
        sidebarCollapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      {/* Logo & Brand */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2">
            <img src="/comandia-logo.jpeg" alt="Comandia" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-bold text-lg text-slate-800">Comandia</span>
          </div>
        )}
        {sidebarCollapsed && (
          <img src="/comandia-logo.jpeg" alt="Comandia" className="w-8 h-8 rounded-lg object-cover mx-auto" />
        )}
        <button
          onClick={toggleSidebar}
          className={cn(
            'p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors',
            sidebarCollapsed && 'absolute -right-3 top-6 bg-white border border-slate-200 shadow-sm'
          )}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Tenant Info */}
      {currentTenant && (
        <div className={cn('px-3 py-3 border-b border-slate-200', sidebarCollapsed && 'px-2')}>
          <div
            className={cn(
              'flex items-center gap-3 p-2 rounded-lg bg-slate-50',
              sidebarCollapsed && 'justify-center'
            )}
          >
            {currentTenant.logo ? (
              <img
                src={currentTenant.logo}
                alt={currentTenant.name}
                className="w-8 h-8 rounded-lg object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-primary" />
              </div>
            )}
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{currentTenant.name}</p>
                <p className="text-xs text-slate-500 truncate">{currentTenant.businessType}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                sidebarCollapsed && 'justify-center px-2'
              )}
              title={sidebarCollapsed ? t(item.labelKey) : undefined}
            >
              <item.icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-primary')} />
              {!sidebarCollapsed && <span>{t(item.labelKey)}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="border-t border-slate-200 p-3">
        {currentUser && (
          <div
            className={cn(
              'flex items-center gap-3 p-2 rounded-lg',
              sidebarCollapsed && 'justify-center'
            )}
          >
            <Avatar className="w-9 h-9">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {getInitials(currentUser.name)}
              </AvatarFallback>
            </Avatar>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{currentUser.name}</p>
                <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
              </div>
            )}
          </div>
        )}
        <button
          onClick={logout}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 mt-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors',
            sidebarCollapsed && 'justify-center px-2'
          )}
          title={sidebarCollapsed ? t('nav.logout') : undefined}
        >
          <LogOut className="w-5 h-5" />
          {!sidebarCollapsed && <span>{t('nav.logout')}</span>}
        </button>
      </div>
    </aside>
  );
}
