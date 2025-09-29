"use client";


import { useEffect, useState } from "react";

import { toast, ToastContainer } from "react-toastify";
import { AddClientDialog } from "@/components/AddClientDialog";
import Image from "next/image";
import { get_all_products } from "@/Services/Admin/product";
import { get_products_for_today, getCurrentDayOfWeek, getCurrentWeekIndex } from "@/Services/common/weeklyMenu";
import { getProductPricesByProductId } from "@/Services/Admin/product/price";
import Cookies from 'js-cookie';
import DailyOrdersPage from '@/app/order/daily-orders/page';
import ClientList from '@/app/client/list/page';
import { ClientModel } from '@/model/Client';

interface userData {
  email: String;
  role: String;
  _id: String;
  name: String;
}

interface ProductPrice {
  _id: string;
  value: string;
  product: string | { _id: string };
  quantity: {
    _id: string;
    name: string;
    value: string;
  };
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  prices?: ProductPrice[];
  selectedQuantity?: string;
  outOfStock?: boolean;
  quantityIndex?: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  createdAt: Date;
  orderName?: string;
  orderType?: 'takeaway' | 'delivery';
  pickupTime?: string | Date | null;
}

export default function ViewOrders() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isFromDailyMenu, setIsFromDailyMenu] = useState(false);
  const [currentDay, setCurrentDay] = useState('');
  const [orderName, setOrderName] = useState('');
  const [orderType, setOrderType] = useState<'takeaway' | 'delivery'>('takeaway'); // Tipo específico para orderType
  const [pickupTime, setPickupTime] = useState<string>('');
  const [showOrderFormModal, setShowOrderFormModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'daily' | 'clients'>('clients');
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedQuantityPrice, setSelectedQuantityPrice] = useState<ProductPrice | null>(null);
  const [isUpdatingStock, setIsUpdatingStock] = useState<boolean>(false);
  const [showOutOfStockConfirmation, setShowOutOfStockConfirmation] = useState<boolean>(false);
  const [productToMarkAsOutOfStock, setProductToMarkAsOutOfStock] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [clientSuggestions, setClientSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAddClientDialog, setShowAddClientDialog] = useState<boolean>(false);
  const [clientData, setClientData] = useState<ClientModel>({
    name: "string",
    contact: 0,
    address: "string",
    nif: "string"
  });

  const handleChangeTab = (tab: 'orders' | 'daily' | 'clients') => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  const handleNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOrderName(value);

    if (value.length >= 2) {
      try {
        const response = await fetch('/api/common/client/getAll');
        const data = await response.json();
        
        if (data.success) {
          const filteredClients = data.data.filter((client: any) =>
            client.name.toLowerCase().includes(value.toLowerCase())
          );
          setClientSuggestions(filteredClients);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    } else {
      setClientSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectClient = (clientName: ClientModel) => {
    setOrderName(clientName.name);
    setClientData(clientName);
    setShowSuggestions(false);
  };

  // Função para carregar os produtos do menu do dia atual
  const loadProducts = async () => {
    setIsLoading(true);
    try {
      // Buscar produtos do menu do dia atual
      const todayResponse = await get_products_for_today();
      
      if (todayResponse.length > 0) {
        // Mapear os produtos do menu do dia para o formato esperado pela interface Product
        const mappedProductsPromises = todayResponse.map(async (product: any) => {
          // Buscar preços por quantidade para este produto
          const pricesResponse = await getProductPricesByProductId(product._id._id);
          const productPrices = pricesResponse.success ? pricesResponse.data : [];
          
          return {
            id: product._id._id,
            name: product._id.name,
            price: product._id.price || 0, // Valor padrão caso não exista
            image: 'https://media.timeout.com/images/105749903/750/562/image.jpg', // Imagem padrão
            category: product._id.category?.name || 'Sem categoria',
            description: product._id.description || 'Sem descrição',
            prices: productPrices, 
            outOfStock: product.outOfStock || false,
          };
        });
        
        const mappedProducts = await Promise.all(mappedProductsPromises);
        const today = getCurrentDayOfWeek();
        setProducts(mappedProducts);
        setFilteredProducts(mappedProducts); // Atualizar também os produtos filtrados
        setIsFromDailyMenu(true);
        setCurrentDay(today);
      } else {
        // Se não houver produtos no menu do dia, carregar todos os produtos como fallback
        const response = await get_all_products();
        if (response.success) {
          // Mapear os produtos do MongoDB para o formato esperado pela interface Product
          const mappedProductsPromises = response.data.map(async (product: any) => {
            // Buscar preços por quantidade para este produto
            const pricesResponse = await getProductPricesByProductId(product._id);
            const productPrices = pricesResponse.success ? pricesResponse.data : [];
            

            return {
              id: product._id,
              name: product.name,
              price: product.price || 0, // Valor padrão caso não exista
              image: product.productImage || 'https://media.timeout.com/images/105749903/750/562/image.jpg', // Imagem padrão
              category: product.category?.name || 'Sem categoria',
              description: product.description || 'Sem descrição',
              prices: productPrices,
              outOfStock: product.outOfStock || false,
            };
          });
          
          const mappedProducts = await Promise.all(mappedProductsPromises);
          
          setProducts(mappedProducts);
          setFilteredProducts(mappedProducts); // Atualizar também os produtos filtrados
          setIsFromDailyMenu(false);
          setCurrentDay('');
          toast.info("Não há menu definido para hoje. Mostrando todos os produtos disponíveis.");
        } else {
          toast.error("Erro ao carregar produtos");
          console.error("Erro ao carregar produtos:", response.error);
        }
      }
    } catch (error) {
      toast.error("Erro ao carregar produtos");
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Verificar hash da URL ao carregar a página
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'orders' || hash === 'daily' || hash === 'clients') {
      setActiveTab(hash as 'orders' | 'daily' | 'clients');
    }
  }, []);

  // Carregar produtos quando o componente for montado
  useEffect(() => {
    if(activeTab === 'orders') {
      loadProducts();
    }
  }, [activeTab]);

  // Função para filtrar produtos
  const filterProducts = (keyword: string) => {
    if (!keyword.trim()) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(keyword.toLowerCase()) ||
        product.category.toLowerCase().includes(keyword.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const handleSetOutOfStock = async (product: Product, weekIndex: number) => {
    try {
      
      setIsUpdatingStock(true);
      const response = await fetch(`/api/common/weeklyMenu/out-of-stock?weekIndex=${weekIndex}&productId=${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar o status do produto');
      }

      // Atualiza o estado local do produto
      const updatedProducts = products.map(p => {
        if (p.id === product.id) {
          return { ...p, outOfStock: true };
        }
        return p;
      });
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
    } catch (error) {
      console.error('Erro ao marcar produto como esgotado:', error);
      toast.error('Erro ao marcar produto como esgotado');
    } finally {
      setIsUpdatingStock(false);
    }
  };

  // Função para abrir o modal de seleção de quantidade
  const openQuantityModal = (product: Product) => {
    setSelectedProduct(product);
    setSelectedQuantityPrice(null);
    setShowQuantityModal(true);
  };

  // Função para fechar o modal de seleção de quantidade
  const closeQuantityModal = () => {
    setShowQuantityModal(false);
    setSelectedProduct(null);
    setSelectedQuantityPrice(null);
  };

  // Função para adicionar produto ao carrinho
  const addToCart = (product: Product, quantityPrice?: ProductPrice, index?: string) => {
    
    // Se temos preços por quantidade e nenhum foi selecionado, abrir modal
    if (product.prices && product.prices.length > 0 && !quantityPrice) {
      openQuantityModal(product);
      return;
    }

    // Determinar o preço a ser usado
    const priceToUse = quantityPrice ? parseFloat(quantityPrice.value) : product.price;
    const productToAdd = quantityPrice ? {
      ...product,
      price: priceToUse,
      selectedQuantity: quantityPrice.quantity.name, 
      quantityIndex: index === '1/2 dose' ? 0 : 1 
    } : product;
    
    setCart(prevCart => {
      return [...prevCart, { product: productToAdd, quantity: 1 }];
    });

    closeQuantityModal();
  };

  // Função para remover produto do carrinho
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  // Função para calcular total do carrinho
  const getCartTotal = () => {
    const extraCost = orderType === 'delivery' ? 3 : 0;
    return cart.reduce((total, item) => {
      // Usar o preço específico da quantidade selecionada, se disponível
      const price = item.product.price;
      return total + (price);
    }, extraCost);
  };

  // Função para criar nova encomenda
  const createOrder = async () => {
    if (cart.length === 0) {
      toast.error('Carrinho está vazio!');
      return;
    }

    setIsCreatingOrder(true);
    
    try {
      // Obter dados do usuário autenticado
      const user = JSON.parse(localStorage?.getItem("user") || "{}");
      
      if (!user || !user._id) {
        toast.error('Usuário não autenticado!');
        setIsCreatingOrder(false);
        return;
      }
      
      const temp = new Date(); 
      if(pickupTime) {
      const hours = pickupTime.split(':');
      temp.setHours(parseInt(hours[0]), parseInt(hours[1]))
    }

      // Preparar dados da encomenda para a API
      const orderData = {
        user: user._id,
        orderItems: cart.map(item => ({
          product: item.product.id,
          quantityIndex: item.product.quantityIndex,
          price: item.product.quantityIndex !== undefined && item.product.prices?.[item.product.quantityIndex]?.value
            ? item.product.prices[item.product.quantityIndex].value
            : item.product.price
        })),
        shippingAddress: { 
          name: clientData.name,
          contact: clientData.contact,
          address: clientData.address,
          note: clientData.note,
          nif: clientData.nif,
        },
        paymentMethod: 'Dinheiro',
        itemsPrice: getCartTotal(),
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: getCartTotal(),
        orderName: orderName,
        orderType: orderType,
        pickupTime: orderType === 'takeaway' ? temp : null, 
        status: "new"
      };

      // Chamar a API para criar a encomenda
      const response = await fetch('/api/common/order/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`
        },
        body: JSON.stringify(orderData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Criar objeto de encomenda para exibição na interface
        const newOrder: Order = {
          id: `order-${Date.now()}`,
          items: [...cart],
          total: getCartTotal(),
          status: 'pending',
          createdAt: new Date(),
          orderName: orderName || user.name || 'Cliente',
          orderType: orderType,
          pickupTime: orderType === 'takeaway' ? new Date(pickupTime) : null
        };
        
        setOrders(prevOrders => [newOrder, ...prevOrders]);
        setCart([]);
        toast.success(result.message || 'Encomenda criada com sucesso!');
      } else {
        toast.error(result.message || 'Erro ao criar encomenda!');
      }
    } catch (error) {
      console.error('Erro ao criar encomenda:', error);
      toast.error('Erro ao criar encomenda. Por favor, tente novamente!');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  // Função para formatar preço
  const formatPrice = (price: number | string) => {
    if (price === undefined || price === null) return '€0,00';
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(numericPrice); // Os preços já estão no formato correto
  };

  // Effect para filtrar produtos quando a busca muda
  useEffect(() => {
    filterProducts(searchKeyword);
  }, [searchKeyword, products]);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" style={{ backdropFilter: "blur(4px)" }}>
          <div className="bg-white rounded-2xl p-6 flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-lg font-medium text-gray-700">A carregar menu...</p>
          </div>
        </div>
      )}
      <div className="hide-print flex flex-row h-screen antialiased text-blue-gray-800">
        <div className="flex flex-row w-auto flex-shrink-0 pl-4 pr-2 py-4" style={{height: '100%', position: 'fixed', zIndex: 10}}>
          <div className="flex flex-col items-center py-4 flex-shrink-0 w-20 bg-grey rounded-3xl">
            <div className="flex items-center justify-center h-12 w-12 bg-grey text-cyan-700 rounded-full overflow-hidden">
              <Image
                src="/intro-1.png"
                alt="Trinas - Gestão de Encomendas"
                width={48}
                height={48}
                className="object-cover w-full h-full"
                priority
              />
            </div>
            <ul className="flex flex-col space-y-2 mt-12">
              <li>
                <a href="#" className="flex items-center" onClick={() => handleChangeTab('orders')}>
                  <span className={`flex items-center justify-center h-12 w-12 rounded-2xl shadow-lg text-white ${activeTab === 'orders' ? 'bg-cyan-300' : ''}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </span>
                </a>
              </li>
              <li>
                <a className="flex items-center" onClick={() => handleChangeTab('daily')}>
                  <span className={`flex items-center justify-center h-12 w-12 rounded-2xl shadow-lg text-white ${activeTab === 'daily' ? 'bg-cyan-300' : ''}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      ></path>
                    </svg>
                  </span>
                </a>
              </li>
              <li>
                <a className="flex items-center" onClick={() => handleChangeTab('clients')}>
                  <span className={`flex items-center justify-center h-12 w-12 rounded-2xl shadow-lg text-white ${activeTab === 'clients' ? 'bg-cyan-300' : ''}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </span>
                </a>
              </li>
              <li>
                <a className="flex items-center" onClick={() => window.location.href = '/dashboard'}>
                  <span className={`flex items-center justify-center h-12 w-12 rounded-2xl shadow-lg text-white`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex-grow flex" style={{ paddingLeft: '96px'}}>
          <div className="flex flex-col bg-blue-gray-50 h-full w-full py-4">
          { activeTab === 'orders' && (
            <div className="flex px-2 flex-row relative">
              <div className="absolute left-5 top-3 px-2 py-2 rounded-full bg-grey text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                className="bg-white rounded-3xl shadow text-lg full w-full h-16 py-4 pl-16 transition-all duration-300 focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Procurar prato"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
          )}
          
          { activeTab === 'orders' && (
            <div className="h-full overflow-hidden mt-4">
              {isFromDailyMenu && (
                <div className="mx-2 mb-4 p-3 bg-green-100 border border-green-200 rounded-xl shadow-sm">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="font-medium text-green-800">Menu do dia: {currentDay}</h3>
                      <p className="text-sm text-green-600">Mostrando produtos disponíveis no menu de hoje</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="h-full overflow-y-auto px-2">
                {filteredProducts.length === 0 && searchKeyword.length > 0 ? (
                  <div className="select-none bg-blue-gray-100 rounded-3xl flex flex-wrap content-center justify-center h-full opacity-25">
                   <div className="w-full text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-24 w-24 inline-block"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        ></path>
                      </svg>
                      <p className="text-xl">
                        NENHUM RESULTADO ENCONTRADO
                        <br />
                        <span className="font-semibold">"{searchKeyword}"</span>
                      </p>
                    </div>
                  </div>
                ) : (
                   <div className="grid grid-cols-4 gap-4 pb-3">
                     {filteredProducts.map((product) => (
                       <div
                         key={product.id}
                         role="button"
                         className={`select-none overflow-hidden rounded-2xl bg-white shadow transition-all duration-300 relative ${product.outOfStock ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'}`}
                         title={product.name}
                         onClick={() => !product.outOfStock && addToCart(product)}
                       >
                        {product.outOfStock ? (
                          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium z-10">
                            Esgotado
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setProductToMarkAsOutOfStock(product);
                              setShowOutOfStockConfirmation(true);
                            }}
                            disabled={isUpdatingStock}
                            className={`absolute top-2 right-2 bg-gray-500 hover:bg-gray-600 text-white p-1 rounded-md text-sm font-medium z-10 transition-colors ${isUpdatingStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title="Marcar como esgotado"
                          >
                            {isUpdatingStock ? (
                              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        )}
                         <div className="w-full h-32 flex items-center justify-center bg-gray-100 text-gray-800 font-medium text-center px-2">
                           {product.name}
                         </div>
          
                         {product.prices && product.prices.length > 0 && (
                           <div className="px-3 pb-3 text-sm pt-2">
                             <div className="grid grid-cols-2 gap-2">
                               {product.prices.map((price, index) =>  Number(price.value) > 0 && (
                                 <div 
                                   key={price._id} 
                                   className={`flex justify-between bg-gray-50 p-2 rounded ${!product.outOfStock ? 'hover:bg-gray-200 cursor-pointer' : 'cursor-not-allowed'}`}
                                   onClick={(e) => {
                                     if (!product.outOfStock) {
                                      const carl = index == 1 || product.prices?.length == 1 ? '1 dose' : '1/2 dose';
                                       e.stopPropagation();
                                       addToCart(product, price, carl);
                                     }
                                   }}
                                 >
                                  <div className='d-flex'>
                                   <div className="text-gray-700 font-medium">{index == 1 || product.prices?.length == 1 ? '1 dose' : '1/2 dose'}</div>
                                   <div className="text-green-600 font-semibold">  {formatPrice(price.value)}</div>
                                   </div>
                                 </div>
                               ))}
                             </div>
                           </div>
                         )}
                       </div>
                     ))}
                   </div>
                )}
              </div>
            </div>
          )}

          { activeTab === 'daily' && (
            <div className='px-2  '>
              <DailyOrdersPage inner={false} />
            </div>
          )}

          { activeTab === 'clients' && (
            <div className='px-2  '>
              <ClientList />
            </div>
          )}

          </div>
          { activeTab === 'orders' && (
          <div className="flex flex-col bg-white shadow-lg" style={{width: '32rem'}}>
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Encomenda</h2>
              <p className="text-sm bg-gray-100 px-2 py-1 rounded-full inline-block text-gray-600">{cart.length} {cart.length === 1 ? "item" : "itens"}</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-4 p-4 bg-white border border-gray-100 shadow-sm rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold text-base text-gray-800 mb-1">{item.product.name}</h4>
                        <p className="text-sm font-medium text-green-600">{formatPrice(item.product.price)}</p>
                        
                        {item.product.selectedQuantity && (
                          <p className="text-sm text-gray-600 mt-1">Quantidade: <span className="font-medium">{item.product.selectedQuantity}</span></p>
                        )}
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <p className="text-base font-bold text-gray-700 bg-gray-50 px-3 py-1 rounded-full"> {item.product.quantityIndex === 0 ?  '1/2 dose' : '1 dose'}</p>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-xs text-red-600 hover:text-white hover:bg-red-500 font-medium flex items-center rounded-full px-2 py-1 transition-all duration-300"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remover
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {cart.length > 0 && (
              <div className="p-4 border-t">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-lg text-blue-600">{formatPrice(getCartTotal())}</span>
                </div>
                <button
                  onClick={() => setShowOrderFormModal(true)}
                  className="w-full bg-[#373a4e] text-white py-3 rounded-lg font-medium hover:bg-[#373a4e]/90 flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow"
                >
                  Finalizar Encomenda
                </button>
              </div>
            )}
          </div>
          )}
        </div>
      </div>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      {/* Modal de seleção de quantidade */}
      {showQuantityModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" style={{ backdropFilter: "blur(4px)" }}>
          <div className="bg-white rounded-lg shadow-lg p-4 w-80 max-w-full animate-fadeIn transition-all duration-300 transform scale-100 hover:scale-[1.01]">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-medium">Selecionar quantidade</h3>
              <button 
                onClick={closeQuantityModal}
                className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 p-1 transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-3">
              <p className="text-md font-medium mb-2 text-center">{selectedProduct.name}</p>
              <div className="space-y-1.5">
                {selectedProduct.prices && selectedProduct.prices.map((price, index) => (
                  <button
                    key={price._id}
                    onClick={() => {
                      const carl = index == 1 || selectedProduct.prices?.length == 1 ? '1 dose' : '1/2 dose';
                      addToCart(selectedProduct, price, carl);
                      closeQuantityModal();
                    }}
                    className="w-full flex justify-between items-center py-2 px-3 border border-gray-200 rounded-full bg-gray-50 hover:bg-gray-100 transition-all duration-300 shadow-sm hover:shadow"
                  >
                    <span className='text-black'>{index==0 ? '1 dose' : '1/2 dose'}</span>
                    <span className="text-green-600 font-medium">{formatPrice(price.value.toString())}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end mt-2">
              <button
                onClick={closeQuantityModal}
                className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de formulário de encomenda */}
      {showOrderFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" style={{ backdropFilter: "blur(4px)" }}>
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto animate-fadeIn transition-all duration-300 transform scale-100 hover:scale-[1.01]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Configurar Encomenda</h3>
              <button 
                onClick={() => setShowOrderFormModal(false)}
                className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 p-1 transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="orderName" className="block text-sm font-medium text-gray-700 mb-1">Nome do cliente</label>
                  <button
                    onClick={() => setShowAddClientDialog(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition-all duration-300 flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Novo Cliente
                  </button>
                </div>
                <input
                  type="text"
                  id="orderName"
                  value={orderName}
                  onChange={handleNameChange}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 shadow-sm"
                  placeholder="Nome para a encomenda"
                />
                {showSuggestions && clientSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto" style={{maxWidth: '400px'}}>
                    {clientSuggestions.map((client: any) => (
                      <div
                        key={client._id}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 transition-colors duration-150"
                        onClick={() => handleSelectClient(client)}
                      >
                        <strong>{client.name}</strong> - <span className="font-light">{client.address}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Encomenda</label>
                <div className="flex space-x-4">
                  <div className="flex items-center transition-all duration-300 hover:bg-gray-50 p-2 rounded-full">
                    <input
                      type="radio"
                      id="takeaway"
                      name="orderType"
                      value="takeaway"
                      checked={orderType === 'takeaway'}
                      onChange={() => setOrderType('takeaway')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="takeaway" className="ml-2 block text-sm text-gray-700">Takeaway</label>
                  </div>
                  <div className="flex items-center transition-all duration-300 hover:bg-gray-50 p-2 rounded-full">
                    <input
                      type="radio"
                      id="delivery"
                      name="orderType"
                      value="delivery"
                      checked={orderType === 'delivery'}
                      onChange={() => setOrderType('delivery')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="delivery" className="ml-2 block text-sm text-gray-700">Delivery</label>
                  </div>
                </div>
              </div>
              
              {orderType === 'takeaway' && (
                <div>
                  <label htmlFor="pickupTime" className="block text-sm font-medium text-gray-700 mb-1">Data e Hora de Levantamento</label>
                  <input
                    type="time"
                    id="pickupTime"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 shadow-sm "
                  />
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-lg text-blue-600">{formatPrice(getCartTotal())}</span>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowOrderFormModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-full text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-300"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowOrderFormModal(false);
                  createOrder();
                }}
                disabled={isCreatingOrder}
                className="flex-1 bg-[#373a4e] text-white py-2 px-4 rounded-full font-medium hover:bg-[#373a4e]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm hover:shadow transition-all duration-300"
              >
                {isCreatingOrder ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    A preprarar...
                  </>
                ) : (
                  'Fazer Encomenda'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de confirmação para marcar produto como esgotado */}
      {showOutOfStockConfirmation && productToMarkAsOutOfStock && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Confirmar ação</h3>
              <button
                onClick={() => {
                  setShowOutOfStockConfirmation(false);
                  setProductToMarkAsOutOfStock(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 mb-8">Tem certeza que deseja marcar o produto "{productToMarkAsOutOfStock.name}" como esgotado?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowOutOfStockConfirmation(false);
                  setProductToMarkAsOutOfStock(null);
                }}
                className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (productToMarkAsOutOfStock) {
                    handleSetOutOfStock(productToMarkAsOutOfStock, getCurrentWeekIndex());
                    setShowOutOfStockConfirmation(false);
                    setProductToMarkAsOutOfStock(null);
                  }
                }}
                disabled={isUpdatingStock}
                className={`px-6 py-2.5 bg-[#373a4e] text-white rounded-full hover:bg-[#373a4e]/90 transition-colors ${isUpdatingStock ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isUpdatingStock ? 'Confirmando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
      <AddClientDialog
        isVisible={showAddClientDialog}
        handleHideDialog={() => setShowAddClientDialog(false)}
        onClientAdded={() => {
          setShowAddClientDialog(false);
          // Atualizar a lista de sugestões após adicionar um novo cliente
          if (orderName.length >= 2) {
            handleNameChange({ target: { value: orderName } } as React.ChangeEvent<HTMLInputElement>);
          }
        }}
      />
    </>
  );
}