import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/Store/store";
import TileContainer from "./TileContainer";
import ProductDataTable from "../app/dashboard/Product/ProductDataTable";
import CategoryDataTable from "../app/dashboard/Category/CategoryDataTable";
import PendingOrdersDataTable from "./PendingOrdersDataTable";
import CompletedOrderDataTable from "./CompletedOrderDataTable";
import ClientListPage from "@/app/dashboard/client/ClientListPage";
import QuantityDataTable from "@/app/dashboard/quantity/QuantityDataTable";

export default function SuperComponent() {
  const navActive = useSelector((state: RootState) => state.AdminNav.ActiveNav);
  switch (navActive) {
    case "Base":
      return <TileContainer />;
    case "activeProducts":
      return <ProductDataTable />;
    case "activeCategories":
      return <CategoryDataTable />;
    case "activePendingOrder":
      return <PendingOrdersDataTable />;
    case "activeDeliveredOrder":
      return <CompletedOrderDataTable />;
    // For products
    case "activeClientList":
      return <ClientListPage />;
    // For quantity
    case "activeQuantity":
      return <QuantityDataTable />;

    default:
      return <TileContainer />;
  }
}

export const dynamic = "force-dynamic";
