"use client";
import { RootState } from "@/Store/store";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

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

// Importar os serviços para buscar produtos
import { get_all_products } from "@/Services/Admin/product";
import { get_products_for_today, getCurrentDayOfWeek } from "@/Services/common/weeklyMenu";
import { getProductPricesByProductId } from "@/Services/Admin/product/price";
import Cookies from 'js-cookie';

export default function Page() {
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
  
  // Função para carregar os produtos do menu do dia atual
  const loadProducts = async () => {
    try {
      // Buscar produtos do menu do dia atual
      const todayResponse = await get_products_for_today();
      
      if (todayResponse.length > 0) {
        // Mapear os produtos do menu do dia para o formato esperado pela interface Product
        const mappedProductsPromises = todayResponse.map(async (product: any) => {
          // Buscar preços por quantidade para este produto
          const pricesResponse = await getProductPricesByProductId(product._id);
          const productPrices = pricesResponse.success ? pricesResponse.data : [];
          


          console.log('pricesResponse', pricesResponse, productPrices);


          return {
            id: product._id,
            name: product.name,
            price: product.price || 0, // Valor padrão caso não exista
            image: 'https://media.timeout.com/images/105749903/750/562/image.jpg', // Imagem padrão
            category: product.category?.name || 'Sem categoria',
            description: product.description || 'Sem descrição',
            prices: productPrices
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
              prices: productPrices
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

  // Estado para controlar o modal de seleção de quantidade
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedQuantityPrice, setSelectedQuantityPrice] = useState<ProductPrice | null>(null);

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
  const addToCart = (product: Product, quantityPrice?: ProductPrice) => {
    // Se temos preços por quantidade e nenhum foi selecionado, abrir modal
    if (product.prices && product.prices.length > 0 && !quantityPrice) {
      openQuantityModal(product);
      return;
    }

    debugger
    // Determinar o preço a ser usado
    const priceToUse = quantityPrice ? parseFloat(quantityPrice.value) : product.price;
    const productToAdd = quantityPrice ? {
      ...product,
      price: priceToUse,
      selectedQuantity: quantityPrice.quantity.name
    } : product;
    
    setCart(prevCart => {
      return [...prevCart, { product: productToAdd, quantity: 1 }];
    });

    console.log(cart);
    
    closeQuantityModal();
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
    return cart.reduce((total, item) => {
      // Usar o preço específico da quantidade selecionada, se disponível
      const price = item.product.price;
      return total + (price * item.quantity);
    }, 0);
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
          qty: item.quantity,
          product: item.product.id,
        })),
        shippingAddress: {
          fullName: orderName,
          address: 'Endereço de entrega',
          city: 'Cidade',
          postalCode: 1000,
          country: 'Portugal',
        },
        paymentMethod: 'Dinheiro',
        itemsPrice: getCartTotal(),
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: getCartTotal(),
        orderName: orderName,
        orderType: orderType, // 'takeaway' ou 'delivery'
        pickupTime: orderType === 'takeaway' ? temp : null, // Hora prevista para levantamento (apenas para takeaway)
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
                <a href="/order/daily-orders"  className="flex items-center">
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
                         className="select-none cursor-pointer transition-shadow overflow-hidden rounded-2xl bg-white shadow hover:shadow-lg"
                         title={product.name}
                         onClick={() => addToCart(product)}
                       >
                         <img
                           src={product.image}
                           alt={product.name}
                           className="w-full h-32 object-cover"
                         />
                         <div className="flex pb-3 px-3 text-sm -mt-3 mt-2">
                           <p
                             className="flex-grow truncate mr-1"
                             style={{ color: "black" }}
                           >
                             {product.name}
                           </p>
                         </div>
                         
                         {product.prices && product.prices.length > 0 && (
                           <div className="px-3 pb-3 text-sm">
                             <div className="grid grid-cols-2 gap-2">
                               {product.prices.map((price, index) => (
                                 <div 
                                   key={price._id} 
                                   className="flex justify-between bg-gray-50 p-2 rounded hover:bg-gray-200 cursor-pointer"
                                   onClick={(e) => {
                                     e.stopPropagation();
                                     addToCart(product, price);
                                   }}
                                 >
                                    <div className='d-flex'>
                                   <span className="text-gray-700 font-medium">{index == 0 ? '1 dose' : '1/2 dose'}</span>
                                   <span className="text-green-600 font-semibold">  {formatPrice(price.value)}</span>
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
          </div>

          {/* Carrinho lateral */}
          <div className="flex flex-col bg-white shadow-lg" style={{width: '32rem'}}>
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Encomenda</h2>
              <p className="text-sm text-gray-600">{cart.length} itens</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <p className="mt-2">Carrinho vazio</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-4 p-4 bg-white border border-gray-100 shadow-sm rounded-lg">
                      <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-md" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-base text-gray-800 mb-1">{item.product.name}</h4>
                        <p className="text-sm font-medium text-green-600">{formatPrice(item.product.price)}</p>
                        
                        {item.product.selectedQuantity && (
                          <p className="text-sm text-gray-600 mt-1">Quantidade: <span className="font-medium">{item.product.selectedQuantity}</span></p>
                        )}
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex items-center bg-gray-100 rounded-lg p-1" style={{color: 'black'}}>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            -
                          </button>
                          <span className="text-sm font-semibold mx-3 min-w-[20px] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center"
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
                <div className="space-y-4 mb-4">
                  <div>
                    <label htmlFor="orderName" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input
                      type="text"
                      id="orderName"
                      value={orderName}
                      onChange={(e) => setOrderName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Nome para a encomenda"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Encomenda</label>
                    <div className="flex space-x-4">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="takeaway"
                          name="orderType"
                          value="takeaway"
                          checked={orderType === 'takeaway'}
                          onChange={() => setOrderType('takeaway')}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                        />
                        <label htmlFor="takeaway" className="ml-2 block text-sm text-gray-700">Takeaway</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="delivery"
                          name="orderType"
                          value="delivery"
                          checked={orderType === 'delivery'}
                          onChange={() => setOrderType('delivery')}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  )}
                </div>
                
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-md p-4 w-80 max-w-full">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-medium">Selecionar quantidade</h3>
              <button 
                onClick={closeQuantityModal}
                className="text-gray-400 hover:text-gray-600"
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
                      addToCart(selectedProduct, price);
                      closeQuantityModal();
                    }}
                    className="w-full flex justify-between items-center py-2 px-3 border border-gray-200 rounded bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <span  className='text-black'>{index==0 ? '1 dose' : '1/2 dose'}</span>
                    <span className="text-green-600 font-medium">{formatPrice(price.value)}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end mt-2">
              <button
                onClick={closeQuantityModal}
                className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
