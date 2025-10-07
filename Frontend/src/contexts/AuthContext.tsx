import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3001"; // Replace with your actual API URL

interface AuthContextType {
  user: any; // You can replace 'any' with your RestaurantProfile type
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Renamed for clarity: This function now fetches the specific restaurant profile
  const fetchRestaurantProfile = useCallback(
    async (token: string, restaurantId: string) => {
      try {
        // Use the token to authorize the request for the profile
        const res = await axios.get(
          `${API_URL}/api/restaurant/${restaurantId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const profileData = res.data;
        setUser(profileData); // Set the full profile as the user state
        localStorage.setItem("restaurantProfile", JSON.stringify(profileData));
      } catch (error) {
        console.error(
          "Failed to fetch restaurant profile, logging out.",
          error
        );
        // If fetching the profile fails, the session is invalid.
        logout();
      }
    },
    []
  ); // Added logout to dependencies if you use it inside

  // On initial app load, check for all necessary data
  useEffect(() => {
    const token = localStorage.getItem("token");
    const restaurantId = localStorage.getItem("restaurantId");

    if (token && restaurantId) {
      // If we have both token and ID, fetch the profile to re-establish the session
      fetchRestaurantProfile(token, restaurantId).finally(() =>
        setLoading(false)
      );
    } else {
      setLoading(false); // No token/ID, stop loading
    }
  }, [fetchRestaurantProfile]);

  // Login function - UPDATED WITH YOUR SPECIFIC LOGIC
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      // 1. Destructure both token and restaurantId from the login response
      const { token, restaurantId } = res.data;

      if (token && restaurantId) {
        // 2. Save token and restaurantId immediately
        localStorage.setItem("token", token);
        localStorage.setItem("restaurantId", restaurantId);

        // 3. Fetch the full restaurant profile using the new token and ID
        await fetchRestaurantProfile(token, restaurantId);

        // 4. Navigate home after profile is fetched and state is set
        navigate("/");
      } else {
        throw new Error("Login response did not include token or restaurantId");
      }
    } catch (error) {
      console.error("Login failed", error);
      alert("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Logout function - now clears everything
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("restaurantId");
    localStorage.removeItem("restaurantProfile");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
