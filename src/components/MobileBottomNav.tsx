
import { Link, useLocation } from "react-router-dom";
import { Home, Search, Heart, User, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCapacitor } from "@/hooks/useCapacitor";

const MobileBottomNav = () => {
  const location = useLocation();
  const { user, profile } = useAuth();
  const { isNative } = useCapacitor();

  if (!isNative) return null;

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/search", icon: Search, label: "Cerca" },
    { path: "/favorites", icon: Heart, label: "Preferiti", requireAuth: true },
    { 
      path: user ? (profile?.role === 'admin' ? '/admin-dashboard' : profile?.role === 'provider' ? '/provider-dashboard' : '/dashboard') : '/auth', 
      icon: user ? User : User, 
      label: user ? "Profilo" : "Accedi" 
    },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-inset-bottom">
      <div className="flex justify-around items-center py-2 px-4">
        {navItems.map((item) => {
          if (item.requireAuth && !user) return null;
          
          const IconComponent = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 transition-colors ${
                active 
                  ? "text-[#8B4A6B]" 
                  : "text-gray-500 hover:text-[#8B4A6B]"
              }`}
              aria-label={item.label}
            >
              <IconComponent className={`h-5 w-5 ${active ? "fill-current" : ""}`} />
              <span className="text-xs mt-1 truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
