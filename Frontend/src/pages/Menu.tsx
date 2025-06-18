import { useEffect, useState } from "react";
import { Plus, Search, FilterX, Upload } from "lucide-react";
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
  image: string;
}

interface MenuItemForm {
  name: string;
  category: string;
  price: string;
  image: string;
}

const API_URL = "http://localhost:3000/menu"; // Change if your endpoint is different

const Menu = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const restaurantId = "681f3a4888df8faae5bbd380";
  // Fetch menu items from backend
  useEffect(() => {
    fetch(`http://localhost:3000/menu/681f3a4888df8faae5bbd380`)
      .then((res) => res.json())
      .then((data) => setMenuItems(data))
      .catch(() =>
        toast({
          title: "Error",
          description: "Failed to fetch menu items",
          variant: "destructive",
        })
      );
  }, []);

  const form = useForm<MenuItemForm>({
    defaultValues: {
      name: "",
      category: "Main Course",
      price: "",
      image: "",
    },
  });

  const handleEdit = (id: string) => {
    const itemToEdit = menuItems.find((item) => item._id === id);
    if (itemToEdit) {
      setEditingItem(itemToEdit);
      form.setValue("name", itemToEdit.name);
      form.setValue("category", itemToEdit.category);
      form.setValue("price", itemToEdit.price.toString());
      form.setValue("image", itemToEdit.image);
      setOpenEditDialog(true);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${API_URL}${id}`, { method: "DELETE" });
      setMenuItems((prevItems) => prevItems.filter((item) => item._id !== id));
      toast({
        title: "Delete Menu Item",
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
      await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available }),
      });
      setMenuItems((prevItems) =>
        prevItems.map((item) =>
          item._id === id ? { ...item, available } : item
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
      const res = await fetch("http://localhost:3000/menu/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: "681f3a4888df8faae5bbd380",
          name: data.name,
          category: data.category,
          price,
          available: true,
          image: data.image || "https://via.placeholder.com/150",
        }),
      });
      const newItem = await res.json();
      setMenuItems((prev) => [...prev, newItem]);
      form.reset();
      setOpenAddDialog(false);
      toast({
        title: "Menu Item Added",
        description: `${data.name} has been added to the menu`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to add item",
        variant: "destructive",
      });
    }
  };

  const handleSaveEdit = async (data: MenuItemForm) => {
    const price = parseFloat(data.price);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }

    if (!editingItem) return;

    try {
      const res = await fetch(`${API_URL}/${editingItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          category: data.category,
          price,
          available: editingItem.available,
          image: data.image || editingItem.image,
        }),
      });
      const updatedItem = await res.json();
      setMenuItems((prev) =>
        prev.map((item) => (item._id === updatedItem._id ? updatedItem : item))
      );
      form.reset();
      setOpenEditDialog(false);
      setEditingItem(null);
      toast({
        title: "Menu Item Updated",
        description: `${updatedItem.name} has been updated`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter.toLowerCase() === "all" ||
      item.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
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
              onClick={() => setOpenAddDialog(true)}
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
                              const imageUrl = URL.createObjectURL(
                                e.target.files[0]
                              );
                              field.onChange(imageUrl);
                            }
                          }}
                        />
                      </FormControl>
                      {field.value && (
                        <img
                          src={field.value}
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
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item._id}
              id={item._id}
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
              onSubmit={form.handleSubmit(handleSaveEdit)}
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
                            const imageUrl = URL.createObjectURL(
                              e.target.files[0]
                            );
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
