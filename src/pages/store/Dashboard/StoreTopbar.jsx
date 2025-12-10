import { Bell, UserCircle, Search } from "lucide-react";
import { ThemeToggle } from "../../../components/theme-toggle";
import { Input } from "../../../components/ui/input";

export default function StoreTopbar() {
  return (
    <header className="w-full h-16 bg-white border-b border-gray-200 flex items-center px-6 justify-between shadow-md">
      
      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <Input
          placeholder="Search..."
          className="w-full rounded-xl border border-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
        />
      </div>

      {/* Right side: Theme, Notifications, Profile */}
      <div className="flex items-center gap-6">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <button className="relative group">
          <Bell className="text-gray-600 w-6 h-6 group-hover:text-gray-800 transition-colors" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center shadow-sm">
            3
          </span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shadow-inner">
            <UserCircle className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-semibold text-gray-800">Store Admin</span>
            <span className="text-xs text-gray-500">admin@store.com</span>
          </div>
        </div>
      </div>
    </header>
  );
}
