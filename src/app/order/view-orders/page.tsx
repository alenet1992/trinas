"use client";
import { get_all_orders_of_user } from "@/Services/common/order";
import { RootState } from "@/Store/store";
import OrdersDetailsDataTable from "@/components/OrdersDetailsDataTable";
import { setOrder } from "@/utils/OrderSlice";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { GrDeliver } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

interface userData {
  email: String;
  role: String;
  _id: String;
  name: String;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
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
}

// Importar o serviço para buscar produtos do MongoDB
import { get_all_products } from "@/Services/Admin/product";


export default function Page() {
  const Router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(
    (state: RootState) => state.User.userData
  ) as userData | null;

  // Estados para a interface dinâmica
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  
  // Função para carregar os produtos do MongoDB
  const loadProducts = async () => {
    try {
      const response = await get_all_products();
      if (response.success) {
        // Mapear os produtos do MongoDB para o formato esperado pela interface Product
        const mappedProducts = response.data.map((product: any) => ({
          id: product._id,
          name: product.name,
          price: product.price || 0, // Valor padrão caso não exista
          image: product.productImage || 'https://media.timeout.com/images/105749903/750/562/image.jpg', // Imagem padrão
          category: product.category?.name || 'Sem categoria',
          description: product.description || 'Sem descrição'
        }));
        setProducts(mappedProducts);
        setFilteredProducts(mappedProducts); // Atualizar também os produtos filtrados
      } else {
        toast.error("Erro ao carregar produtos");
        console.error("Erro ao carregar produtos:", response.error);
      }
    } catch (error) {
      toast.error("Erro ao carregar produtos");
      console.error("Erro ao carregar produtos:", error);
    }
  };
  
  // Carregar produtos quando o componente for montado
  useEffect(() => {
    loadProducts();
  }, []);

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

  // Função para adicionar produto ao carrinho
  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  // Função para remover produto do carrinho
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  // Função para atualizar quantidade no carrinho
  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Função para calcular total do carrinho
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  // Função para criar nova encomenda
  const createOrder = async () => {
    if (cart.length === 0) {
      toast.error('Carrinho está vazio!');
      return;
    }

    setIsCreatingOrder(true);
    
    // Simular delay de API
    setTimeout(() => {
      const newOrder: Order = {
        id: `order-${Date.now()}`,
        items: [...cart],
        total: getCartTotal(),
        status: 'pending',
        createdAt: new Date()
      };
      
      setOrders(prevOrders => [newOrder, ...prevOrders]);
      setCart([]);
      setIsCreatingOrder(false);
      toast.success('Encomenda criada com sucesso!');
    }, 1500);
  };

  // Função para formatar preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(price / 1000); // Assumindo que os preços estão em centavos
  };

  // Effect para filtrar produtos quando a busca muda
  useEffect(() => {
    filterProducts(searchKeyword);
  }, [searchKeyword, products]);

  return (
    <>
      <div className="hide-print flex flex-row h-screen antialiased text-blue-gray-800">
        <div className="flex flex-row w-auto flex-shrink-0 pl-4 pr-2 py-4">
          <div className="flex flex-col items-center py-4 flex-shrink-0 w-20 bg-grey rounded-3xl">
            <div className="flex items-center justify-center h-12 w-12 bg-grey text-cyan-700 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="123.3"
                height="123.233"
                viewBox="0 0 32.623 32.605"
              >
                <path
                  d="M15.612 0c-.36.003-.705.01-1.03.021C8.657.223 5.742 1.123 3.4 3.472.714 6.166-.145 9.758.019 17.607c.137 6.52.965 9.271 3.542 11.768 1.31 1.269 2.658 2 4.73 2.57.846.232 2.73.547 3.56.596.36.021 2.336.048 4.392.06 3.162.018 4.031-.016 5.63-.221 3.915-.504 6.43-1.778 8.234-4.173 1.806-2.396 2.514-5.731 2.516-11.846.001-4.407-.42-7.59-1.278-9.643-1.463-3.501-4.183-5.53-8.394-6.258-1.634-.283-4.823-.475-7.339-.46z"
                  fill="#fff"
                ></path>
                <path
                  d="M16.202 13.758c-.056 0-.11 0-.16.003-.926.031-1.38.172-1.747.538-.42.421-.553.982-.528 2.208.022 1.018.151 1.447.553 1.837.205.198.415.313.739.402.132.036.426.085.556.093.056.003.365.007.686.009.494.003.63-.002.879-.035.611-.078 1.004-.277 1.286-.651.282-.374.392-.895.393-1.85 0-.688-.066-1.185-.2-1.506-.228-.547-.653-.864-1.31-.977a7.91 7.91 0 00-1.147-.072zM16.22 19.926c-.056 0-.11 0-.16.003-.925.031-1.38.172-1.746.539-.42.42-.554.981-.528 2.207.02 1.018.15 1.448.553 1.838.204.198.415.312.738.4.132.037.426.086.556.094.056.003.365.007.686.009.494.003.63-.002.88-.034.61-.08 1.003-.278 1.285-.652.282-.374.393-.895.393-1.85 0-.688-.066-1.185-.2-1.506-.228-.547-.653-.863-1.31-.977a7.91 7.91 0 00-1.146-.072zM22.468 13.736c-.056 0-.11.001-.161.003-.925.032-1.38.172-1.746.54-.42.42-.554.98-.528 2.207.021 1.018.15 1.447.553 1.837.205.198.415.313.739.401.132.037.426.086.556.094.056.003.364.007.685.009.494.003.63-.002.88-.035.611-.078 1.004-.277 1.285-.651.282-.375.393-.895.393-1.85 0-.688-.065-1.185-.2-1.506-.228-.547-.653-.864-1.31-.977a7.91 7.91 0 00-1.146-.072z"
                  fill="#00dace"
                ></path>
                <path
                  d="M9.937 13.736c-.056 0-.11.001-.161.003-.925.032-1.38.172-1.746.54-.42.42-.554.98-.528 2.207.021 1.018.15 1.447.553 1.837.204.198.415.313.738.401.133.037.427.086.556.094.056.003.365.007.686.009.494.003.63-.002.88-.035.61-.078 1.003-.277 1.285-.651.282-.375.393-.895.393-1.85 0-.688-.066-1.185-.2-1.506-.228-.547-.653-.864-1.31-.977a7.91 7.91 0 00-1.146-.072zM16.202 7.59c-.056 0-.11 0-.16.002-.926.032-1.38.172-1.747.54-.42.42-.553.98-.528 2.206.022 1.019.151 1.448.553 1.838.205.198.415.312.739.401.132.037.426.086.556.093.056.003.365.007.686.01.494.002.63-.003.879-.035.611-.079 1.004-.278 1.286-.652.282-.374.392-.895.393-1.85 0-.688-.066-1.185-.2-1.505-.228-.547-.653-.864-1.31-.978a7.91 7.91 0 00-1.147-.071z"
                  fill="#00bcd4"
                ></path>
              </svg>
            </div>
            <ul className="flex flex-col space-y-2 mt-12">
              <li>
                <a href="#" className="flex items-center">
                  <span className="flex items-center justify-center h-12 w-12 rounded-2xl bg-cyan-300 shadow-lg text-white">
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
                <a href="#" className="flex items-center">
                  <span className="flex items-center justify-center text-cyan-100 hover:bg-cyan-400 h-12 w-12 rounded-2xl">
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
              {/* <li>
                <a href="#" className="flex items-center">
                  <span className="flex items-center justify-center text-cyan-100 hover:bg-cyan-400 h-12 w-12 rounded-2xl">
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
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      ></path>
                    </svg>
                  </span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center">
                  <span className="flex items-center justify-center text-cyan-100 hover:bg-cyan-400 h-12 w-12 rounded-2xl">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                  </span>
                </a>
              </li> */}
            </ul>
          </div>
        </div>

        <div className="flex-grow flex">
          <div className="flex flex-col bg-blue-gray-50 h-full w-full py-4">
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
                className="bg-white rounded-3xl shadow text-lg full w-full h-16 py-4 pl-16 transition-shadow focus:shadow-2xl focus:outline-none"
                placeholder="Procurar prato"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>

            <div className="h-full overflow-hidden mt-4">
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
                         className="select-none cursor-pointer transition-shadow overflow-hidden rounded-2xl bg-white shadow hover:shadow-lg"
                         title={product.name}
                         onClick={() => addToCart(product)}
                       >
                         <img
                          //  src={product.image}
                           alt={product.name}
                           className="w-full h-32 object-cover"
                         />
                         <div className="flex pb-3 px-3 text-sm -mt-3">
                           <p
                             className="flex-grow truncate mr-1"
                             style={{ color: "black" }}
                           >
                             {product.name}
                           </p>
                           <p className="nowrap font-semibold">
                             {formatPrice(product.price)}
                           </p>
                         </div>
                       </div>
                     ))}
                   </div>
                )}
              </div>
            </div>
          </div>

          {/* Carrinho lateral */}
          <div className="flex flex-col w-80 bg-white shadow-lg">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Carrinho</h2>
              <p className="text-sm text-gray-600">{cart.length} itens</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                  <p className="mt-2">Carrinho vazio</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover rounded" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.product.name}</h4>
                        <p className="text-xs text-gray-600">{formatPrice(item.product.price)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 hover:bg-red-200 ml-2"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {cart.length > 0 && (
              <div className="p-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-lg text-orange-600">{formatPrice(getCartTotal())}</span>
                </div>
                <button
                  onClick={createOrder}
                  disabled={isCreatingOrder}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isCreatingOrder ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Criando...
                    </>
                  ) : (
                    'Criar Encomenda'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Lista de encomendas */}
        {orders.length > 0 && (
          <div className="absolute bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg p-4 max-h-60 overflow-y-auto">
            <h3 className="font-semibold mb-3">Encomendas Recentes</h3>
            <div className="space-y-2">
              {orders.slice(0, 3).map((order) => (
                <div key={order.id} className="p-2 bg-gray-50 rounded text-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">#{order.id.slice(-6)}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'ready' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status === 'pending' ? 'Pendente' :
                       order.status === 'preparing' ? 'Preparando' :
                       order.status === 'ready' ? 'Pronto' : 'Entregue'}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>{order.items.length} itens</span>
                    <span className="font-medium">{formatPrice(order.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
    </>
  );
}
