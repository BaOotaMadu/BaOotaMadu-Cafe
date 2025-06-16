// import { useEffect, useState } from 'react';
// import { Plus, Search, FilterX, Upload } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '@/components/ui/dialog';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import MenuItemCard from '@/components/MenuItemCard';
// import { useToast } from '@/hooks/use-toast';
// import { useForm } from 'react-hook-form';

// interface MenuItem {
//   id: string;
//   name: string;
//   category: string;
//   price: number;
//   available: boolean;
//   image: string;
// }

// interface MenuItemForm {
//   name: string;
//   category: string;
//   price: string;
//   image: string;
// }

// const Menu = () => {
//   const { toast } = useToast();
//   const [searchQuery, setSearchQuery] = useState('');
//   const [categoryFilter, setCategoryFilter] = useState('all');
//   const [openAddDialog, setOpenAddDialog] = useState(false);
//   const [openEditDialog, setOpenEditDialog] = useState(false);
//   const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
//   const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

//   // Retrieve menu items from localStorage on component mount
//   useEffect(() => {
//     const savedMenuItems = localStorage.getItem('menuItems');
//     if (savedMenuItems) {
//       setMenuItems(JSON.parse(savedMenuItems));
//     } else {
//       // Initialize with default menu items if no data exists in localStorage
//       setMenuItems([
//         {
//           id: '1',
//           name: 'Classic Cheeseburger',
//           category: 'Main Course',
//           price: 12.99,
//           available: true,
//           image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=1000',
//         },
//         {
//           id: '2',
//           name: 'Caesar Salad',
//           category: 'Starters',
//           price: 8.99,
//           available: true,
//           image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&q=80&w=1000',
//         },
//       ]);
//     }
//   }, []);

//   // Save menu items to localStorage whenever they change
//   useEffect(() => {
//     localStorage.setItem('menuItems', JSON.stringify(menuItems));
//   }, [menuItems]);

//   const form = useForm<MenuItemForm>({
//     defaultValues: {
//       name: '',
//       category: 'Main Course',
//       price: '',
//       image: '',
//     },
//   });

//   const handleEdit = (id: string) => {
//     const itemToEdit = menuItems.find((item) => item.id === id);
//     if (itemToEdit) {
//       setEditingItem(itemToEdit);
//       form.setValue('name', itemToEdit.name);
//       form.setValue('category', itemToEdit.category);
//       form.setValue('price', itemToEdit.price.toString());
//       form.setValue('image', itemToEdit.image);
//       setOpenEditDialog(true);
//     }
//   };

//   const handleDelete = (id: string) => {
//     setMenuItems((prevItems) => prevItems.filter((item) => item.id !== id));
//     toast({
//       title: 'Delete Menu Item',
//       description: 'Item has been deleted',
//       variant: 'destructive',
//     });
//   };

//   const handleToggleAvailability = (id: string, available: boolean) => {
//     setMenuItems((prevItems) =>
//       prevItems.map((item) => (item.id === id ? { ...item, available } : item))
//     );
//     toast({
//       title: `Item ₹
// {available ? 'Available' : 'Unavailable'}`,
//       description: `Item is now ₹
// {available ? 'available' : 'unavailable'}`,
//     });
//   };

//   const handleAddItem = (data: MenuItemForm) => {
//     const price = parseFloat(data.price);
//     if (isNaN(price) || price <= 0) {
//       toast({
//         title: 'Invalid Price',
//         description: 'Please enter a valid price',
//         variant: 'destructive',
//       });
//       return;
//     }

//     const newItem: MenuItem = {
//       id: Date.now().toString(),
//       name: data.name,
//       category: data.category,
//       price: price,
//       available: true,
//       image: data.image || 'https://via.placeholder.com/150',
//     };

//     setMenuItems((prev) => [...prev, newItem]);
//     form.reset();
//     setOpenAddDialog(false);
//     toast({
//       title: 'Menu Item Added',
//       description: `₹
// {data.name} has been added to the menu`,
//     });
//   };

//   const handleSaveEdit = (data: MenuItemForm) => {
//     const price = parseFloat(data.price);
//     if (isNaN(price) || price <= 0) {
//       toast({
//         title: 'Invalid Price',
//         description: 'Please enter a valid price',
//         variant: 'destructive',
//       });
//       return;
//     }

//     const updatedItem: MenuItem = {
//       id: editingItem!.id,
//       name: data.name,
//       category: data.category,
//       price: price,
//       available: editingItem!.available,
//       image: data.image || editingItem!.image,
//     };

//     setMenuItems((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
//     form.reset();
//     setOpenEditDialog(false);
//     setEditingItem(null);
//     toast({
//       title: 'Menu Item Updated',
//       description: `₹
// {updatedItem.name} has been updated`,
//     });
//   };

//   const filteredItems = menuItems.filter((item) => {
//     const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesCategory =
//       categoryFilter.toLowerCase() === 'all' ||
//       item.category.toLowerCase() === categoryFilter.toLowerCase();
//     return matchesSearch && matchesCategory;
//   });

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold">Menu Management</h1>
//           <p className="text-gray-500 mt-1">Add, edit, and manage your menu items</p>
//         </div>
//         <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
//           <DialogTrigger asChild>
//             <Button className="bg-orange hover:bg-orange/90 text-white" onClick={() => setOpenAddDialog(true)}>
//               <Plus size={14} className="mr-2" />
//               Add Item
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-[425px]">
//             <DialogHeader>
//               <DialogTitle>Add Menu Item</DialogTitle>
//               <DialogDescription>Fill in the details to add a new item to your menu.</DialogDescription>
//             </DialogHeader>
//             <Form {...form}>
//               <form onSubmit={form.handleSubmit(handleAddItem)} className="space-y-4">
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
//                       <Select onValueChange={field.onChange} defaultValue={field.value}>
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select category" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {['Main Course', 'Starters', 'Desserts'].map((category) => (
//                             <SelectItem key={category} value={category}>
//                               {category}
//                             </SelectItem>
//                           ))}
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
//                         <Input type="number" placeholder="Item price" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="image"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Image</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="file"
//                           accept="image/*"
//                           onChange={(e) => {
//                             if (e.target.files && e.target.files[0]) {
//                               const imageUrl = URL.createObjectURL(e.target.files[0]);
//                               field.onChange(imageUrl);
//                             }
//                           }}
//                         />
//                       </FormControl>
//                       {field.value && (
//                         <img src={field.value} alt="Preview" className="w-20 h-20 object-cover mt-2" />
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
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
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
//               {['All', 'Main Course', 'Starters', 'Desserts'].map((category) => (
//                 <SelectItem key={category} value={category.toLowerCase()}>
//                   {category}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//         {(searchQuery || categoryFilter !== 'all') && (
//           <Button
//             variant="outline"
//             onClick={() => {
//               setSearchQuery('');
//               setCategoryFilter('all');
//             }}
//           >
//             <FilterX size={16} className="mr-2" />
//             Clear
//           </Button>
//         )}
//       </div>
//       {filteredItems.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {filteredItems.map((item) => (
//             <MenuItemCard
//               key={item.id}
//               id={item.id}
//               name={item.name}
//               category={item.category}
//               price={item.price}
//               available={item.available}
//               image={item.image}
//               onToggleAvailability={handleToggleAvailability}
//               onEdit={handleEdit}
//               onDelete={handleDelete}
//             />
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-12">
//           <p className="text-gray-500">No menu items found matching your criteria.</p>
//           <Button
//             variant="outline"
//             className="mt-4"
//             onClick={() => {
//               setSearchQuery('');
//               setCategoryFilter('all');
//             }}
//           >
//             <FilterX size={16} className="mr-2" />
//             Clear Filters
//           </Button>
//         </div>
//       )}
//       {/* Edit Dialog */}
//       <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Edit Menu Item</DialogTitle>
//             <DialogDescription>Update the details of the selected menu item.</DialogDescription>
//           </DialogHeader>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(handleSaveEdit)} className="space-y-4">
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
//                     <Select onValueChange={field.onChange} defaultValue={field.value}>
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select category" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {['Main Course', 'Starters', 'Desserts'].map((category) => (
//                           <SelectItem key={category} value={category}>
//                             {category}
//                           </SelectItem>
//                         ))}
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
//                       <Input type="number" placeholder="Item price" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="image"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Image</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) => {
//                           if (e.target.files && e.target.files[0]) {
//                             const imageUrl = URL.createObjectURL(e.target.files[0]);
//                             field.onChange(imageUrl);
//                           }
//                         }}
//                       />
//                     </FormControl>
//                     {(field.value || editingItem?.image) && (
//                       <img
//                         src={field.value || editingItem?.image}
//                         alt="Preview"
//                         className="w-20 h-20 object-cover mt-2"
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

import { useEffect, useState } from 'react';
import { Plus, Search, FilterX, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MenuItemCard from '@/components/MenuItemCard';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
  image: string;
}

interface MenuItemForm {
  name: string;
  category: string;
  price: string;
  image: string;
}

// MongoDB API functions - Replace these with your actual API calls
const menuAPI = {
  // Fetch all menu items from MongoDB
  async getMenuItems(): Promise<MenuItem[]> {
    try {
      // TODO: Replace with actual API call to your MongoDB backend
      const response = await fetch('/api/menu-items');
      if (!response.ok) throw new Error('Failed to fetch menu items');
      return await response.json();
    } catch (error) {
      console.error('Error fetching menu items:', error);
      // Return default items for development/fallback
      return [
        {
          id: '1',
          name: 'Classic Cheeseburger',
          category: 'Main Course',
          price: 12.99,
          available: true,
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=1000',
        },
        {
          id: '2',
          name: 'Caesar Salad',
          category: 'Starters',
          price: 8.99,
          available: true,
          image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&q=80&w=1000',
        },
      ];
    }
  },

  // Create new menu item in MongoDB
  async createMenuItem(menuItem: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    try {
      // TODO: Replace with actual API call to your MongoDB backend
      const response = await fetch('/api/menu-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(menuItem),
      });
      if (!response.ok) throw new Error('Failed to create menu item');
      return await response.json();
    } catch (error) {
      console.error('Error creating menu item:', error);
      // Return mock data for development
      return {
        id: Date.now().toString(),
        ...menuItem,
      };
    }
  },

  // Update menu item in MongoDB
  async updateMenuItem(id: string, menuItem: Partial<MenuItem>): Promise<MenuItem> {
    try {
      // TODO: Replace with actual API call to your MongoDB backend
      const response = await fetch(`/api/menu-items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(menuItem),
      });
      if (!response.ok) throw new Error('Failed to update menu item');
      return await response.json();
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  },

  // Delete menu item from MongoDB
  async deleteMenuItem(id: string): Promise<void> {
    try {
      // TODO: Replace with actual API call to your MongoDB backend
      const response = await fetch(`/api/menu-items/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete menu item');
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  },

  // Update menu item availability in MongoDB
  async updateMenuItemAvailability(id: string, available: boolean): Promise<MenuItem> {
    try {
      // TODO: Replace with actual API call to your MongoDB backend
      const response = await fetch(`/api/menu-items/${id}/availability`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ available }),
      });
      if (!response.ok) throw new Error('Failed to update menu item availability');
      return await response.json();
    } catch (error) {
      console.error('Error updating menu item availability:', error);
      throw error;
    }
  },
};

const Menu = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch menu items from MongoDB on component mount
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const items = await menuAPI.getMenuItems();
        setMenuItems(items);
      } catch (error) {
        console.error('Failed to fetch menu items:', error);
        toast({
          title: 'Error',
          description: 'Failed to load menu items',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [toast]);

  const form = useForm<MenuItemForm>({
    defaultValues: {
      name: '',
      category: 'Main Course',
      price: '',
      image: '',
    },
  });

  const handleEdit = (id: string) => {
    const itemToEdit = menuItems.find((item) => item.id === id);
    if (itemToEdit) {
      setEditingItem(itemToEdit);
      form.setValue('name', itemToEdit.name);
      form.setValue('category', itemToEdit.category);
      form.setValue('price', itemToEdit.price.toString());
      form.setValue('image', itemToEdit.image);
      setOpenEditDialog(true);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setSubmitting(true);
      await menuAPI.deleteMenuItem(id);
      setMenuItems((prevItems) => prevItems.filter((item) => item.id !== id));
      toast({
        title: 'Delete Menu Item',
        description: 'Item has been deleted successfully',
        variant: 'destructive',
      });
    } catch (error) {
      console.error('Failed to delete menu item:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete menu item',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleAvailability = async (id: string, available: boolean) => {
    try {
      const updatedItem = await menuAPI.updateMenuItemAvailability(id, available);
      setMenuItems((prevItems) =>
        prevItems.map((item) => (item.id === id ? { ...item, available } : item))
      );
      toast({
        title: `Item ${available ? 'Available' : 'Unavailable'}`,
        description: `Item is now ${available ? 'available' : 'unavailable'}`,
      });
    } catch (error) {
      console.error('Failed to update menu item availability:', error);
      toast({
        title: 'Error',
        description: 'Failed to update item availability',
        variant: 'destructive',
      });
    }
  };

  const handleAddItem = async (data: MenuItemForm) => {
    const price = parseFloat(data.price);
    if (isNaN(price) || price <= 0) {
      toast({
        title: 'Invalid Price',
        description: 'Please enter a valid price',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSubmitting(true);
      const newItemData = {
        name: data.name,
        category: data.category,
        price: price,
        available: true,
        image: data.image || 'https://via.placeholder.com/150',
      };

      const newItem = await menuAPI.createMenuItem(newItemData);
      setMenuItems((prev) => [...prev, newItem]);
      form.reset();
      setOpenAddDialog(false);
      toast({
        title: 'Menu Item Added',
        description: `${data.name} has been added to the menu`,
      });
    } catch (error) {
      console.error('Failed to add menu item:', error);
      toast({
        title: 'Error',
        description: 'Failed to add menu item',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveEdit = async (data: MenuItemForm) => {
    const price = parseFloat(data.price);
    if (isNaN(price) || price <= 0) {
      toast({
        title: 'Invalid Price',
        description: 'Please enter a valid price',
        variant: 'destructive',
      });
      return;
    }

    if (!editingItem) return;

    try {
      setSubmitting(true);
      const updatedItemData = {
        name: data.name,
        category: data.category,
        price: price,
        image: data.image || editingItem.image,
      };

      const updatedItem = await menuAPI.updateMenuItem(editingItem.id, updatedItemData);
      
      setMenuItems((prev) => 
        prev.map((item) => (item.id === editingItem.id ? { ...item, ...updatedItemData } : item))
      );
      
      form.reset();
      setOpenEditDialog(false);
      setEditingItem(null);
      toast({
        title: 'Menu Item Updated',
        description: `${updatedItemData.name} has been updated`,
      });
    } catch (error) {
      console.error('Failed to update menu item:', error);
      toast({
        title: 'Error',
        description: 'Failed to update menu item',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter.toLowerCase() === 'all' ||
      item.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Menu Management</h1>
            <p className="text-gray-500 mt-1">Loading menu items...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Menu Management</h1>
          <p className="text-gray-500 mt-1">Add, edit, and manage your menu items</p>
        </div>
        <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-orange hover:bg-orange/90 text-white" onClick={() => setOpenAddDialog(true)}>
              <Plus size={14} className="mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Menu Item</DialogTitle>
              <DialogDescription>Fill in the details to add a new item to your menu.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddItem)} className="space-y-4">
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {['Main Course', 'Starters', 'Desserts'].map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
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
                        <Input type="number" placeholder="Item price" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const imageUrl = URL.createObjectURL(e.target.files[0]);
                              field.onChange(imageUrl);
                            }
                          }}
                        />
                      </FormControl>
                      {field.value && (
                        <img src={field.value} alt="Preview" className="w-20 h-20 object-cover mt-2" />
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
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Adding...' : 'Add Item'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
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
              {['All', 'Main Course', 'Starters', 'Desserts'].map((category) => (
                <SelectItem key={category} value={category.toLowerCase()}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {(searchQuery || categoryFilter !== 'all') && (
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all');
            }}
          >
            <FilterX size={16} className="mr-2" />
            Clear
          </Button>
        )}
      </div>
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              id={item.id}
              name={item.name}
              category={item.category}
              price={item.price}
              available={item.available}
              image={item.image}
              onToggleAvailability={handleToggleAvailability}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No menu items found matching your criteria.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all');
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
            <DialogDescription>Update the details of the selected menu item.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSaveEdit)} className="space-y-4">
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {['Main Course', 'Starters', 'Desserts'].map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
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
                      <Input type="number" placeholder="Item price" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const imageUrl = URL.createObjectURL(e.target.files[0]);
                            field.onChange(imageUrl);
                          }
                        }}
                      />
                    </FormControl>
                    {(field.value || editingItem?.image) && (
                      <img
                        src={field.value || editingItem?.image}
                        alt="Preview"
                        className="w-20 h-20 object-cover mt-2"
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
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Menu;