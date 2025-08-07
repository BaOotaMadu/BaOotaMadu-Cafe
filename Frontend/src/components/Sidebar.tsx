// REMOVED: "use client"; - This is a Next.js directive.

import React, { useState } from 'react';
// 👇 1. IMPORT FROM 'react-router-dom' INSTEAD OF 'next/link'
import { Link, useLocation } from 'react-router-dom'; 

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, TableProperties, BookOpen, PieChart, Settings, Menu as MenuIcon, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  // 👇 2. USE 'useLocation' FROM REACT ROUTER
  const location = useLocation();
  const pathname = location.pathname; // Get the pathname from the location object

  const toggleSidebar = () => setCollapsed(!collapsed);

  const navItems = [
    // ... (This array does not need to change) ...
    { title: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { title: 'Tables & Orders', icon: <TableProperties size={20} />, path: '/tables' },
    { title: 'Menu Management', icon: <MenuIcon size={20} />, path: '/menu' },
    { title: 'Reports', icon: <PieChart size={20} />, path: '/reports' },
    { title: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <div className={cn(
      'h-screen bg-navy text-white transition-all duration-300 relative', 
      collapsed ? 'w-20' : 'w-64',
      className
    )}>
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        {!collapsed && (
          <h1 className="text-lg font-bold font-montserrat">MenuZen</h1>
        )}
        {collapsed && (
          <div className="w-full flex justify-center">
            <span className="text-xl font-bold">MZ</span>
          </div>
        )}
        <button 
          onClick={toggleSidebar} 
          className="p-1 rounded-full hover:bg-sidebar-accent"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.title}>
                {/* 👇 3. THIS <Link> COMPONENT IS NOW FROM REACT ROUTER */}
                <Link 
                  to={item.path} // Use `to` instead of `href`
                  className={cn(
                    'flex items-center px-4 py-2 rounded-md hover:bg-sidebar-accent transition-colors',
                    isActive && 'bg-sidebar-accent',
                    collapsed && 'justify-center px-2'
                  )}
                >
                  <span>{item.icon}</span>
                  {!collapsed && <span className="ml-3">{item.title}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ... (rest of the component remains the same) ... */}
    </div>
  );
};

export default Sidebar;