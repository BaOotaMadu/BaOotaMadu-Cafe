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

  const handleLogin = async () => {
    try {
      const res = await axios.post(`http://localhost:3001/auth/login`, {
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
        const res = await fetch(
          `http://localhost:3001/api/restaurant/${restaurantId}`
        );
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
