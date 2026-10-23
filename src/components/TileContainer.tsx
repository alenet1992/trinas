"use client";

import React, { useMemo } from "react";
import useSWR from "swr";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { FiUsers, FiShoppingBag, FiCalendar } from "react-icons/fi";
import { CgMenuGridR } from "react-icons/cg";
import { MdOutlineCategory } from "react-icons/md";
import { TfiStatsUp } from "react-icons/tfi";
import StatsTiles from "@/components/StatsTiles";
import { RootState } from "@/Store/store";
import { get_all_clientes } from "@/Services/Admin/product";
import { get_all_orders } from "@/Services/Admin/order";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(value);

export default function TileContainer() {
  const products = useSelector((state: RootState) => state.Admin.product);
  const categories = useSelector((state: RootState) => state.Admin.category);
  const productLoading = useSelector((state: RootState) => state.Admin.productLoading);
  const catLoading = useSelector((state: RootState) => state.Admin.catLoading);

  const { data: clientData, isLoading: clientLoading } = useSWR(
    "/gettingAllClientesFOrAdmin",
    get_all_clientes
  );
  const { data: orderData, isLoading: orderLoading } = useSWR(
    "/gettingAllOrdersForDashboard",
    get_all_orders
  );

  // Encomendas de hoje — mesmo critério da página "Encomendas do Dia" (data de criação)
  const today = useMemo(() => {
    const orders: any[] = orderData?.success ? orderData.data : [];
    const todayString = format(new Date(), "yyyy-MM-dd");
    const todayOrders = orders.filter(
      (order) => order?.createdAt && format(new Date(order.createdAt), "yyyy-MM-dd") === todayString
    );
    return {
      count: todayOrders.length,
      revenue: todayOrders.reduce((sum, order) => sum + (Number(order?.totalPrice) || 0), 0),
      pending: todayOrders.filter((order) => order?.status !== "delivered").length,
    };
  }, [orderData]);

  const tiles = [
    {
      Icon: TfiStatsUp,
      title: "Facturação do dia",
      value: formatPrice(today.revenue),
      loading: orderLoading,
    },
    {
      Icon: FiCalendar,
      title: "Encomendas do dia",
      value: today.count,
      hint: `${today.pending} por entregar`,
      loading: orderLoading,
    },
    {
      Icon: FiShoppingBag,
      title: "Total de encomendas",
      value: orderData?.success ? orderData.data.length : "-",
      loading: orderLoading,
    },
    {
      Icon: FiUsers,
      title: "Total de clientes",
      value: clientData?.success ? clientData.data.length : "-",
      loading: clientLoading,
    },
    {
      Icon: CgMenuGridR,
      title: "Pratos",
      value: products?.length ?? "-",
      loading: productLoading,
    },
    {
      Icon: MdOutlineCategory,
      title: "Tipos de pratos",
      value: categories?.length ?? "-",
      loading: catLoading,
    },
  ];

  return (
    <div className="w-full max-w-6xl pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Resumo</h1>
        <p className="text-sm !text-ink-muted">Visão geral de hoje, {format(new Date(), "dd/MM/yyyy")}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {tiles.map((tile) => (
          <StatsTiles key={tile.title} {...tile} />
        ))}
      </div>
    </div>
  );
}
