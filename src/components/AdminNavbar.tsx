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
      <div className="glass-header rounded-full px-6 py-3 flex justify-between items-center transition-all duration-300">
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
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/order/view-orders')}
            className="bg-brand hover:bg-brand-dark text-white text-sm font-medium px-4 py-2 rounded-full shadow-sm hover:shadow transition-all duration-200 inline-flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <span>Criar encomenda</span>
          </button>

          <button
            onClick={handleLogout}
            className="bg-brand hover:bg-brand-dark text-white text-sm font-medium px-4 py-2 rounded-full shadow-sm hover:shadow transition-all duration-200 inline-flex items-center space-x-2"
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
