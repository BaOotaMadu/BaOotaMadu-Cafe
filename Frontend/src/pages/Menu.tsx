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

const Menu = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Retrieve menu items from localStorage on component mount
  useEffect(() => {
    const savedMenuItems = localStorage.getItem('menuItems');
    if (savedMenuItems) {
      setMenuItems(JSON.parse(savedMenuItems));
    } else {
      // Initialize with default menu items if no data exists in localStorage
      setMenuItems([
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
      ]);
    }
  }, []);

  // Save menu items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
  }, [menuItems]);

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

  const handleDelete = (id: string) => {
    setMenuItems((prevItems) => prevItems.filter((item) => item.id !== id));
    toast({
      title: 'Delete Menu Item',
      description: 'Item has been deleted',
      variant: 'destructive',
    });
  };

  const handleToggleAvailability = (id: string, available: boolean) => {
    setMenuItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, available } : item))
    );
    toast({
      title: `Item ₹
{available ? 'Available' : 'Unavailable'}`,
      description: `Item is now ₹
{available ? 'available' : 'unavailable'}`,
    });
  };

  const handleAddItem = (data: MenuItemForm) => {
    const price = parseFloat(data.price);
    if (isNaN(price) || price <= 0) {
      toast({
        title: 'Invalid Price',
        description: 'Please enter a valid price',
        variant: 'destructive',
      });
      return;
    }

    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: data.name,
      category: data.category,
      price: price,
      available: true,
      image: data.image || 'https://via.placeholder.com/150',
    };

    setMenuItems((prev) => [...prev, newItem]);
    form.reset();
    setOpenAddDialog(false);
    toast({
      title: 'Menu Item Added',
      description: `₹
{data.name} has been added to the menu`,
    });
  };

  const handleSaveEdit = (data: MenuItemForm) => {
    const price = parseFloat(data.price);
    if (isNaN(price) || price <= 0) {
      toast({
        title: 'Invalid Price',
        description: 'Please enter a valid price',
        variant: 'destructive',
      });
      return;
    }

    const updatedItem: MenuItem = {
      id: editingItem!.id,
      name: data.name,
      category: data.category,
      price: price,
      available: editingItem!.available,
      image: data.image || editingItem!.image,
    };

    setMenuItems((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
    form.reset();
    setOpenEditDialog(false);
    setEditingItem(null);
    toast({
      title: 'Menu Item Updated',
      description: `₹
{updatedItem.name} has been updated`,
    });
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter.toLowerCase() === 'all' ||
      item.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

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