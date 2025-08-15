import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const API_BASE =
    import.meta.env.VITE_API_BASE || "https://baootamadu.onrender.com";
  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, {
        email,
        password,
      });

      const { token, restaurantId } = res.data;
      console.log("Login response:", res.data);

      if (!token || !restaurantId) {
        console.error("Login failed: No token or user data received");
        return alert("Login failed. Please check your credentials.");
      }
      if (token && restaurantId) {
        const res = await fetch(`${API_BASE}/api/restaurant/${restaurantId}`);
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        //console.log("Restaurant profile data:", data);
        localStorage.setItem("restaurantProfile", JSON.stringify(data));
        localStorage.setItem("token", token);
        localStorage.setItem("restaurantId", restaurantId);
        navigate("/"); // or /profile
      }
    } catch (err) {
      console.error("Login failed", err);
      alert("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to your restaurant account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
          </div>
          <Button className="w-full" size="lg" onClick={handleLogin}>
            Sign In
          </Button>
          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              Don't have an account?{" "}
            </span>
            <Link
              to="/signup"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Link } from "react-router-dom";
// import axios from "axios";

// // --- 1. Import hooks and actions from Redux ---
// import { useDispatch } from "react-redux";
// import { setToken } from "@/store/slices/authSlice";
// import { setUser } from "@/store/slices/userSlice";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   // --- 2. Get the dispatch function from the hook ---
//   const dispatch = useDispatch();

//   const handleLogin = async () => {
//     try {
//       const res = await axios.post(`http://localhost:3001/auth/login`, {
//         email,
//         password,
//       });

//       const { token, restaurantId } = res.data;
//       console.log("Login response:", res.data);

//       if (!token || !restaurantId) {
//         console.error("Login failed: No token or user data received");
//         return alert("Login failed. Please check your credentials.");
//       }

//       // This block runs only if login is successful
//       if (token && restaurantId) {
//         const profileRes = await fetch(
//           `http://localhost:3001/api/restaurant/${restaurantId}`
//         );

//         if (!profileRes.ok) throw new Error("Failed to fetch profile");
//         const data = await profileRes.json();

//         // Your existing localStorage logic (kept as requested)
//         localStorage.setItem("restaurantProfile", JSON.stringify(data));
//         localStorage.setItem("token", token);
//         localStorage.setItem("restaurantId", restaurantId);

//         // --- 3. Dispatch actions to update the Redux store ---
//         dispatch(setToken(token));
//         dispatch(setUser(data)); // Assuming 'data' is the user/profile object

//         navigate("/"); // Navigate after all state updates
//       }
//     } catch (err) {
//       console.error("Login failed", err);
//       alert("Invalid email or password");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
//       <Card className="w-full max-w-md">
//         <CardHeader className="text-center">
//           <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
//           <CardDescription>Sign in to your restaurant account</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               type="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full"
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="password">Password</Label>
//             <Input
//               id="password"
//               type="password"
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full"
//             />
//           </div>
//           <Button className="w-full" size="lg" onClick={handleLogin}>
//             Sign In
//           </Button>
//           <div className="text-center text-sm">
//             <span className="text-muted-foreground">
//               Don't have an account?{" "}
//             </span>
//             <Link
//               to="/signup"
//               className="text-primary hover:underline font-medium"
//             >
//               Sign up
//             </Link>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Login;

// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Link } from "react-router-dom";

// // --- The only hook we need for auth is our new useAuth hook ---
// import { useAuth } from "@/contexts/AuthContext"; // Adjust path if needed

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   // Get the login function and loading state from our AuthContext
//   const { login, loading } = useAuth();

//   const handleLogin = async (e: React.FormEvent) => {
//     // Prevent the default form submission behavior
//     e.preventDefault();
//     if (!email || !password) {
//       return alert("Please enter both email and password.");
//     }
//     // The login function now handles everything: API calls, state updates, and navigation
//     await login(email, password);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
//       <Card className="w-full max-w-md">
//         <CardHeader className="text-center">
//           <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
//           <CardDescription>Sign in to your restaurant account</CardDescription>
//         </CardHeader>
//         {/* Using a <form> element is better for accessibility */}
//         <form onSubmit={handleLogin}>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full"
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full"
//                 required
//               />
//             </div>
//             {/* The button is now disabled while loading to prevent multiple clicks */}
//             <Button type="submit" className="w-full" size="lg" disabled={loading}>
//               {loading ? "Signing In..." : "Sign In"}
//             </Button>
//             <div className="text-center text-sm">
//               <span className="text-muted-foreground">
//                 Don't have an account?{" "}
//               </span>
//               <Link
//                 to="/signup"
//                 className="text-primary hover:underline font-medium"
//               >
//                 Sign up
//               </Link>
//             </div>
//           </CardContent>
//         </form>
//       </Card>
//     </div>
//   );
// };

// export default Login;
