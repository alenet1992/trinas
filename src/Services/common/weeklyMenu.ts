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

/**
 * Function to get the current week index using ISO week numbering standard (ISO-8601)
 * 
 * ISO weeks start on Monday and the first week of the year contains the first Thursday of that year.
 * This means that some days from one year may be placed in weeks that are counted as part of the
 * previous or next year.
 * 
 * @returns {number} The ISO week number (1-53)
 */
export const getCurrentWeekIndex = (): number => {
  const now = new Date();
  
  // Create a copy of the date
  const date = new Date(now.getTime());
  
  // Find Thursday of this week (ISO weeks are defined by Thursday)
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  
  // Get first day of year
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  
  // Calculate full weeks to nearest Thursday
  // 86400000 = 1000 * 60 * 60 * 24 (milliseconds in a day)
  const weekNumber = Math.floor(1 + Math.round(((date.getTime() - startOfYear.getTime()) / 86400000 - 3 + 
    ((startOfYear.getDay() + 6) % 7)) / 7));
  
  return weekNumber+date.getFullYear();
};

/**
 * Test function to get the week number for a specific date
 * @param {Date} date - The date to get the week number for
 * @returns {number} The ISO week number
 */
export const getWeekNumberForDate = (date: Date): number => {
  // Create a copy of the date
  const dateCopy = new Date(date.getTime());
  
  // Find Thursday of this week
  dateCopy.setDate(dateCopy.getDate() + 3 - ((dateCopy.getDay() + 6) % 7));
  
  // Get first day of year
  const startOfYear = new Date(dateCopy.getFullYear(), 0, 1);
  
  // Calculate full weeks to nearest Thursday
  const weekNumber = Math.floor(1 + Math.round(((dateCopy.getTime() - startOfYear.getTime()) / 86400000 - 3 + 
    ((startOfYear.getDay() + 6) % 7)) / 7));
  
  return weekNumber;
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