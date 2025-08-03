// "use client";

// import { useEffect, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { toast } from "@/components/ui/use-toast";

// const availablePlans = ["Basic", "Pro", "Enterprise"];

// export default function ProfilePage() {
//   const [restaurantName, setRestaurantName] = useState("");
//   const [managerName, setManagerName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [slogan, setSlogan] = useState("");
//   const [address, setAddress] = useState("");
//   const [plan, setPlan] = useState("Basic");

//   const [newAddress, setNewAddress] = useState("");
//   const [isProfileSet, setIsProfileSet] = useState(false);
//   //const restaurantId =
//   // typeof window !== "undefined" ? localStorage.getItem("restaurantId") : null;
//   const restaurantId = localStorage.getItem("restaurantId");
//   console.log("restaurantId:", restaurantId);
//   if (!restaurantId) {
//     console.error("restaurantId is not set in localStorage");
//   }

//   const API_URl = "http://localhost:3001";
//   useEffect(() => {
//     const fetchProfile = async () => {
//       if (!restaurantId) {
//         console.error("restaurantId is missing");
//         return;
//       }

//       try {
//         const res = await fetch(`${API_URl}/api/restaurant/${restaurantId}`);
//         if (!res.ok) {
//           console.log("Failed to fetch profile data:", res.statusText);
//           return;
//         }

//         const data = await res.json();
//         console.log("Fetched profile data:", data);

//         if (data && data.name) {
//           setRestaurantName(data.name);
//           setManagerName(data.manager);
//           setSlogan(data.slogan);
//           setEmail(data.email);
//           setPhone(data.phone);
//           setAddress(data.address);
//           setNewAddress(data.address);
//           setPlan(data.plan);
//           setIsProfileSet(true);
//         }
//       } catch (err) {
//         toast({
//           title: "Error",
//           description: "Failed to load profile",
//         });
//       }
//     };

//     fetchProfile();
//   }, [restaurantId]);

//   const handleAddressUpdate = async () => {
//     const res = await fetch(
//       `${API_URl}/api/restaurant/${restaurantId}/address`,
//       {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ address: newAddress }),
//       }
//     );
//     const updated = await res.json();
//     setAddress(updated.address);
//     setNewAddress(updated.address);

//     toast({
//       title: "Address Updated",
//       description: "Your restaurant address has been updated.",
//     });
//   };

//   const handleUpgrade = async (newPlan: string) => {
//     const res = await fetch(`${API_URl}/api/restaurant/${restaurantId}/plan`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ plan: newPlan }),
//     });
//     const updated = await res.json();
//     setPlan(updated.plan);

//     toast({
//       title: "Plan Updated",
//       description: `You've upgraded to the ${newPlan} plan.`,
//     });
//   };

//   const handleCreateProfile = async () => {
//     try {
//       const res = await fetch(`${API_URl}/api/restaurant/create`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: restaurantName,
//           manager: managerName,
//           email,
//           phone,
//           address,
//           slogan,
//           plan,
//         }),
//       });

//       const data = await res.json();
//       localStorage.setItem("restaurantId", data.restaurantId);
//       setIsProfileSet(true);

//       toast({
//         title: "Profile Created",
//         description: "Your restaurant profile has been created.",
//       });
//     } catch (err) {
//       toast({
//         title: "Error",
//         description: "Failed to create profile.",
//       });
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto py-12 px-4">
//       <h1 className="text-3xl font-bold mb-8">Restaurant Profile</h1>

//       {isProfileSet ? (
//         <>
//           <Card className="mb-6">
//             <CardContent className="p-6 space-y-4">
//               <div>
//                 <Label className="text-muted-foreground">Restaurant Name</Label>
//                 <p className="text-lg font-medium">{restaurantName}</p>
//               </div>

//               <div>
//                 <Label className="text-muted-foreground">Manager Name</Label>
//                 <p className="text-lg font-medium">{managerName}</p>
//               </div>

//               <div>
//                 <Label className="text-muted-foreground">Email</Label>
//                 <p className="text-lg">{email}</p>
//               </div>

//               <div>
//                 <Label className="text-muted-foreground">Phone</Label>
//                 <p className="text-lg">{phone}</p>
//               </div>

//               <div>
//                 <Label className="text-muted-foreground">Slogan</Label>
//                 <p className="text-lg italic">{slogan}</p>
//               </div>

//               <div>
//                 <Label htmlFor="address">Address</Label>
//                 <Input
//                   id="address"
//                   value={newAddress}
//                   onChange={(e) => setNewAddress(e.target.value)}
//                 />
//                 <Button onClick={handleAddressUpdate} className="mt-2">
//                   Save Address
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6 space-y-4">
//               <div>
//                 <Label className="text-muted-foreground">Current Plan</Label>
//                 <p className="text-lg font-semibold text-primary">{plan}</p>
//               </div>

//               <div>
//                 <Label className="text-muted-foreground mb-2 block">
//                   Upgrade Plan
//                 </Label>
//                 <div className="flex flex-wrap gap-2">
//                   {availablePlans
//                     .filter((p) => p !== plan)
//                     .map((p) => (
//                       <Button
//                         key={p}
//                         variant="outline"
//                         onClick={() => handleUpgrade(p)}
//                       >
//                         Upgrade to {p}
//                       </Button>
//                     ))}
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </>
//       ) : (
//         <Card>
//           <CardContent className="p-6 space-y-4">
//             <div>
//               <Label>Restaurant Name</Label>
//               <Input
//                 value={restaurantName}
//                 onChange={(e) => setRestaurantName(e.target.value)}
//               />
//             </div>

//             <div>
//               <Label>Manager Name</Label>
//               <Input
//                 value={managerName}
//                 onChange={(e) => setManagerName(e.target.value)}
//               />
//             </div>

//             <div>
//               <Label>Email</Label>
//               <Input value={email} onChange={(e) => setEmail(e.target.value)} />
//             </div>

//             <div>
//               <Label>Phone</Label>
//               <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
//             </div>

//             <div>
//               <Label>Address</Label>
//               <Input
//                 value={address}
//                 onChange={(e) => setAddress(e.target.value)}
//               />
//             </div>

//             <div>
//               <Label>Slogan</Label>
//               <Input
//                 value={slogan}
//                 onChange={(e) => setSlogan(e.target.value)}
//               />
//             </div>

//             <div>
//               <Label>Choose Plan</Label>
//               <div className="flex flex-wrap gap-2">
//                 {availablePlans.map((p) => (
//                   <Button
//                     key={p}
//                     variant={p === plan ? "default" : "outline"}
//                     onClick={() => setPlan(p)}
//                   >
//                     {p}
//                   </Button>
//                 ))}
//               </div>
//             </div>

//             <Button onClick={handleCreateProfile}>Submit</Button>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

const API_URL = "http://localhost:3001"; // or your backend URL

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
        <Label>Manager Name</Label>
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
