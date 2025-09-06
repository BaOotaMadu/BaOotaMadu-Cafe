import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

//const API_URL = "http://localhost:3001"; // or your backend URL
const API_URL =
  import.meta.env.VITE_API_BASE || "https://baootamadu.onrender.com"; // Replace with your actual API URL
const RestaurantProfile = () => {
  const [restaurantName, setRestaurantName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [slogan, setSlogan] = useState("");
  const [plan, setPlan] = useState("");
  const [isProfileSet, setIsProfileSet] = useState(false);

  const restaurantId = localStorage.getItem("restaurantId");

  // Fetch restaurant details if ID exists
  useEffect(() => {
    if (!restaurantId) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/restaurant/${restaurantId}`);
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();

        setRestaurantName(data.name || "");
        setManagerName(data.manager || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setAddress(data.address || "");
        setSlogan(data.slogan || "");
        setPlan(data.plan || "");
        setIsProfileSet(true);
      } catch (err) {
        console.error("Fetch profile error:", err);
      }
    };

    fetchProfile();
  }, [restaurantId]);

  const handleSaveProfile = async () => {
    try {
      if (!email) {
        throw new Error("Email not found");
      }

      const res = await fetch(`${API_URL}/api/restaurant/update-by-email`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name: restaurantName,
          manager: managerName,
          phone,
          address,
          slogan,
          plan,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update");
      }

      const updated = await res.json();

      toast({
        title: "Profile Saved",
        description: "Restaurant profile updated successfully.",
      });

      setIsProfileSet(true); // optional: track profile completion
    } catch (err) {
      console.error("Save error:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to save profile.",
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-xl shadow-sm space-y-4">
      <h2 className="text-2xl font-bold mb-2">Restaurant Profile</h2>

      <div className="space-y-1">
        <Label>Restaurant Name</Label>
        <Input
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <Label>Manager Name </Label>
        <Input
          value={managerName}
          onChange={(e) => setManagerName(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <Label>Email</Label>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div className="space-y-1">
        <Label>Phone</Label>
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      <div className="space-y-1">
        <Label>Address</Label>
        <Input value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>

      <div className="space-y-1">
        <Label>Slogan</Label>
        <Input value={slogan} onChange={(e) => setSlogan(e.target.value)} />
      </div>

      <div className="space-y-1">
        <Label>Plan</Label>
        <Input value={plan} onChange={(e) => setPlan(e.target.value)} />
      </div>

      <Button onClick={handleSaveProfile} className="mt-4">
        Save Profile
      </Button>
    </div>
  );
};

export default RestaurantProfile;
