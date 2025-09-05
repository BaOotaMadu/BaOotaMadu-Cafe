// // REMOVED: "use client"; - This is a Next.js directive.

// import React, { useState } from 'react';
// // 👇 1. IMPORT FROM 'react-router-dom' INSTEAD OF 'next/link'
// import { Link, useLocation } from 'react-router-dom'; 

// import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
// import { Button } from '@/components/ui/button';
// import { LayoutDashboard, TableProperties, BookOpen, PieChart, Settings, Menu as MenuIcon, ChevronRight, ChevronLeft,Speech } from 'lucide-react';
// import { cn } from '@/lib/utils';

// interface SidebarProps {
//   className?: string;
// }

// const Sidebar = ({ className }: SidebarProps) => {
//   const [collapsed, setCollapsed] = useState(false);
//   // 👇 2. USE 'useLocation' FROM REACT ROUTER
//   const location = useLocation();
//   const pathname = location.pathname; // Get the pathname from the location object

//   const toggleSidebar = () => setCollapsed(!collapsed);

//   const navItems = [
//     // ... (This array does not need to change) ...
//     { title: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
//     { title: 'Tables & Orders', icon: <TableProperties size={20} />, path: '/tables' },
//     { title: 'Menu Management', icon: <MenuIcon size={20} />, path: '/menu' },
//     { title: 'Reports', icon: <PieChart size={20} />, path: '/reports' },
//     { title: 'Settings', icon: <Settings size={20} />, path: '/settings' },
//     { title: 'Feedback', icon: <Speech size={20} />, path: '/feedback' },
//   ];

//   return (
//     <div className={cn(
//       'h-screen bg-navy text-white transition-all duration-300 relative', 
//       collapsed ? 'w-20' : 'w-64',
//       className
//     )}>
//       <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
//         {!collapsed && (
//             <div className="h-25 w-25 rounded-full  flex items-center justify-center">
//                 <img src="/11.png" alt="BoM logo" /> 
//               </div>       )}
//         {collapsed && (
//           <div className="w-full flex justify-center">
//             <span className="text-xl font-bold">BOM</span>
//           </div>
//         )}
//         <button 
//           onClick={toggleSidebar} 
//           className="p-1 rounded-full hover:bg-sidebar-accent"
//           aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
//         >
//           {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
//         </button>
//       </div>

//       <nav className="p-4">
//         <ul className="space-y-2">
//           {navItems.map((item) => {
//             const isActive = pathname === item.path;
//             return (
//               <li key={item.title}>
//                 {/* 👇 3. THIS <Link> COMPONENT IS NOW FROM REACT ROUTER */}
//                 <Link 
//                   to={item.path} // Use `to` instead of `href`
//                   className={cn(
//                     'flex items-center px-4 py-2 rounded-md hover:bg-sidebar-accent transition-colors',
//                     isActive && 'bg-sidebar-accent',
//                     collapsed && 'justify-center px-2'
//                   )}
//                 >
//                   <span>{item.icon}</span>
//                   {!collapsed && <span className="ml-3">{item.title}</span>}
//                 </Link>
//               </li>
//             );
//           })}
//         </ul>
//       </nav>

//       {/* ... (rest of the component remains the same) ... */}
//     </div>
//   );
// };

// export default Sidebar;

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, TableProperties, BookOpen, PieChart, Settings, Menu, ChevronRight, ChevronLeft, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const location = useLocation();
  const pathname = location.pathname;

  const toggleSidebar = () => setCollapsed(!collapsed);

  const navItems = [
    { title: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { title: 'Tables & Orders', icon: <TableProperties size={20} />, path: '/tables' },
    { title: 'Menu Management', icon: <Menu size={20} />, path: '/menu' },
    { title: 'Reports', icon: <PieChart size={20} />, path: '/reports' },
    { title: 'Settings', icon: <Settings size={20} />, path: '/settings' },
    { title: 'Feedback', icon: <MessageSquare size={20} />, path: '/feedback' },
  ];

  return (
    <>
      {/* Mobile Menu Button - Shows only on mobile */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <div className="relative group">
              <Button
                variant="outline"
                size="icon"
                className="bg-navy/90 backdrop-blur-sm text-white border-white/20 hover:bg-orange hover:border-orange/50 transition-all duration-500 shadow-lg hover:shadow-xl hover:scale-110 rounded-xl w-12 h-12"
              >
                <div className="relative">
                  {/* Custom animated grid/dots icon instead of hamburger */}
                  <div className={`w-6 h-6 transition-all duration-500 ${mobileMenuOpen ? 'rotate-45 scale-110' : ''}`}>
                    {!mobileMenuOpen ? (
                      // Grid dots when closed
                      <div className="grid grid-cols-3 gap-1 w-full h-full">
                        {[...Array(9)].map((_, i) => (
                          <div 
                            key={i} 
                            className="w-1 h-1 bg-current rounded-full transition-all duration-300 animate-pulse"
                            style={{ animationDelay: `${i * 100}ms` }}
                          />
                        ))}
                      </div>
                    ) : (
                      // X when opened
                      <div className="relative w-full h-full flex items-center justify-center">
                        <div className="w-4 h-0.5 bg-current absolute rotate-45 transition-all duration-300"></div>
                        <div className="w-4 h-0.5 bg-current absolute -rotate-45 transition-all duration-300"></div>
                      </div>
                    )}
                  </div>
                </div>
              </Button>
              
              {/* Enhanced hover tooltip with animation */}
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-gradient-to-r from-black/90 to-gray-800/90 text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl border border-white/10 transform group-hover:translate-x-1">
                {mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-black/90"></div>
              </div>

              {/* Floating pulse ring effect */}
              <div className="absolute inset-0 rounded-xl border-2 border-orange/30 opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
            </div>
          </SheetTrigger>
          
          {/* Mobile Menu Content */}
          <SheetContent side="left" className="w-64 bg-gradient-to-b from-navy to-navy/95 text-white border-white/20 p-0">
            <div className="p-4 border-b border-white/20">
              <div className="h-25 w-25 rounded-full flex items-center justify-center">
                <img src="/11.png" alt="BoM logo" className="drop-shadow-lg animate-pulse" />
              </div>
            </div>
            <nav className="p-4">
              <ul className="space-y-2">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.path;
                  return (
                    <li key={item.title} className="transform transition-all duration-300" style={{ animationDelay: `${index * 100}ms` }}>
                      <Link
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 hover:translate-x-1 group',
                          isActive && 'bg-orange/20 text-orange border-l-4 border-orange shadow-lg'
                        )}
                      >
                        <span className="transition-transform duration-300 group-hover:scale-110">{item.icon}</span>
                        <span className="ml-3 font-medium">{item.title}</span>
                        {isActive && <div className="ml-auto w-2 h-2 bg-orange rounded-full animate-pulse"></div>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar - Hidden on mobile */}
      <div className={cn(
        'hidden md:flex h-screen bg-gradient-to-b from-navy to-navy/95 text-white transition-all duration-500 ease-in-out relative shadow-xl',
        collapsed ? 'w-20' : 'w-64',
        className
      )}>
        <div className="flex flex-col w-full">
          <div className="p-4 flex items-center justify-between border-b border-white/20">
            {!collapsed && (
              <div className="h-25 w-25 rounded-full flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                <img src="/11.png" alt="BoM logo" className="drop-shadow-lg" />
              </div>
            )}
            {collapsed && (
              <div className="w-full flex justify-center group">
                <div className="w-12 h-12 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <img src="/11.png" alt="BoM logo" className="w-10 h-10 object-contain drop-shadow-lg" />
                </div>
              </div>
            )}
            <div className="relative group">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-110 hover:rotate-180 transform"
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {collapsed ? (
                  <ChevronRight size={18} className="transition-transform duration-300" />
                ) : (
                  <ChevronLeft size={18} className="transition-transform duration-300" />
                )}
              </button>
              
              {/* Hover tooltip for toggle button */}
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {collapsed ? "Expand" : "Collapse"}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-black/80"></div>
              </div>
            </div>
          </div>

          <nav className="p-4 flex-1">
            <ul className="space-y-3">
              {navItems.map((item, index) => {
                const isActive = pathname === item.path;
                return (
                  <li key={item.title} className="relative group">
                    <Link
                      to={item.path}
                      className={cn(
                        'flex items-center px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 hover:translate-x-1 relative overflow-hidden',
                        isActive && 'bg-orange/20 text-orange shadow-lg',
                        collapsed && 'justify-center px-2'
                      )}
                      title={collapsed ? item.title : undefined}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange rounded-r-full"></div>
                      )}
                      
                      <span className={cn(
                        "transition-transform duration-300 group-hover:scale-110",
                        isActive && "text-orange"
                      )}>
                        {item.icon}
                      </span>
                      
                      {!collapsed && (
                        <>
                          <span className="ml-3 font-medium transition-all duration-300">{item.title}</span>
                          {isActive && (
                            <div className="ml-auto w-2 h-2 bg-orange rounded-full animate-pulse"></div>
                          )}
                        </>
                      )}
                      
                      {/* Ripple effect */}
                      <div className="absolute inset-0 bg-white/5 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
                    </Link>
                    
                    {/* Tooltip for collapsed state */}
                    {collapsed && (
                      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-black/90 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                        {item.title}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-black/90"></div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
          
          {/* Floating indicator for collapsed state */}
          {collapsed && (
            <div className="absolute top-1/2 -right-1 w-2 h-8 bg-orange/30 rounded-r-full animate-pulse"></div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;