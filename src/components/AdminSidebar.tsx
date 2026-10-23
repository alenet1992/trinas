import React from "react";
import { AiFillHome } from "react-icons/ai";
import { FiUsers, FiUserPlus, FiToggleLeft, FiUnderline, FiGlobe } from "react-icons/fi";
import { HiOutlineDocumentText } from "react-icons/hi";
import { AiOutlineClockCircle } from "react-icons/ai";
import { setNavActive } from "@/utils/AdminNavSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Store/store";

export default function AdminSidebar() {
  const dispatch = useDispatch();
  const activeNav = useSelector((state: RootState) => state.AdminNav.ActiveNav);

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
          label: "Lista de Utilizadores",
          icon: FiUserPlus,
          action: "activeCreatePage",
        },
      ],
    },
    {      category: "Gestão de take away",
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
        {
          label: "Ementa da semana",
          icon: FiUnderline,
          action: "activeWeeklyMenu",
        },
        {
          label: "Encomendas do Dia",
          icon: AiOutlineClockCircle,
          action: "activeDailyOrders",
        },
      ],
    },
    {
      category: "Website",
      items: [
        {
          label: "Conteúdo do site",
          icon: FiGlobe,
          action: "activeSiteContent",
        },
      ],
    },
  ];

  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-white/80 backdrop-blur-xl border-r border-line overflow-y-auto z-50 hidden md:block">
      {/* Header */}
      <div className="p-6 border-b border-line">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-brand rounded-xl shadow-sm flex items-center justify-center">
            <HiOutlineDocumentText className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-ink">Dashboard</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-6">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-2">
            <h3 className="text-[0.7rem] font-semibold text-ink-muted uppercase tracking-wider px-3 py-2">
              {section.category}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item, itemIndex) => {
                const IconComponent = item.icon;
                return (
                  <li key={itemIndex}>
                    <button
                      onClick={() => dispatch(setNavActive(item.action))}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 text-left rounded-full transition-all duration-200 group ${activeNav === item.action ? 'bg-brand text-white shadow-md shadow-brand/20' : 'text-ink hover:bg-brand-50 hover:text-brand'}`}
                    >
                      <IconComponent className={`w-5 h-5 transition-colors ${activeNav === item.action ? 'text-white' : 'text-ink-muted group-hover:text-brand'}`} />
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
