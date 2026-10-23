import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/Store/store";
import TileContainer from "./TileContainer";
import ProductDataTable from "../app/dashboard/Product/ProductDataTable";
import CategoryDataTable from "../app/dashboard/Category/CategoryDataTable";
import CompletedOrderDataTable from "./CompletedOrderDataTable";
import ClientListPage from "@/app/dashboard/client/list/page";
import QuantityDataTable from "@/app/dashboard/quantity/QuantityDataTable";
import MealPlannerList from "@/app/dashboard/MealPlanner/MealPlannerList";
import ClientCreatePage from "@/app/auth/register/page";
import WeeklyMenu from "@/app/product/weekly-menu/page";
import DailyOrdersPage from '@/app/order/daily-orders/page';
import SiteContentEditor from '@/app/dashboard/site/SiteContentEditor';

export default function SuperComponent() {
  const navActive = useSelector((state: RootState) => state.AdminNav.ActiveNav);
  switch (navActive) {
    case "Base":
      return <TileContainer />;
    case "activeProducts":
      return <ProductDataTable />;
    case "activeCategories":
      return <CategoryDataTable />;
    case "activeDeliveredOrder":
      return <CompletedOrderDataTable />;
    // For products
    case "activeCreateUser":
      return <ClientListPage />;
    case "activeClientList":
      return <ClientListPage />;
    
    case "activeCreatePage":
      return <ClientCreatePage />;
    // For quantity
    case "activeQuantity":
      return <QuantityDataTable />;
    case "activeMealPlanner":
      return <MealPlannerList />; 
    case "activeWeeklyMenu":
      return <WeeklyMenu />;
    case "activeDailyOrders":
        return <DailyOrdersPage />; 
    case "activeSiteContent":
      return <SiteContentEditor />;
        

    default:
      return <TileContainer />;
  
  }
}

export const dynamic = "force-dynamic";
