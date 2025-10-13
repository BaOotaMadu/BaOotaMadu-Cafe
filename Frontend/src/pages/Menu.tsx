// import { useEffect, useState } from "react";
// import { Plus, Search, FilterX, Upload } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import MenuItemCard from "@/components/MenuItemCard";
// import { useToast } from "@/hooks/use-toast";
// import { useForm } from "react-hook-form";

// interface MenuItem {
//   _id: string;
//   name: string;
//   category: string;
//   price: number;
//   available: boolean;
//   image_url: string;
// }

// interface MenuItemForm {
//   name: string;
//   category: string;
//   price: string;
//   image_url: string;
// }

// // ✅ FIXED: Removed trailing space
// const API_URL =
//   import.meta.env.VITE_API_BASE?.trim() || "http://localhost:3001";

// // ✅ FIXED: Cloudinary Upload — removed space in URL
// const uploadToCloudinary = async (file: File): Promise<string> => {
//   const data = new FormData();
//   data.append("file", file);
//   data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
//   data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

//   // ✅ No space before cloud name
//   const res = await fetch(
//     `https://api.cloudinary.com/v1_1/${
//       import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
//     }/image/upload`,
//     {
//       method: "POST",
//       body: data,
//     }
//   );

//   if (!res.ok) {
//     const errorText = await res.text();
//     console.error("Cloudinary upload failed:", errorText);
//     throw new Error("Cloudinary upload failed");
//   }

//   const json = await res.json();
//   let url = json.secure_url;

//   if (!url.startsWith("https://")) {
//     url = url.replace("http://", "https://");
//   }

//   console.log("✅ Uploaded Image URL:", url);
//   return url;
// };

// const Menu = () => {
//   const { toast } = useToast();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("all");
//   const [openAddDialog, setOpenAddDialog] = useState(false);
//   const [openEditDialog, setOpenEditDialog] = useState(false);
//   const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
//   const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

//   const restaurantId = localStorage.getItem("restaurantId");

//   useEffect(() => {
//     fetch(`${API_URL}/menu/${restaurantId}`)
//       .then((res) => res.json())
//       .then((data) => setMenuItems(data))
//       .catch(() =>
//         toast({
//           title: "Error",
//           description: "Failed to fetch menu items",
//           variant: "destructive",
//         })
//       );
//   }, []);

//   useEffect(() => {
//     if (menuItems.length > 0) {
//       const hasUnavailableItems = menuItems.some(
//         (item) => item.available === false || item.available === undefined
//       );

//       if (hasUnavailableItems) {
//         setMenuItems((prevItems) =>
//           prevItems.map((item) => ({
//             ...item,
//             available: item.available !== false,
//           }))
//         );
//       }
//     }
//   }, [menuItems.length]);

//   const form = useForm<MenuItemForm>({
//     defaultValues: {
//       name: "",
//       category: "Main Course",
//       price: "",
//       image_url: "",
//     },
//   });

//   const handleEdit = (id: string) => {
//     const itemToEdit = menuItems.find((item) => item._id === id);
//     if (itemToEdit) {
//       setEditingItem(itemToEdit);
//       form.setValue("name", itemToEdit.name);
//       form.setValue("category", itemToEdit.category);
//       form.setValue("price", itemToEdit.price.toString());
//       form.setValue("image_url", itemToEdit.image_url);
//       setOpenEditDialog(true);
//     }
//   };

//   const handleUpdateItem = async () => {
//     if (!editingItem) return;

//     const updatedItem = {
//       name: form.getValues("name"),
//       category: form.getValues("category"),
//       price: parseFloat(form.getValues("price")),
//       image_url: form.getValues("image_url"),
//     };

//     try {
//       const res = await fetch(`${API_URL}/menu/update/${editingItem._id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(updatedItem),
//       });

//       if (!res.ok) throw new Error("Failed to update item");

//       const updatedData = await res.json();

//       setMenuItems((prev) =>
//         prev.map((item) => (item._id === editingItem._id ? updatedData : item))
//       );

//       setOpenEditDialog(false);
//       setEditingItem(null);
//       toast({
//         title: "Success",
//         description: "Menu item updated",
//       });
//     } catch (err) {
//       toast({
//         title: "Error",
//         description: "Could not update item",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       await fetch(`${API_URL}/${id}`, { method: "DELETE" });
//       setMenuItems((prevItems) => prevItems.filter((item) => item._id !== id));
//       toast({
//         title: "Delete Menu Item",
//         description: "Item has been deleted",
//         variant: "destructive",
//       });
//     } catch {
//       toast({
//         title: "Error",
//         description: "Failed to delete item",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleToggleAvailability = async (id: string, available: boolean) => {
//     try {
//       const res = await fetch(`${API_URL}/menu/updateAvailable/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ available }),
//       });
//       if (!res.ok) throw new Error("Failed to update availability");
//       const updatedItem = await res.json();
//       setMenuItems((prevItems) =>
//         prevItems.map((item) =>
//           item._id === id ? { ...item, available: updatedItem.available } : item
//         )
//       );
//       toast({
//         title: `Item ${available ? "Available" : "Unavailable"}`,
//         description: `Item is now ${available ? "available" : "unavailable"}`,
//       });
//     } catch {
//       toast({
//         title: "Error",
//         description: "Failed to update availability",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleAddItem = async (data: MenuItemForm) => {
//     const price = parseFloat(data.price);
//     if (isNaN(price) || price <= 0) {
//       toast({
//         title: "Invalid Price",
//         description: "Please enter a valid price",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       const res = await fetch(`${API_URL}/menu/add`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           restaurantId: restaurantId,
//           name: data.name,
//           category: data.category,
//           price,
//           available: true,
//           image_url: data.image_url,
//         }),
//       });
//       const newItem = await res.json();
//       setMenuItems((prev) => [...prev, newItem]);
//       form.reset();
//       setOpenAddDialog(false);
//       toast({
//         title: "Menu Item Added",
//         description: `${data.name} has been added to the menu`,
//       });
//     } catch {
//       toast({
//         title: "Error",
//         description: "Failed to add item",
//         variant: "destructive",
//       });
//     }
//   };

//   const filteredItems = menuItems.filter((item) => {
//     const matchesSearch = item.name
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase());
//     const matchesCategory =
//       categoryFilter.toLowerCase() === "all" ||
//       item.category.toLowerCase() === categoryFilter.toLowerCase();
//     return matchesSearch && matchesCategory;
//   });

//   const sortedItems = [...filteredItems].sort((a, b) => {
//     if (a.available === b.available) return 0;
//     return b.available - a.available;
//   });

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold">Menu Management</h1>
//           <p className="text-gray-500 mt-1">
//             Add, edit, and manage your menu items
//           </p>
//         </div>
//         <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
//           <DialogTrigger asChild>
//             <Button
//               className="bg-orange hover:bg-orange/90 text-white"
//               onClick={() => setOpenAddDialog(true)}
//             >
//               <Plus size={14} className="mr-2" />
//               Add Item
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-[425px]">
//             <DialogHeader>
//               <DialogTitle>Add Menu Item</DialogTitle>
//               <DialogDescription>
//                 Fill in the details to add a new item to your menu.
//               </DialogDescription>
//             </DialogHeader>
//             <Form {...form}>
//               <form
//                 onSubmit={form.handleSubmit(handleAddItem)}
//                 className="space-y-4"
//               >
//                 <FormField
//                   control={form.control}
//                   name="name"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Name</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Item name" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="category"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Category</FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         defaultValue={field.value}
//                       >
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select category" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {["Main Course", "Starters", "Desserts"].map(
//                             (category) => (
//                               <SelectItem key={category} value={category}>
//                                 {category}
//                               </SelectItem>
//                             )
//                           )}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="price"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Price</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="number"
//                           placeholder="Item price"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="image_url"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Image</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="file"
//                           accept="image/*"
//                           onChange={async (e) => {
//                             if (e.target.files && e.target.files[0]) {
//                               try {
//                                 const file = e.target.files[0];
//                                 const imageUrl = await uploadToCloudinary(file);
//                                 field.onChange(imageUrl);
//                                 e.target.value = "";
//                               } catch (error) {
//                                 toast({
//                                   title: "Upload Failed",
//                                   description:
//                                     "Could not upload image to Cloudinary",
//                                   variant: "destructive",
//                                 });
//                               }
//                             }
//                           }}
//                         />
//                       </FormControl>
//                       {field.value && (
//                         <img
//                           src={field.value + `?t=${Date.now()}`}
//                           alt="Preview"
//                           className="w-20 h-20 object-cover mt-2"
//                           onError={(e) => {
//                             console.error(
//                               "Preview image failed to load:",
//                               field.value
//                             );
//                             e.currentTarget.src =
//                               "https://via.placeholder.com/150?text=Preview+Unavailable"; // ✅ Fixed: no extra spaces
//                           }}
//                         />
//                       )}
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <DialogFooter>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => {
//                       form.reset();
//                       setOpenAddDialog(false);
//                     }}
//                   >
//                     Cancel
//                   </Button>
//                   <Button type="submit">Add Item</Button>
//                 </DialogFooter>
//               </form>
//             </Form>
//           </DialogContent>
//         </Dialog>
//       </div>
//       <div className="flex flex-col md:flex-row gap-4">
//         <div className="relative flex-1">
//           <Search
//             className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//             size={18}
//           />
//           <Input
//             placeholder="Search menu items..."
//             className="pl-10"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//         <div className="w-full md:w-64">
//           <Select value={categoryFilter} onValueChange={setCategoryFilter}>
//             <SelectTrigger>
//               <SelectValue placeholder="Filter by category" />
//             </SelectTrigger>
//             <SelectContent>
//               {["All", "Main Course", "Starters", "Desserts"].map(
//                 (category) => (
//                   <SelectItem key={category} value={category.toLowerCase()}>
//                     {category}
//                   </SelectItem>
//                 )
//               )}
//             </SelectContent>
//           </Select>
//         </div>
//         {(searchQuery || categoryFilter !== "all") && (
//           <Button
//             variant="outline"
//             onClick={() => {
//               setSearchQuery("");
//               setCategoryFilter("all");
//             }}
//           >
//             <FilterX size={16} className="mr-2" />
//             Clear
//           </Button>
//         )}
//       </div>
//       {sortedItems.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {sortedItems.map((item) => (
//             <MenuItemCard
//               key={item._id}
//               id={item._id}
//               name={item.name}
//               category={item.category}
//               price={item.price}
//               available={item.available}
//               image_url={item.image_url}
//               onToggleAvailability={handleToggleAvailability}
//               onEdit={handleEdit}
//               onDelete={handleDelete}
//             />
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-12">
//           <p className="text-gray-500">
//             No menu items found matching your criteria.
//           </p>
//           <Button
//             variant="outline"
//             className="mt-4"
//             onClick={() => {
//               setSearchQuery("");
//               setCategoryFilter("all");
//             }}
//           >
//             <FilterX size={16} className="mr-2" />
//             Clear Filters
//           </Button>
//         </div>
//       )}
//       <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Edit Menu Item</DialogTitle>
//             <DialogDescription>
//               Update the details of the selected menu item.
//             </DialogDescription>
//           </DialogHeader>
//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(handleUpdateItem)}
//               className="space-y-4"
//             >
//               <FormField
//                 control={form.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Name</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Item name" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="category"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Category</FormLabel>
//                     <Select
//                       onValueChange={field.onChange}
//                       defaultValue={field.value}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select category" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {["Main Course", "Starters", "Desserts"].map(
//                           (category) => (
//                             <SelectItem key={category} value={category}>
//                               {category}
//                             </SelectItem>
//                           )
//                         )}
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="price"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Price</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="number"
//                         placeholder="Item price"
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="image_url"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Image</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="file"
//                         accept="image/*"
//                         onChange={async (e) => {
//                           if (e.target.files && e.target.files[0]) {
//                             try {
//                               const file = e.target.files[0];
//                               const imageUrl = await uploadToCloudinary(file);
//                               field.onChange(imageUrl);
//                               e.target.value = "";
//                             } catch (error) {
//                               toast({
//                                 title: "Upload Failed",
//                                 description:
//                                   "Could not upload image to Cloudinary",
//                                 variant: "destructive",
//                               });
//                             }
//                           }
//                         }}
//                       />
//                     </FormControl>
//                     {(field.value || editingItem?.image_url) && (
//                       <img
//                         src={
//                           (field.value || editingItem?.image_url) +
//                           `?t=${Date.now()}`
//                         }
//                         alt="Preview"
//                         className="w-20 h-20 object-cover mt-2"
//                         onError={(e) => {
//                           const failedUrl =
//                             field.value || editingItem?.image_url;
//                           console.error(
//                             "Preview image failed to load:",
//                             failedUrl
//                           );
//                           e.currentTarget.src =
//                             "https://via.placeholder.com/150?text=Preview+Unavailable"; // ✅ Fixed: no extra spaces
//                         }}
//                       />
//                     )}
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <DialogFooter>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => {
//                     form.reset();
//                     setOpenEditDialog(false);
//                     setEditingItem(null);
//                   }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button type="submit">Save Changes</Button>
//               </DialogFooter>
//             </form>
//           </Form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default Menu;

import { useEffect, useState } from "react";
import { Plus, Search, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MenuItemCard from "@/components/MenuItemCard";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";

interface MenuItem {
  _id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
  image_url: string;
}

interface MenuItemForm {
  name: string;
  category: string;
  price: string;
  image_url: string;
}

const API_URL =
  import.meta.env.VITE_API_BASE?.trim() || "http://localhost:3001";

// ✅ FIXED: No extra spaces in Cloudinary URL
const uploadToCloudinary = async (file: File): Promise<string> => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: data,
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Cloudinary upload failed:", errorText);
    throw new Error("Cloudinary upload failed");
  }

  const json = await res.json();
  let url = json.secure_url;

  if (!url.startsWith("https://")) {
    url = url.replace("http://", "https://");
  }

  return url;
};

const Menu = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const restaurantId = localStorage.getItem("restaurantId");

  // Fetch menu items
  useEffect(() => {
    if (!restaurantId) {
      toast({
        title: "Error",
        description: "Restaurant ID not found",
        variant: "destructive",
      });
      return;
    }

    const fetchMenu = async () => {
      try {
        const res = await fetch(`${API_URL}/menu/${restaurantId}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setMenuItems(data);
      } catch {
        toast({
          title: "Error",
          description: "Failed to fetch menu items",
          variant: "destructive",
        });
      }
    };

    fetchMenu();
  }, [restaurantId, toast]);

  // Normalize availability (optional cleanup)
  useEffect(() => {
    if (menuItems.length > 0) {
      const needsNormalization = menuItems.some(
        (item) => item.available === undefined
      );
      if (needsNormalization) {
        setMenuItems((prev) =>
          prev.map((item) => ({
            ...item,
            available: item.available !== false,
          }))
        );
      }
    }
  }, [menuItems.length]);

  const form = useForm<MenuItemForm>({
    defaultValues: {
      name: "",
      category: "Main Course",
      price: "",
      image_url: "",
    },
  });

  const handleEdit = (id: string) => {
    const itemToEdit = menuItems.find((item) => item._id === id);
    if (itemToEdit) {
      setEditingItem(itemToEdit);
      form.reset({
        name: itemToEdit.name,
        category: itemToEdit.category,
        price: itemToEdit.price.toString(),
        image_url: itemToEdit.image_url || "",
      });
      setOpenEditDialog(true);
    }
  };

  const handleUpdateItem = async (data: MenuItemForm) => {
    if (!editingItem || !restaurantId) return;

    const price = parseFloat(data.price);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/menu/update/${editingItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          category: data.category,
          price,
          image_url: data.image_url || "/images/placeholder-menu.jpg",
        }),
      });

      if (!res.ok) throw new Error("Failed to update");

      const updatedData = await res.json();
      setMenuItems((prev) =>
        prev.map((item) => (item._id === editingItem._id ? updatedData : item))
      );

      setOpenEditDialog(false);
      setEditingItem(null);
      toast({ title: "Success", description: "Menu item updated" });
    } catch {
      toast({
        title: "Error",
        description: "Could not update item",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/menu/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setMenuItems((prev) => prev.filter((item) => item._id !== id));
      toast({
        title: "Deleted",
        description: "Item has been deleted",
        variant: "destructive",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  const handleToggleAvailability = async (id: string, available: boolean) => {
    try {
      const res = await fetch(`${API_URL}/menu/updateAvailable/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available }),
      });
      if (!res.ok) throw new Error("Failed to update availability");
      const updatedItem = await res.json();
      setMenuItems((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, available: updatedItem.available } : item
        )
      );
      toast({
        title: `Item ${available ? "Available" : "Unavailable"}`,
        description: `Item is now ${available ? "available" : "unavailable"}`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update availability",
        variant: "destructive",
      });
    }
  };

  const handleAddItem = async (data: MenuItemForm) => {
    if (!restaurantId) {
      toast({
        title: "Error",
        description: "Restaurant not selected",
        variant: "destructive",
      });
      return;
    }

    const price = parseFloat(data.price);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }

    // Use placeholder if no image uploaded
    const imageUrl = data.image_url || "/images/placeholder-menu.jpg";

    try {
      const res = await fetch(`${API_URL}/menu/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          name: data.name,
          category: data.category,
          price,
          available: true,
          image_url: imageUrl,
        }),
      });

      if (!res.ok) {
        const error = await res.text();
        console.error("Add item error:", error);
        throw new Error("Failed to add item");
      }

      const newItem = await res.json();
      setMenuItems((prev) => [...prev, newItem]);
      form.reset();
      setOpenAddDialog(false);
      toast({
        title: "Success",
        description: `${data.name} has been added to the menu`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add item",
        variant: "destructive",
      });
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" ||
      item.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    return Number(b.available) - Number(a.available); // available first
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Menu Management</h1>
          <p className="text-gray-500 mt-1">
            Add, edit, and manage your menu items
          </p>
        </div>
        <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
          <DialogTrigger asChild>
            <Button
              className="bg-orange hover:bg-orange/90 text-white"
              onClick={() => {
                form.reset({
                  name: "",
                  category: "Main Course",
                  price: "",
                  image_url: "",
                });
                setOpenAddDialog(true);
              }}
            >
              <Plus size={14} className="mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Menu Item</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new item to your menu.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleAddItem)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Item name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["Main Course", "Starters", "Desserts"].map(
                            (category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0.01"
                          step="0.01"
                          placeholder="Item price"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            if (e.target.files?.[0]) {
                              try {
                                const file = e.target.files[0];
                                const imageUrl = await uploadToCloudinary(file);
                                field.onChange(imageUrl);
                                e.target.value = ""; // reset input
                              } catch (error) {
                                toast({
                                  title: "Upload Failed",
                                  description:
                                    "Could not upload image to Cloudinary",
                                  variant: "destructive",
                                });
                                field.onChange(""); // clear on failure
                              }
                            }
                          }}
                        />
                      </FormControl>
                      {field.value && (
                        <img
                          src={field.value + `?t=${Date.now()}`}
                          alt="Preview"
                          className="w-20 h-20 object-cover mt-2 rounded"
                          onError={(e) => {
                            e.currentTarget.src =
                              "/images/placeholder-menu.jpg";
                          }}
                        />
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      form.reset();
                      setOpenAddDialog(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Add Item</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            placeholder="Search menu items..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {["All", "Main Course", "Starters", "Desserts"].map(
                (category) => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
        {(searchQuery || categoryFilter !== "all") && (
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setCategoryFilter("all");
            }}
          >
            <FilterX size={16} className="mr-2" />
            Clear
          </Button>
        )}
      </div>

      {sortedItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedItems.map((item) => (
            <MenuItemCard
              key={item._id}
              id={item._id}
              name={item.name}
              category={item.category}
              price={item.price}
              available={item.available}
              image_url={item.image_url}
              onToggleAvailability={handleToggleAvailability}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No menu items found matching your criteria.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchQuery("");
              setCategoryFilter("all");
            }}
          >
            <FilterX size={16} className="mr-2" />
            Clear Filters
          </Button>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
            <DialogDescription>
              Update the details of the selected menu item.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleUpdateItem)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Item name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["Main Course", "Starters", "Desserts"].map(
                          (category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="Item price"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          if (e.target.files?.[0]) {
                            try {
                              const file = e.target.files[0];
                              const imageUrl = await uploadToCloudinary(file);
                              field.onChange(imageUrl);
                              e.target.value = "";
                            } catch (error) {
                              toast({
                                title: "Upload Failed",
                                description:
                                  "Could not upload image to Cloudinary",
                                variant: "destructive",
                              });
                              field.onChange("");
                            }
                          }
                        }}
                      />
                    </FormControl>
                    {(field.value || editingItem?.image_url) && (
                      <img
                        src={
                          (field.value || editingItem?.image_url) +
                          `?t=${Date.now()}`
                        }
                        alt="Preview"
                        className="w-20 h-20 object-cover mt-2 rounded"
                        onError={(e) => {
                          e.currentTarget.src = "/images/placeholder-menu.jpg";
                        }}
                      />
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setOpenEditDialog(false);
                    setEditingItem(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Menu;