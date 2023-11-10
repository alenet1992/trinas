"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/store";

export default function GettingDatasLength() {
  const catData = useSelector((state: RootState) => state.Admin.category);

  const prodData = useSelector((state: RootState) => state.Admin.product);

  const orderData = useSelector((state: RootState) => state.Admin.Order);

  return [
    {
      icon: "FaUserAlt",
      color: "text-green-600",
      title: "Total de Clientes",
      count: "-",
    },
    {
      icon: "GiAbstract010",
      color: "text-blue-600",
      title: "Total Products",
      count: "-",
    },
    {
      icon: "CgMenuGridR",
      color: "text-purple-600",
      title: "Total de pratos",
      count: "-",
    },
    {
      icon: "AiOutlineClockCircle",
      color: "text-yellow-600",
      title: "Numero de encomendas",
      count: "-",
    },
    {
      icon: "GrCompliance",
      color: "text-orange-600",
      title: "Gastos em materia prima",
      count: "-",
    },
    {
      icon: "TfiStatsUp",
      color: "text-orange-600",
      title: "Facturação do dia",
      count: +852,
    },
  ];
}
