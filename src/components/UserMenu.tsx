
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const UserMenu = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!profile) return '/dashboard';
    
    switch (profile.role) {
      case 'admin':
        return '/admin-dashboard';
      case 'fornitore':
        return '/provider-dashboard';
      default:
        return '/dashboard';
    }
  };

  const getUserDisplayName = () => {
    if (profile?.first_name || profile?.last_name) {
      return `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    }
    return user?.email?.split('@')[0] || 'Utente';
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span className="hidden md:inline">{getUserDisplayName()}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link to={getDashboardLink()} className="flex items-center w-full">
            <User className="h-4 w-4 mr-2" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} className="flex items-center w-full">
          <LogOut className="h-4 w-4 mr-2" />
          Esci
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
