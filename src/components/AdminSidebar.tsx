import React from "react";
import { AiFillHome } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { GiLoincloth } from "react-icons/gi";
import { setNavActive } from "@/utils/AdminNavSlice";
import { useDispatch } from "react-redux";

export default function AdminSidebar() {
  const dispatch = useDispatch();
  return (
    <div className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6 w-60 hidden dark:text-black md:block bg-white h-full">
      <h1 className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0">
        {/* <RxDashboard className="mx-2" /> */}
        Dashboard
      </h1>
      <div className="w-full ">
        <hr className="my-4 md:min-w-full" />

        <ul className="flex flex-col items-start justify-center">
          <li
            onClick={() => dispatch(setNavActive("Base"))}
            className="py-3 px-1 "
          >
            <button className="flex items-center justify-center">
              <AiFillHome className="mx-2" /> Home
            </button>
          </li>
        </ul>
        <hr className="my-4 md:min-w-full" />
        <ul>
          <li style={{ padding: "10px 0px 5px 0px" }}>Gestão de clientes</li>
          <li
            onClick={() => dispatch(setNavActive("activeClientList"))}
            className="py-3 px-1 "
          >
            <button className="flex items-center justify-center">
              <GiLoincloth className="mx-2" /> Cliente
            </button>
          </li>
        </ul>

        <hr className="my-4 md:min-w-full" />
        <ul style={{ opacity: 0.5, pointerEvents: "none" }}>
          <ul>
            <li style={{ padding: "10px 0px 5px 0px" }}>Gestão de pratos</li>
            <li
              onClick={() => dispatch(setNavActive("activeCategories"))}
              className="py-3 px-1 "
            >
              <button className="flex items-center justify-center">
                <BiCategory className="mx-2" /> Categories
              </button>
            </li>
            <li
              onClick={() => dispatch(setNavActive("activeQuantity"))}
              className="py-3 px-1 "
            >
              <button className="flex items-center justify-center">
                <BiCategory className="mx-2" /> Quantidade
              </button>
            </li>
            <li
              onClick={() => dispatch(setNavActive("activeProducts"))}
              className="py-3 px-1 "
            >
              <button className="flex items-center justify-center">
                <GiLoincloth className="mx-2" /> Products
              </button>
            </li>
          </ul>
          <hr className="my-4 md:min-w-full" />
          <ul>
            <li style={{ padding: "10px 0px 5px 0px" }}>Gestão de take-away</li>
            <li
              onClick={() => dispatch(setNavActive("activeCategories"))}
              className="py-3 px-1 "
            >
              <button className="flex items-center justify-center">
                <BiCategory className="mx-2" /> Novo Pedido
              </button>
            </li>
            <li
              onClick={() => dispatch(setNavActive("activeCategories"))}
              className="py-3 px-1 "
            >
              <button className="flex items-center justify-center">
                <BiCategory className="mx-2" /> Pedidos do dia
              </button>
            </li>
            <li
              onClick={() => dispatch(setNavActive("activeCategories"))}
              className="py-3 px-1 "
            >
              <button className="flex items-center justify-center">
                <BiCategory className="mx-2" /> Pedidos
              </button>
            </li>
          </ul>

          <hr className="my-4 md:min-w-full" />
          <ul>
            <li style={{ padding: "10px 0px 5px 0px" }}>
              Gestão de facturação
            </li>
            <li
              onClick={() => dispatch(setNavActive("activeCategories"))}
              className="py-3 px-1 "
            >
              <button className="flex items-center justify-center">
                <BiCategory className="mx-2" /> Facturação
              </button>
            </li>
          </ul>

          <hr className="my-4 md:min-w-full" />
          <ul>
            <li style={{ padding: "10px 0px 5px 0px" }}>Gestão de stock</li>
            {/* <li
              onClick={() => dispatch(setNavActive("activeCategories"))}
              className="py-3 px-1 "
            >
              <button className="flex items-center justify-center">
                <BiCategory className="mx-2" /> Entradas
              </button>
            </li> */}
          </ul>
          {/* 
          <hr className="my-4 md:min-w-full" />
          <ul>
            <li style={{ padding: "10px 0px 5px 0px" }}>Gestão de produção</li>
            <li
              onClick={() => dispatch(setNavActive("activeCategories"))}
              className="py-3 px-1 "
            >
              <button className="flex items-center justify-center">
                <BiCategory className="mx-2" /> Entrada de produções
              </button>
            </li>
            <li
              onClick={() => dispatch(setNavActive("activeCategories"))}
              className="py-3 px-1 "
            >
              <button className="flex items-center justify-center">
                <BiCategory className="mx-2" /> Evolução da produção
              </button>
            </li>
          </ul> */}

          {/* <li
            className="py-3 px-1 "
            onClick={() => dispatch(setNavActive("activePendingOrder"))}
          >
            <button className="flex items-center justify-center">
              <MdOutlinePendingActions className="mx-2" /> Pending orders
            </button>
          </li>
          <li
            className="py-3 px-1 "
            onClick={() => dispatch(setNavActive("activeDeliveredOrder"))}
          >
            <button className="flex items-center justify-center">
              <GrCompliance className="mx-2" />
              Completed orders
            </button>
          </li> */}

          {/* gestao do user */}
        </ul>
      </div>
    </div>
  );
}
