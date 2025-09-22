"use client";

import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataTable from "react-data-table-component";
import Loading from "@/app/loading";
import Link from "next/link";
import { get_all_orders, update_order_status } from "@/Services/Admin/order";
import { get_order_details } from "@/Services/common/order";
import { format } from "date-fns/format";
import { pt } from "date-fns/locale/pt";
import { FiRefreshCw } from "react-icons/fi";
import { OrderDetailsDialog } from "@/components/OrderDetailsDialog";

interface Order {
  orderNumber: number;
  orderName: string;
  orderType: 'takeaway' | 'delivery';
  createdAt: string;
  deliveredAt: string;
  isDelivered: boolean;
  isPaid: boolean;
  itemsPrice: number;
  pickupTime?: string | Date;
  status: 'new' | 'in_progress' | 'delivered';
  orderItems: {
    qty: number;
    product: {
      createdAt: string;
      productCategory: string;
      productDescription: string;
      productFeatured: boolean;
      productImage: string;
      productName: string;
      productPrice: number;
      productQuantity: number;
      productSlug: string;
      updatedAt: string;
      __v: number;
      _id: string;
    };
    _id: string;
  }[];
  paidAt: string;
  paymentMethod: string;
  shippingAddress: {
    address: string;
    city: string;
    country: string;
    fullName: string;
    postalCode: number;
  };
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  updatedAt: string;
  user: {
    email: string;
    name: string;
    password: string;
    role: string;
    __v: number;
    _id: string;
  };
  __v: number;
  _id: string;
}

interface DailyOrdersPageProps {
  inner?: boolean
}


export default function DailyOrdersPage({
  inner = true
}: DailyOrdersPageProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [orderData, setOrderData] = useState<Order[]>([]);
  const [filteredData, setFilteredData] = useState<Order[]>([]);
  const [search, setSearch] = useState<string>("");
  const [todayDate, setTodayDate] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoadingOrderDetails, setIsLoadingOrderDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'takeaway' | 'delivery'>('all');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await get_all_orders();
      if (response?.success) {
        // Filter only today's orders
        const today = new Date();
        const todayString = format(today, "yyyy-MM-dd");
        setTodayDate(format(today, "dd 'de' MMMM 'de' yyyy", { locale: pt }));
        
        const todayOrders = response.data
          .filter((order: Order) => {
            const orderDate = new Date(order.createdAt);
            return format(orderDate, "yyyy-MM-dd") === todayString;
          })
          .sort((a: Order, b: Order) => {
            // Primeiro, prioriza pedidos com status 'new'
            if (a.status === 'new' && b.status !== 'new') return -1;
            if (a.status !== 'new' && b.status === 'new') return 1;

            // Depois, prioriza pedidos com status 'in_progress'
            if (a.status === 'in_progress' && b.status !== 'in_progress' && b.status !== 'new') return -1;
            if (a.status !== 'in_progress' && b.status === 'in_progress' && a.status !== 'new') return 1;
            
            // Se ambos tiverem o mesmo status, ordena por horário de retirada
            const timeA = a.pickupTime ? new Date(a.pickupTime).getTime() : Infinity;
            const timeB = b.pickupTime ? new Date(b.pickupTime).getTime() : Infinity;
            return timeA - timeB;
          })
          .map((order: any) => ({
            ...order       
          }));
        
        setOrderData(todayOrders);
        setFilteredData(todayOrders);
      } else {
        toast.error(response?.message || "Erro ao carregar pedidos");
      }
    } catch (error) {
      toast.error("Erro ao carregar pedidos");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  
  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handleViewOrderDetails = async (orderId: string) => {
    setIsLoadingOrderDetails(true);
    try {
      const orderData = await get_order_details(orderId);
      if (orderData?.success) {
        setSelectedOrder(orderData?.data);
        setShowOrderDetails(true);
      } else {
        toast.error(orderData?.message || "Erro ao carregar detalhes do pedido");
      }
    } catch (error) {
      toast.error("Erro ao carregar detalhes do pedido");
    } finally {
      setIsLoadingOrderDetails(false);
    }
  };

  const handleOrderStatusUpdate = async (id: string, status: 'new' | 'in_progress' | 'delivered'): Promise<void> => {
    try {
      const res = await update_order_status(id, status);
      if (res?.success) {
        // Update the list after the change
        const updatedOrders = orderData.map(order => {
          if (order._id === id) {
            return {
              ...order,
              status: status,
              isDelivered: status === 'delivered'
            };
          }
          return order;
        });
        
        setOrderData(updatedOrders);
        setFilteredData(updatedOrders);
      } else {
        toast.error(res?.message || "Erro ao atualizar estado do pedido");
      }
    } catch (error) {
      toast.error("Erro ao atualizar estado do pedido");
    }
  };
  
  const handleHideOrderDetails = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };

  const columns = [
    {
      name: "Senha",
      selector: (row: Order) => row?.orderNumber,
      sortable: true,
      maxWidth: "50px",
      cell: (row: Order) => (
        <Link href={`/order/view-orders-details/${row._id}` as any} className="text-[#373a4e] hover:underline font-medium">
          {row.orderNumber}
        </Link>
      ),
    },
    {
      name: "Cliente",
      selector: (row: Order) => row?.orderName,
      sortable: true,
      maxWidth: "130px",
      cell: (row: Order) => (
        <span className="font-medium">{row?.orderName}</span>
      ),
    },
    {
      name: "Tipo de Pedido",
      selector: (row: Order) => row?.orderType,
      sortable: true,
      maxWidth: "130px",
      cell: (row: Order) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${row.orderType === 'delivery' ? "bg-[#373a4e]/10 text-[#373a4e]" : "bg-indigo-100 text-indigo-700"}`}>
          {row.orderType === 'delivery' ? "Delivery" : "Takeway"}
        </span>
      ),
    },
    {
      name: "Hora Takeway",
      selector: (row: Order) => row?.pickupTime ? new Date(row.pickupTime).toISOString() : "",
      sortable: true,
      maxWidth: "100px",
      cell: (row: Order) => (
        <span className="text-gray-600">
          {row?.pickupTime ? format(new Date(row.pickupTime), "HH:mm") : "N/A"}
        </span>
      ),
    },
    {
      name: "Total",
      selector: (row: Order) => row?.totalPrice,
      sortable: true,
      maxWidth: "80px",
      cell: (row: Order) => (
        <span className="font-semibold text-blue-700">
          €{row.totalPrice.toFixed(2)}
        </span>
      ),
    },
    {
      name: "Estado",
      selector: (row: Order) => row?.status,
      sortable: true,
      maxWidth: "200px",
      cell: (row: Order) => {
        const statusConfig = {
          new: { bg: "bg-red-200", text: "text-red-600", label: "Nova" },
          in_progress: { bg: "bg-yellow-200", text: "text-yellow-600", label: "Em Preparação" },
          delivered: { bg: "bg-emerald-200", text: "text-emerald-600", label: "Entregue" }
        };
        const config = statusConfig[row.status];
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
            {config.label}
          </span>
        );
      },
    },
    {
      name: "Ações",
      grow: 1,
      minWidth: "200px",
      cell: (row: Order) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => handleViewOrderDetails(row._id)}
            className="px-3 py-1 text-xs bg-[#373a4e]/10 text-[#373a4e] hover:bg-[#373a4e] hover:text-white rounded-full transition-all duration-200"
          >
            Detalhes
          </button>
          {row.status !== 'delivered' && (
            <button
              onClick={() => handleOrderStatusUpdate(row._id, row.status)}
              className={`px-3 py-1 text-xs rounded-full transition-all duration-200 ${row.status === 'new' ? 'bg-red-50 text-red-600 hover:bg-red-600' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600'} hover:text-white`}
            >
              {row.status === 'new' ? 'Iniciar Preparação' : 'Marcar como Entregue'}
            </button>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    let result = orderData;
    
    // Primeiro filtra por tipo de pedido (se não for 'all')
    if (activeTab !== 'all') {
      result = result.filter(item => item.orderType === activeTab);
    }
    
    // Depois aplica o filtro de pesquisa
    if (search !== "") {
      result = result.filter((item) => {
        const itemData = item?._id?.toUpperCase();
        const clientName = item?.user?.name?.toUpperCase() || "";
        const textData = search.toUpperCase();
        return itemData.indexOf(textData) > -1 || clientName.indexOf(textData) > -1;
      });
    }
    
    setFilteredData(result);
  }, [search, orderData, activeTab]);

  return (
    <div className={`w-full bg-gray-50 min-h-screen ${inner ? 'p-4' : 'pt-12'}`}>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        {todayDate && (
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Pedidos do Dia - <span className="text-[#373a4e]">{todayDate}</span>
            </h1>
            <div className="flex space-x-3">
               {inner && (
                <button 
                  onClick={() => window.history.back()}
                  className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-700 hover:text-white rounded-lg transition-all duration-200 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar
              </button>
               )}
              <button 
                onClick={handleRefresh} 
                className={`px-4 py-2 bg-[#373a4e]/10 text-[#373a4e] hover:bg-[#373a4e] hover:text-white rounded-lg transition-all duration-200 flex items-center ${refreshing ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={refreshing}
              >
                <FiRefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Atualizar
              </button>
              {inner && (
              <Link href={"/order/view-orders" as any}>
                <button className="px-4 py-2 bg-[#373a4e] text-white rounded-lg hover:bg-[#2f3141] transition-all duration-200 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Novo Pedido
                </button>
              </Link>
               )}
            </div>
          </div>
        )}
        {loading ? (
          <Loading />
        ) : (
          <div className="w-full">
            {/* Tabs para filtrar por tipo de pedido */}
            <div className="mb-6 border-b border-gray-200">
              <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                <li className="mr-2">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group  text-black ${activeTab === 'all' 
                      ? 'text-blue-600 border-[#373a4e] active' 
                      : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
                  >
                    Todos
                    <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {orderData.length}
                    </span>
                  </button>
                </li>
                <li className="mr-2">
                  <button
                    onClick={() => setActiveTab('takeaway')}
                    className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group text-black ${activeTab === 'takeaway' 
                      ? 'text-indigo-600 border-indigo-600 active' 
                      : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
                  >
                    <svg className="w-4 h-4 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9V4a3 3 0 0 0-6 0v5m9.343 10H2.657a1 1 0 0 1-.97-1.242l1.99-7.962A2 2 0 0 1 5.64 8h6.72a2 2 0 0 1 1.962 1.796l1.99 7.962A1 1 0 0 1 15.343 19Z" />
                    </svg>
                    Takeaway
                    <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {orderData.filter(order => order.orderType === 'takeaway').length}
                    </span>
                  </button>
                </li>
                <li className="mr-2">
                  <button
                    onClick={() => setActiveTab('delivery')}
                    className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group text-black ${activeTab === 'delivery' 
                      ? 'text-[#373a4e] border-[#373a4e] active' 
                      : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
                  >
                    <svg className="w-4 h-4 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.5 10.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm0 0a2.225 2.225 0 0 0-1.666.75H12m3.5-.75v-6m-7.5 6.75A2.25 2.25 0 1 1 5.75 7.5a2.25 2.25 0 0 1 2.25 2.25Z" />
                    </svg>
                    Delivery
                    <span className="ml-2 bg-[#373a4e]/10 text-[#373a4e] text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {orderData.filter(order => order.orderType === 'delivery').length}
                    </span>
                  </button>
                </li>
              </ul>
            </div>
            
            <div className="mb-4 flex justify-between items-center">
              <div className="relative w-80" >
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
                </div>
                <input
                  className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-full focus:ring-[#373a4e] focus:border-[#373a4e] block w-full pl-10 p-2.5 shadow-sm"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Pesquisar por código ou cliente..."
                />
              </div>
              <div className="text-sm text-gray-500">
                Total: <span className="font-medium text-blue-600">{filteredData.length}</span> pedidos
                {activeTab !== 'all' && (
                  <span className="ml-1">({activeTab === 'takeaway' ? 'Takeaway' : 'Delivery'})</span>
                )}
              </div>
            </div>
            
            <DataTable
              columns={columns}
              data={filteredData || []}
              pagination
              paginationPerPage={1000}
              paginationRowsPerPageOptions={[10, 20, 30]}
              highlightOnHover
              pointerOnHover
              noDataComponent={
                <div className="p-8 text-center text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Sem pedidos hoje</h3>
                  <p className="mt-1 text-sm text-gray-500">Não existem pedidos registrados para o dia de hoje.</p>
                  <button 
                    onClick={handleRefresh}
                    className="mt-4 px-4 py-2 text-sm bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all duration-200 inline-flex items-center"
                  >
                    <FiRefreshCw className="mr-2" /> Atualizar
                  </button>
                </div>
              }
              customStyles={{
                headRow: {
                  style: {
                    backgroundColor: '#f9fafb',
                    fontSize: '0.875rem',
                    color: '#4b5563',
                    fontWeight: '600',
                    borderBottom: '1px solid #e5e7eb',
                  },
                },
                rows: {
                  style: {
                    fontSize: '0.875rem',
                    fontWeight: '400',
                    color: '#1f2937',
                    backgroundColor: '#ffffff',
                    minHeight: '48px',
                    '&:not(:last-of-type)': {
                      borderBottomStyle: 'solid',
                      borderBottomWidth: '1px',
                      borderBottomColor: '#f3f4f6',
                    },
                  },
                  highlightOnHoverStyle: {
                    backgroundColor: '#f9fafb',
                    transitionDuration: '0.15s',
                    transitionProperty: 'background-color',
                    outlineStyle: 'solid',
                    outlineWidth: '1px',
                    outlineColor: '#e5e7eb',
                  },
                },
                pagination: {
                  style: {
                    fontSize: '0.875rem',
                    minHeight: '56px',
                    borderTopStyle: 'solid',
                    borderTopWidth: '1px',
                    borderTopColor: '#e5e7eb',
                  },
                  pageButtonsStyle: {
                    borderRadius: '0.375rem',
                    height: '32px',
                    width: '32px',
                    padding: '0',
                    margin: '0 4px',
                    cursor: 'pointer',
                    transition: '0.2s ease-out',
                    color: '#6b7280',
                    fill: '#6b7280',
                    backgroundColor: 'transparent',
                    '&:disabled': {
                      cursor: 'not-allowed',
                      color: '#d1d5db',
                      fill: '#d1d5db',
                    },
                    '&:hover:not(:disabled)': {
                      backgroundColor: '#f3f4f6',
                    },
                    '&:focus': {
                      outline: 'none',
                      backgroundColor: '#e5e7eb',
                    },
                  },
                },
              }}
            />
          </div>
        )}
      </div>
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      {/* Dialog para exibir detalhes da encomenda */}
      <OrderDetailsDialog
        isVisible={showOrderDetails}
        order={selectedOrder}
        handleHideDialog={handleHideOrderDetails}
        onOrderStatusUpdate={handleOrderStatusUpdate}
      />
    </div>
  );
}