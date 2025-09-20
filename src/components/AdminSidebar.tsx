import React from "react";
import { AiFillHome } from "react-icons/ai";
import { FiUsers, FiUserPlus, FiSettings, FiToggleLeft, FiUnderline } from "react-icons/fi";
import { HiOutlineDocumentText } from "react-icons/hi";
import { setNavActive } from "@/utils/AdminNavSlice";
import { useDispatch } from "react-redux";

export default function AdminSidebar() {
  const dispatch = useDispatch();

  const menuItems = [
    {
      category: "Principal",
      items: [
        {
          label: "Home",
          icon: AiFillHome,
          action: "Base",
        },
      ],
    },
    {
      category: "Gestão de Clientes",
      items: [
        {
          label: "Lista de Clientes",
          icon: FiUsers,
          action: "activeClientList",
        },
      ],
    },
    {
      category: "Gestão de Utilizadores",
      items: [
        {
          label: "Adicionar Utilizador",
          icon: FiUserPlus,
          action: "activeCreatePage",
        },
      ],
    },
    {
      category: "Gestão de take away",
      items: [
        {
          label: "Tipos de pratos",
          icon: FiToggleLeft,
          action: "activeCategories",
        },
        {
          label: "Pratos",
          icon: FiUnderline,
          action: "activeProducts",
        },
      ],
    },  
  ];

  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-slate-50 to-slate-100 border-r border-slate-200 shadow-lg overflow-y-auto z-50 hidden md:block">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <HiOutlineDocumentText className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-6">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
              {section.category}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item, itemIndex) => {
                const IconComponent = item.icon;
                return (
                  <li key={itemIndex}>
                    <button
                      onClick={() => dispatch(setNavActive(item.action))}
                      className="w-full flex items-center space-x-3 px-3 py-2.5 text-left text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200 group"
                    >
                      <IconComponent className="w-5 h-5 text-slate-500 group-hover:text-blue-600 transition-colors" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}
