export const getUpdatedMenu = async (category) => {
    try {
      // Simulate API call to fetch menu based on category
      const response = await fetch(`/api/menu?category=${category}`);
      if (!response.ok) {
        throw new Error("Failed to fetch menu");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching menu:", error);
      return [];
    }
  };
  