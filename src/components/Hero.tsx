import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { userAutenticated } from "@/Services/auth/UserAutenticated";
import { IoIosAddCircle } from 'react-icons/io';
import { CgMenuGridR } from 'react-icons/cg';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { FiUsers, FiSettings } from 'react-icons/fi';

interface IProps {
  setRatio: (value: number) => void;
}

export default function Hero({ setRatio }: IProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const user = userAutenticated.checkUser();
    setIsAuthenticated(!!user && Object.keys(user).length > 0);
  }, []);

  return (
    <div className="w-full h-screen relative bg-grey">

      {isAuthenticated ? (
        <>
        <div className="w-full min-h-screen relative bg-gradient-to-b from-gray-50 to-gray-100 py-16">
              <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-4 text-[#373a4e]">Trinas - Gestão de Encomendas</h1>
                <p className="text-gray-600 text-center mb-12 text-lg">Sistema integrado para gestão eficiente de encomendas e clientes</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Card para Criação de Encomenda */}
                  <Link href="/order/view-orders" className="group">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 backdrop-blur-sm rounded-2xl shadow-lg p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col items-center cursor-pointer h-full border border-indigo-100 hover:border-indigo-200">
                      <div className="bg-indigo-100 p-4 rounded-full mb-4 group-hover:bg-indigo-200 transition-colors duration-300">
                        <IoIosAddCircle className="text-4xl text-indigo-600" />
                      </div>
                      <h2 className="text-xl font-semibold mb-2 text-indigo-900 text-center">Criação de Encomenda</h2>
                      <p className="text-indigo-600 text-center">Adicione novas encomendas ao sistema</p>
                    </div>
                  </Link>
      
        
                  {/* Card para Lista de Encomendas do Dia */}
                  <Link href="/order/daily-orders">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col items-center cursor-pointer h-full border border-gray-100">
                      <div className="bg-[#373a4e]/10 p-4 rounded-full mb-4">
                        <HiOutlineDocumentText className="text-4xl text-[#373a4e]" />
                      </div>
                      <h2 className="text-xl font-semibold mb-2 text-gray-800 text-center">Encomendas do Dia</h2>
                      <p className="text-gray-600 text-center">Visualize todas as encomendas diárias</p>
                    </div>
                  </Link>
        
                  {/* Card para Lista de Clientes */}
                  <Link href="/client/list">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col items-center cursor-pointer h-full border border-gray-100">
                      <div className="bg-[#373a4e]/10 p-4 rounded-full mb-4">
                        <FiUsers className="text-4xl text-[#373a4e]" />
                      </div>
                      <h2 className="text-xl font-semibold mb-2 text-gray-800 text-center">Lista de Clientes</h2>
                      <p className="text-gray-600 text-center">Gerencie todos os clientes cadastrados</p>
                    </div>
                  </Link>

                  {/* Card para Configurações */}
                  <Link href="/dashboard">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col items-center cursor-pointer h-full border border-gray-100">
                      <div className="bg-[#373a4e]/10 p-4 rounded-full mb-4">
                        <FiSettings className="text-4xl text-[#373a4e]" />
                      </div>
                      <h2 className="text-xl font-semibold mb-2 text-gray-800 text-center">Configurações</h2>
                      <p className="text-gray-600 text-center">Gerencie as configurações do sistema</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-8">
          <Image
            src={"/intro-1.png"}
            alt="Trinas - Gestão de Encomendas"
            width={400}
            height={400}
            className="rounded-2xl shadow-lg mb-8 transition-all duration-300 hover:scale-105"
            priority
          />
          <h1 className="text-4xl font-bold text-center mb-4 text-[#373a4e]">Bem-vindo ao Trinas</h1>
          <p className="text-gray-600 text-center text-lg max-w-2xl">Sistema integrado para gestão eficiente de encomendas e clientes.</p>
        </div>
      )}
    </div>
  );
}
