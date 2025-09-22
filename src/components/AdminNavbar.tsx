"use client";

import { setNavActive } from "@/utils/AdminNavSlice";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";

export default function AdminNavbar() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.clear();
    location.reload();
  };

  return (
    <div
      className="fixed z-30 w-[calc(100%-16rem)] px-6 py-4"
    >
      <div className="bg-white/90 backdrop-blur-sm border border-gray-100 shadow-md rounded-3xl px-6 py-3 flex justify-between items-center transition-all duration-300">
        <div className="flex-1">
          <div className="dropdown md:hidden">
            <label tabIndex={0} className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 inline-flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-4 shadow-lg bg-white/95 backdrop-blur-sm rounded-2xl w-56 border border-gray-100 space-y-1"
            >
              <li onClick={() => dispatch(setNavActive("Base"))}>
                <button className="px-4 py-2 text-gray-700 hover:bg-[#373a4e]/10 hover:text-[#373a4e] rounded-xl transition-all duration-200 font-medium text-sm">Homepage</button>
              </li>
              <li onClick={() => dispatch(setNavActive("activeCategories"))}>
                <button className="px-4 py-2 text-gray-700 hover:bg-[#373a4e]/10 hover:text-[#373a4e] rounded-xl transition-all duration-200 font-medium text-sm">Categorias</button>
              </li>
              <li onClick={() => dispatch(setNavActive("activeProducts"))}>
                <button className="px-4 py-2 text-gray-700 hover:bg-[#373a4e]/10 hover:text-[#373a4e] rounded-xl transition-all duration-200 font-medium text-sm">Products</button>
              </li>
              <li onClick={() => dispatch(setNavActive("activePendingOrder"))}>
                <button className="px-4 py-2 text-gray-700 hover:bg-[#373a4e]/10 hover:text-[#373a4e] rounded-xl transition-all duration-200 font-medium text-sm">Pending orders</button>
              </li>
              <li onClick={() => dispatch(setNavActive("activeDeliveredOrder"))}>
                <button className="px-4 py-2 text-gray-700 hover:bg-[#373a4e]/10 hover:text-[#373a4e] rounded-xl transition-all duration-200 font-medium text-sm">Completed orders</button>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLogout}
            className="bg-[#373a4e] hover:bg-[#2f3141] text-white text-sm font-medium px-4 py-2 rounded-full shadow-sm hover:shadow transition-all duration-200 inline-flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
