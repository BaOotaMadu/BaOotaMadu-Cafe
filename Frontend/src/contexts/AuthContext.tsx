import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

//const API_URL = "http://localhost:3001";
const API_URL =
  import.meta.env.VITE_API_BASE || "https://baootamadu.onrender.com"; // Replace with your actual API URL
// Define the shape of the context data
interface AuthContextType {
  user: any; // You can replace 'any' with your User type
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | null>(null);

// Create the Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Start as true to check for existing token
  const navigate = useNavigate();

  const fetchUserProfile = useCallback(async (token: string) => {
    try {
      const res = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data); // Set the user in state
    } catch (error) {
      console.error("Token validation failed, logging out.", error);
      localStorage.removeItem("token"); // Invalid token, remove it
    }
  }, []);

  // On initial app load, check if a token exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserProfile(token).finally(() => setLoading(false));
    } else {
      setLoading(false); // No token, stop loading
    }
  }, [fetchUserProfile]);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const { token } = res.data;

      if (token) {
        localStorage.setItem("token", token); // Save token
        await fetchUserProfile(token); // Fetch profile and set user
        navigate("/"); // Navigate to home
      }
    } catch (error) {
      console.error("Login failed", error);
      alert("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
