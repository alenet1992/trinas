"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { TailSpin } from "react-loader-spinner";
import Cookies from 'js-cookie';

// Interface para o tipo Product
interface Product {
  _id: string;
  name: string;
  description?: string;
  category: {
    name: string;
  };
}

// Interface para o menu semanal
interface WeeklyMenu {
  [day: string]: Product[];
}

// Interface para múltiplas semanas
interface WeeklyMenus {
  [weekIndex: string]: WeeklyMenu;
}

// Dias da semana
const weekDays = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo"
];

export default function WeeklyMenu() {
  const [loader, setLoader] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(0); // 0 = semana atual, -1 = semana anterior, 1 = próxima semana
  // Estado para armazenar os produtos carregados da API
  const [products, setProducts] = useState<Product[]>([]);
  // Estrutura para armazenar ementas de múltiplas semanas
  const [weeklyMenus, setWeeklyMenus] = useState<WeeklyMenus>({
    // Semana atual (0)
    "0": {
      "Segunda-feira": [],
      "Terça-feira": [],
      "Quarta-feira": [],
      "Quinta-feira": [],
      "Sexta-feira": [],
      "Sábado": [],
      "Domingo": []
    }
  });
  const [selectedDay, setSelectedDay] = useState("Segunda-feira");
  // Estado para armazenar o termo de pesquisa
  const [searchTerm, setSearchTerm] = useState("");
  
  // Função para obter o texto da semana atual
  // Função para buscar produtos da API
  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/common/product/getProduct');
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
      } else {
        toast.error('Erro ao carregar produtos: ' + data.message);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      toast.error('Erro ao carregar produtos. Por favor, tente novamente.');
    }
  };

  // Função para carregar a ementa semanal existente
  const fetchWeeklyMenu = async (weekIndex: number) => {
    try {
      const response = await fetch(`/api/common/weeklyMenu/get-weekly-menu?weekIndex=${weekIndex}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        // Atualizar o estado com os dados da ementa semanal
        setWeeklyMenus(prevMenus => ({
          ...prevMenus,
          [weekIndex]: data.data.menu
        }));
      } else {
        // Se não houver ementa para esta semana, inicializar uma nova
        initializeWeekIfNeeded(weekIndex);
      }
    } catch (error) {
      console.error('Erro ao carregar a ementa semanal:', error);
      toast.error('Erro ao carregar a ementa. Inicializando uma nova ementa.');
      initializeWeekIfNeeded(weekIndex);
    }
  };

  // Carregar produtos e ementa quando o componente é montado
  useEffect(() => {
    fetchProducts();
    fetchWeeklyMenu(currentWeek);
  }, []);
  
  // Carregar ementa quando a semana muda
  useEffect(() => {
    fetchWeeklyMenu(currentWeek);
  }, [currentWeek]);

  const getWeekText = () => {
    if (currentWeek === 0) return "Semana Atual";
    if (currentWeek < 0) return `${Math.abs(currentWeek)} Semana${Math.abs(currentWeek) > 1 ? 's' : ''} Anterior${Math.abs(currentWeek) > 1 ? 'es' : ''}`;
    return `${currentWeek} Semana${currentWeek > 1 ? 's' : ''} Seguinte${currentWeek > 1 ? 's' : ''}`;
  };
  
  // Função para obter as datas da semana atual
  const getWeekDates = (weekIndex: number): Date[] => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = domingo, 1 = segunda, ..., 6 = sábado
    
    // Ajustar para que a semana comece na segunda-feira (0 = segunda, ..., 6 = domingo)
    const daysSinceMonday = currentDay === 0 ? 6 : currentDay - 1;
    
    // Data da segunda-feira da semana atual
    const mondayOfCurrentWeek = new Date(today);
    mondayOfCurrentWeek.setDate(today.getDate() - daysSinceMonday);
    
    // Ajustar para a semana selecionada
    const mondayOfSelectedWeek = new Date(mondayOfCurrentWeek);
    mondayOfSelectedWeek.setDate(mondayOfCurrentWeek.getDate() + (weekIndex * 7));
    
    // Criar um array com as datas da semana selecionada
    const weekDates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(mondayOfSelectedWeek);
      date.setDate(mondayOfSelectedWeek.getDate() + i);
      weekDates.push(date);
    }
    
    return weekDates;
  };
  
  // Função para formatar a data no formato dia/mês
  const formatDate = (date: Date): string => {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  };
  
  // Função para navegar para a semana anterior
  const goToPreviousWeek = () => {
    const newWeek = currentWeek - 1;
    setCurrentWeek(newWeek);
    initializeWeekIfNeeded(newWeek);
  };
  
  // Função para navegar para a próxima semana
  const goToNextWeek = () => {
    const newWeek = currentWeek + 1;
    setCurrentWeek(newWeek);
    initializeWeekIfNeeded(newWeek);
  };
  
  // Função para voltar para a semana atual
  const goToCurrentWeek = () => {
    setCurrentWeek(0);
    initializeWeekIfNeeded(0);
    toast.info('Voltando para a semana atual');
  };
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  // Função para inicializar uma nova semana se não existir
  const initializeWeekIfNeeded = (weekIndex: number) => {
    setWeeklyMenus(prevMenus => {
      if (!prevMenus[weekIndex]) {
        return {
          ...prevMenus,
          [weekIndex]: {
            "Segunda-feira": [],
            "Terça-feira": [],
            "Quarta-feira": [],
            "Quinta-feira": [],
            "Sexta-feira": [],
            "Sábado": [],
            "Domingo": []
          }
        };
      }
      return prevMenus;
    });
  };

  // Função para obter a ementa da semana atual
  const getCurrentWeekMenu = () => {
    // Inicializa a semana se não existir
    if (!weeklyMenus[currentWeek]) {
      initializeWeekIfNeeded(currentWeek);
      return {
        "Segunda-feira": [],
        "Terça-feira": [],
        "Quarta-feira": [],
        "Quinta-feira": [],
        "Sexta-feira": [],
        "Sábado": [],
        "Domingo": []
      };
    }
    return weeklyMenus[currentWeek];
  };

  // Função para adicionar produto ao dia selecionado
  const addProductToDay = (product: Product) => {
    const weekMenu = getCurrentWeekMenu();
    
    if (!weekMenu[selectedDay].some(item => item._id === product._id)) {
      setWeeklyMenus({
        ...weeklyMenus,
        [currentWeek]: {
          ...weekMenu,
          [selectedDay]: [...weekMenu[selectedDay], product]
        }
      });
    } else {
      toast.warning(`${product.name} já está adicionado a ${selectedDay}`);
    }
  };

  // Função para remover produto do dia selecionado
  const removeProductFromDay = (productId: string) => {
    const weekMenu = getCurrentWeekMenu();
    
    setWeeklyMenus({
      ...weeklyMenus,
      [currentWeek]: {
        ...weekMenu,
        [selectedDay]: weekMenu[selectedDay].filter(product => product._id !== productId)
      }
    });
    toast.info("Produto removido da ementa");
  };

  // Função para salvar a ementa semanal
  const saveWeeklyMenu = async () => {
    setLoader(true);
    try {
      // Obter as datas da semana atual
      const weekDates = getWeekDates(currentWeek);
      const startDate = weekDates[0]; // Segunda-feira
      const endDate = weekDates[6];   // Domingo
      
      // Preparar os dados para enviar à API
      const weeklyMenuData = {
        weekIndex: currentWeek,
        startDate: startDate,
        endDate: endDate,
        menu: getCurrentWeekMenu()
      };
      
      // Chamar a API para salvar a ementa semanal
      const response = await fetch('/api/common/weeklyMenu/save-weekly-menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${Cookies.get('token')}`
        },
        body: JSON.stringify(weeklyMenuData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(`Ementa da ${getWeekText()} salva com sucesso!`);
      } else {
        toast.error(`Erro ao salvar a ementa: ${data.message}`);
      }
    } catch (error) {
      console.error('Erro ao salvar a ementa semanal:', error);
      toast.error('Erro ao salvar a ementa. Por favor, tente novamente.');
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="w-full h-full">
      <ToastContainer />
      <div className="flex flex-wrap">
        <div className="w-full px-4">
          <div className="mt-3 relative flex flex-col min-w-0 break-words w-full mb-6 shadow-md rounded-3xl bg-white/90 backdrop-blur-sm border border-gray-100">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                  <h3 className="font-semibold text-lg text-gray-800">Gestão da Ementa Semanal</h3>
                  <div className="flex items-center mt-2">
                    <span className="text-sm font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                      {getWeekText()}
                    </span>
                  </div>
                </div>
                <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                  <div className="flex justify-end items-center space-x-2">
                    <button
                      onClick={goToPreviousWeek}
                      className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-bold px-3 py-1 rounded-full outline-none focus:outline-none ease-linear transition-all duration-150 flex items-center shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Semana Anterior
                    </button>
                    
                    {currentWeek !== 0 && (
                      <button
                        onClick={goToCurrentWeek}
                        className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-bold px-3 py-1 rounded-full outline-none focus:outline-none ease-linear transition-all duration-150 shadow-sm"
                      >
                        Semana Atual
                      </button>
                    )}
                    
                    <button
                      onClick={goToNextWeek}
                      className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-bold px-3 py-1 rounded-full outline-none focus:outline-none ease-linear transition-all duration-150 flex items-center shadow-sm"
                    >
                      Próxima Semana
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    
                    <Link
                      href="/dashboard"
                      className="bg-blue-600 text-white active:bg-blue-700 text-xs font-bold uppercase px-3 py-1 rounded-full outline-none focus:outline-none ease-linear transition-all duration-150 shadow-sm"
                    >
                      Voltar ao Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {loader ? (
              <div className="w-full flex-col h-96 flex items-center justify-center">
                <TailSpin
                height="50"
                width="50"
                color="#2563eb"
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
                <p className="text-sm mt-3 font-semibold text-gray-700">
                  A salvar a ementa semanal...
                </p>
              </div>
            ) : (
              <div className="block w-full overflow-x-auto">
                {/* Seleção de dia da semana */}
                <div className="flex flex-wrap mb-4 px-4 py-2">
                  <div className="w-full mb-4 px-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Selecione o dia da semana:</h4>
                    <div className="flex flex-wrap gap-2">
                      {weekDays.map((day, index) => {
                        const weekDates = getWeekDates(currentWeek);
                        const date = weekDates[index];
                        const formattedDate = date ? formatDate(date) : '';
                        
                        return (
                          <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedDay === day
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm'
                              }`}
                          >
                            <div className="flex flex-col items-center">
                              <span>{day.split('-')[0]}</span>
                              <span className="text-xs mt-1">{formattedDate}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Área de seleção de produtos */}
                <div className="flex flex-wrap px-4 py-2">
                  {/* Lista de produtos disponíveis */}
                  <div className="w-full md:w-1/2 pr-2">
                    <h4 className="font-semibold text-gray-700 mb-2">Produtos Disponíveis:</h4>
                    
                    {/* Campo de pesquisa */}
                    <div className="relative mb-3">
                      <input
                        type="text"
                        placeholder="Pesquisar produtos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 pl-10 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                      />
                      {/* Ícone de pesquisa */}
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      {/* Ícone para limpar pesquisa */}
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm("")}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                    
                    <div className="bg-gray-50/70 p-4 rounded-3xl max-h-96 overflow-y-auto shadow-inner border border-gray-100">
                      
                      {(() => {
                        const filteredProducts = products.filter((product: Product) => 
                          product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
                        );
                        
                        if (filteredProducts.length === 0) {
                          return (
                            <div className="p-4 text-center text-gray-500">
                              <svg className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <p>Nenhum produto encontrado para "{searchTerm}"</p>
                              <button 
                                onClick={() => setSearchTerm("")}
                                className="mt-2 text-blue-500 hover:text-blue-700 text-sm font-medium"
                              >
                                Limpar pesquisa
                              </button>
                            </div>
                          );
                        }
                        
                        return filteredProducts.map((product: Product) => (
                        <div
                          key={product._id}
                          className="mb-2 p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100 hover:border-blue-100"
                          onClick={() => addProductToDay(product)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h5 className="font-medium text-gray-800">{product.name}</h5>
                              <p className="text-sm text-gray-600">{product.description}</p>
                              <span className="text-xs px-2 py-1 bg-blue-50 rounded-full text-blue-700">
                                {product.category.name}
                              </span>
                            </div>
                            <button className="p-1 bg-blue-50 hover:bg-blue-100 rounded-full">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>
                          </div>
                        ));
                      })()}
                      </div>
                  </div>

                  {/* Produtos selecionados para o dia */}
                  <div className="w-full md:w-1/2 pl-2 mt-4 md:mt-0">
                    <h4 className="font-semibold text-gray-700 mb-2">Produtos para {selectedDay}:</h4>
                    <div className="bg-gray-50/70 p-4 rounded-3xl min-h-[200px] max-h-96 overflow-y-auto shadow-inner border border-gray-100">
                      {getCurrentWeekMenu()[selectedDay]?.length > 0 ? (
                        getCurrentWeekMenu()[selectedDay].map((product) => (
                          <div
                            key={product._id}
                            className="mb-2 p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h5 className="font-medium text-gray-800">{product.name}</h5>
                                <p className="text-sm text-gray-600">{product.description}</p>
                                <span className="text-xs px-2 py-1 bg-blue-50 rounded-full text-blue-700">
                                  {product.category.name}
                                </span>
                              </div>
                              <button
                                onClick={() => removeProductFromDay(product._id)}
                                className="p-1 bg-gray-100 hover:bg-red-100 rounded-full shadow-sm"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center h-40">
                          <p className="text-gray-500">Nenhum produto selecionado para este dia.</p>
                          <p className="text-sm text-gray-400">Clique nos produtos à esquerda para adicionar.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Visualização da ementa completa */}
                <div className="px-4 py-6 mt-6 bg-white rounded-3xl shadow-sm border border-gray-100">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Visualização da Ementa Semanal - {getWeekText()}
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                      <thead className="bg-gradient-to-r from-blue-50 to-blue-100 text-gray-800 shadow-sm">
                        <tr>
                          {weekDays.map((day, index) => {
                            // Extrair apenas o nome do dia (sem o sufixo -feira)
                            const dayName = day.split('-')[0];
                            const weekDate = getWeekDates(currentWeek)[index];
                            const formattedDate = weekDate ? formatDate(weekDate) : '';
                            
                            return (
                              <th key={day} className="py-4 px-5 text-left border-b border-gray-200">
                                <div className="flex flex-col">
                                  <span className="font-semibold">{dayName}</span>
                                  <span className="text-xs text-gray-500 font-normal mt-1">{formattedDate}</span>
                                </div>
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {weekDays.map((day) => (
                            <td key={day} className="py-4 px-5 border-t hover:bg-gray-50 transition-colors duration-150">
                              {getCurrentWeekMenu()[day]?.length > 0 ? (
                                <ul className="space-y-3">
                                  {getCurrentWeekMenu()[day].map((product) => {
                                    // Definir cores diferentes para cada categoria
                                    let categoryColor = "bg-gray-200 text-gray-700";
                                    // if (product.category?.name.toLowerCase().includes("peixe")) {
                                    //   categoryColor = "bg-blue-100 text-blue-700";
                                    // } else if (product.category?.name.toLowerCase().includes("carne")) {
                                    //   categoryColor = "bg-red-100 text-red-700";
                                    // } else if (product.category?.name.toLowerCase().includes("sopa")) {
                                    //   categoryColor = "bg-amber-100 text-amber-700";
                                    // } else if (product.category?.name.toLowerCase().includes("veg")) {
                                    //   categoryColor = "bg-green-100 text-green-700";
                                    // }
                                    
                                    return (
                                      <li key={product._id} className="p-2 rounded-lg bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-100">
                                        <div className="flex justify-between items-center">
                                          <span className="font-medium text-gray-800">{product.name}</span>
                                          <span className={`text-xs px-2 py-1 rounded-full ${categoryColor}`}>
                                            {product.category.name}
                                          </span>
                                        </div>
                                      </li>
                                    );
                                  })}
                                </ul>
                              ) : (
                                <div className="flex items-center justify-center h-16 text-sm text-gray-400 bg-gray-50/70 rounded-lg border border-dashed border-gray-200 px-5">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                  </svg>
                                  Nenhum prato definido
                                </div>
                              )}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Botão para salvar */}
                <div className="px-4 py-4 flex justify-end">
                  <button
                    onClick={saveWeeklyMenu}
                    className="bg-gradient-to-r from-blue-600 to-blue-800 text-white active:from-blue-700 active:to-blue-900 font-bold uppercase text-sm px-6 py-3 rounded-full shadow-md hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  >
                    Salvar Ementa Semanal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}