// "use client";

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Bell, Search, ChevronDown, User } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// const Navbar = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token"); // Remove JWT or auth token
//     localStorage.removeItem("restaurantId"); // Remove restaurantId if stored
//     navigate("/login"); // Redirect to login page
//   };

//   return (
//     <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 sticky top-0 z-10">
//       <div className="flex items-center w-1/3">
//         <div className="relative">
//           <Search
//             className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//             size={18}
//           />
//           <input
//             type="text"
//             placeholder="Search..."
//             className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent w-full max-w-xs"
//           />
//         </div>
//       </div>

//       <div className="flex items-center gap-4">
//         <button className="relative p-2 rounded-full hover:bg-gray-100">
//           <Bell size={20} />
//           <span className="absolute top-1 right-1 w-2 h-2 bg-orange rounded-full"></span>
//         </button>

//         <DropdownMenu>
//           <DropdownMenuTrigger className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 outline-none">
//             <div className="h-8 w-8 bg-navy rounded-full flex items-center justify-center text-white">
//               <User size={14} />
//             </div>
//             <div className="hidden sm:block text-left">
//               <p className="text-sm font-medium">Admin User</p>
//               <p className="text-xs text-gray-500">Restaurant Owner</p>
//             </div>
//             <ChevronDown size={16} className="text-gray-400" />
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end" className="w-56">
//             <DropdownMenuLabel>My Account</DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>Profile</DropdownMenuItem>
//             <DropdownMenuItem>Settings</DropdownMenuItem>
//             <DropdownMenuItem>Billing</DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//     </div>
//   );
// };

// export default Navbar;

"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, ChevronDown, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const navigate = useNavigate();
  const [restaurantName, setRestaurantName] = useState("");
  const [managerName, setManagerName] = useState("");

  useEffect(() => {
    const profile = localStorage.getItem("restaurantProfile");
    if (profile) {
      const parsed = JSON.parse(profile);
      setRestaurantName(parsed.name);
      setManagerName(parsed.manager);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("restaurantId");
    localStorage.removeItem("restaurantProfile");
    navigate("/login");
  };

  return (
    <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center w-1/3">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent w-full max-w-xs"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-orange rounded-full"></span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 outline-none">
            <div className="h-8 w-8 bg-navy rounded-full flex items-center justify-center text-white">
              <User size={14} />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium">{managerName || "Admin"}</p>
              <p className="text-xs text-gray-500">
                {restaurantName || "Restaurant Owner"}
              </p>
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
