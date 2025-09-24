import { IWeeklyMenu } from "@/model/WeeklyMenu";

// Function to get the current day of the week in Portuguese
export const getCurrentDayOfWeek = (): string => {
  const days = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado"
  ];
  const today = new Date();
  return days[today.getDay()];
};

// Function to get the current week index (0 for current week)
export const getCurrentWeekIndex = (): number => {
  return 0; // Default to current week
};

// Function to get the weekly menu for the current week
export const get_current_week_menu = async () => {
  try {
    const weekIndex = getCurrentWeekIndex();
    const response = await fetch(`/api/common/weeklyMenu/get-weekly-menu?weekIndex=${weekIndex}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weekly menu:', error);
    return { success: false, message: 'Failed to fetch weekly menu' };
  }
};

// Function to get products for the current day from the weekly menu
export const get_products_for_today = async () => {
  try {
    const currentDay = getCurrentDayOfWeek();
    const weekMenuResponse = await get_current_week_menu();
    
    if (!weekMenuResponse.success || !weekMenuResponse.data) {
      return [];
    }
    
    const weeklyMenu = weekMenuResponse.data as IWeeklyMenu;
    const todayProducts = weeklyMenu.menu[currentDay] || [];
    
    return todayProducts;
  } catch (error) {
    console.error('Error getting products for today:', error);
    return [];
  }
};

// Function to get all products
export const get_all_products = async () => {
  try {
    const response = await fetch('/api/product/get-products');
    const data = await response.json();
    
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: 'Failed to fetch products' };
    }
  } catch (error) {
    console.error('Error fetching all products:', error);
    return { success: false, error };
  }
};