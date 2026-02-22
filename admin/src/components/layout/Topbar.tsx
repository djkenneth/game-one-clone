import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';

export function Topbar() {
  const { user, logout } = useAuth();

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'AD';

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-6">
      <div />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-primary">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel className="font-normal">
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
