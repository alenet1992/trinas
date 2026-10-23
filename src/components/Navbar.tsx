"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { RootState } from "@/Store/store";
import { useSelector } from "react-redux";

export default function Navbar() {
  const router = useRouter();
  const [Scrolled, setScrolled] = useState(false);
  const user = useSelector((state: RootState) => state.User.userData);

  useEffect(() => {
    window.onscroll = () => {
      setScrolled(window.pageYOffset < 30 ? false : true);
      return () => (window.onscroll = null);
    };
  }, [Scrolled]);

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.clear();
    location.reload();
  };

  // Sem sessão a rota de entrada mostra o site público, com o seu próprio menu
  if (!user) return null;

  return (
    <div
      className={`navbar ${
        Scrolled ? "glass-header" : "bg-transparent"
      }  fixed text-white top-0 left-0 z-50`}
    >
      <div className="navbar-start">
      </div>
      <div className="navbar-end">
        <div className="flex-none text-right mr">
          {user ? (
            <div className="flex items-center justify-center  min-h-full">
              <button onClick={handleLogout} className="bg-brand hover:bg-brand-dark text-white text-sm font-medium px-4 py-2 rounded-full shadow-sm hover:shadow transition-all duration-200 mx-2">
                logout
              </button>
              {/* <button
                onClick={() => router.push("/order/create-order")}
                className="btn btn-circle  mx-2"
              >
                <FaCartArrowDown className="text-white text-xl" />
              </button> */}
              {/* <button
                onClick={() => router.push("/bookmark")}
                className="btn btn-circle  mx-2"
              >
                <MdFavorite className="text-white text-xl" />
              </button>
              <button
                onClick={() => router.push("/order/view-orders")}
                className="btn btn-circle  mx-2"
              >
                <CiDeliveryTruck className="text-white text-xl" />
              </button> */}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
