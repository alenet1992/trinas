import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { userAutenticated } from "@/Services/auth/UserAutenticated";
import { IoIosAddCircle } from 'react-icons/io';
import { CgMenuGridR } from 'react-icons/cg';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { FiUsers } from 'react-icons/fi';

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
        <div className="w-full min-h-screen relative bg-gray-50 py-12">
              <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-center mb-12 text-gray-800">Trinas - Gestão de Encomendas</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Card para Criação de Encomenda */}
                  <Link href="/order/view-orders">
                    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 flex flex-col items-center cursor-pointer h-full">
                      <div className="bg-orange-100 p-4 rounded-full mb-4">
                        <IoIosAddCircle className="text-4xl text-orange-600" />
                      </div>
                      <h2 className="text-xl font-semibold mb-2 text-gray-800 text-center">Criação de Encomenda</h2>
                      <p className="text-gray-600 text-center">Adicione novas encomendas ao sistema</p>
                    </div>
                  </Link>
        
                  {/* Card para Ementa da Semana */}
                  <Link href="/product/weekly-menu">
                    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 flex flex-col items-center cursor-pointer h-full">
                      <div className="bg-blue-100 p-4 rounded-full mb-4">
                        <CgMenuGridR className="text-4xl text-blue-600" />
                      </div>
                      <h2 className="text-xl font-semibold mb-2 text-gray-800">Ementa da Semana</h2>
                      <p className="text-gray-600 text-center">Gerencie o menu semanal de refeições</p>
                    </div>
                  </Link>
        
                  {/* Card para Lista de Encomendas do Dia */}
                  <Link href="/order/daily-orders">
                    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 flex flex-col items-center cursor-pointer h-full">
                      <div className="bg-green-100 p-4 rounded-full mb-4">
                        <HiOutlineDocumentText className="text-4xl text-green-600" />
                      </div>
                      <h2 className="text-xl font-semibold mb-2 text-gray-800">Encomendas do Dia</h2>
                      <p className="text-gray-600 text-center">Visualize todas as encomendas diárias</p>
                    </div>
                  </Link>
        
                  {/* Card para Lista de Clientes */}
                  <Link href="/client/list">
                    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 flex flex-col items-center cursor-pointer h-full">
                      <div className="bg-purple-100 p-4 rounded-full mb-4">
                        <FiUsers className="text-4xl text-purple-600" />
                      </div>
                      <h2 className="text-xl font-semibold mb-2 text-gray-800">Lista de Clientes</h2>
                      <p className="text-gray-600 text-center">Gerencie todos os clientes cadastrados</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
        </>
      ) : (
        <Image
        src={"/intro-1.png"}
        alt="no Image"
        fill={false}
        width={300}
        height={300}
        className="m-auto"
      />
      )}
    </div>
  );
}
