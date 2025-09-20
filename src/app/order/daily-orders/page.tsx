"use client";

import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataTable from "react-data-table-component";
import Loading from "@/app/loading";
import { useSelector } from "react-redux";
import { RootState } from "@/Store/store";
import Link from "next/link";
import { get_all_orders, update_order_status } from "@/Services/Admin/order";
import { get_order_details } from "@/Services/common/order";
import { format } from "date-fns/format";
import { pt } from "date-fns/locale/pt";
import { FiRefreshCw } from "react-icons/fi";
import { OrderDetailsDialog } from "@/components/OrderDetailsDialog";

interface Order {
  orderName: string;
  orderType: 'takeaway' | 'delivery';
  createdAt: string;
  deliveredAt: string;
  isDelivered: boolean;
  isPaid: boolean;
  itemsPrice: number;
  pickupTime?: string | Date;
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

export default function DailyOrdersPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [orderData, setOrderData] = useState<Order[]>([]);
  const [filteredData, setFilteredData] = useState<Order[]>([]);
  const [search, setSearch] = useState<string>("");
  const [todayDate, setTodayDate] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoadingOrderDetails, setIsLoadingOrderDetails] = useState(false);

  const user = useSelector((state: RootState) => state.User.userData);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await get_all_orders();
      if (response?.success) {
        // Filter only today's orders
        const today = new Date();
        const todayString = format(today, "yyyy-MM-dd");
        setTodayDate(format(today, "dd 'de' MMMM 'de' yyyy", { locale: pt }));
        
        const todayOrders = response.data.filter((order: Order) => {
          const orderDate = new Date(order.createdAt);
          return format(orderDate, "yyyy-MM-dd") === todayString;
        });
        
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

  const updateOrderStatus = async (id: string): Promise<void> => {
    try {
      const res = await update_order_status(id);
      if (res?.success) {
        toast.success(res?.message || "Estado do pedido atualizado");
        
        // Update the list after the change
        const updatedOrders = orderData.map(order => {
          if (order._id === id) {
            return { ...order, isDelivered: true };
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
  
  const handleHideOrderDetails = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };

  const columns = [
    {
      name: "Código",
      selector: (row: Order) => row?._id,
      sortable: true,
      cell: (row: Order) => (
        <Link href={`/order/view-orders-details/${row._id}` as any} className="text-blue-600 hover:underline font-medium">
          #{row._id.substring(row._id.length - 6)}
        </Link>
      ),
    },
    {
      name: "Cliente",
      selector: (row: Order) => row?.orderName,
      sortable: true,
      cell: (row: Order) => (
        <span className="font-medium">{row?.orderName}</span>
      ),
    },
    {
      name: "Tipo de Pedido",
      selector: (row: Order) => row?.orderType,
      sortable: true,
      cell: (row: Order) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${row.orderType === 'delivery' ? "bg-blue-100 text-blue-700" : "bg-indigo-100 text-indigo-700"}`}>
          {row.orderType === 'delivery' ? "Delivery" : "Takeway"}
        </span>
      ),
    },
    {
      name: "Hora Takeway",
      selector: (row: Order) => row?.pickupTime ? new Date(row.pickupTime).toISOString() : "",
      sortable: true,
      cell: (row: Order) => (
        <span className="text-gray-600">
          {row?.pickupTime ? format(new Date(row.pickupTime), "dd/MM HH:mm") : "N/A"}
        </span>
      ),
    },
    {
      name: "Total",
      selector: (row: Order) => row?.totalPrice,
      sortable: true,
      cell: (row: Order) => (
        <span className="font-semibold text-blue-700">
          €{row.totalPrice.toFixed(2)}
        </span>
      ),
    },
    {
      name: "Estado",
      selector: (row: Order) => (row?.isDelivered ? "Entregue" : "Pendente"),
      sortable: true,
      cell: (row: Order) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${row.isDelivered ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
          {row.isDelivered ? "Entregue" : "Pendente"}
        </span>
      ),
    },
    {
      name: "Ações",
      cell: (row: Order) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => handleViewOrderDetails(row._id)}
            className="px-3 py-1 text-xs bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-full transition-all duration-200"
          >
            Detalhes
          </button>
          {!row.isDelivered && (
            <button
              onClick={() => updateOrderStatus(row?._id)}
              className="px-3 py-1 text-xs bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-full transition-all duration-200"
            >
              Entregar
            </button>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (search === "") {
      setFilteredData(orderData);
    } else {
      setFilteredData(
        orderData?.filter((item) => {
          const itemData = item?._id?.toUpperCase();
          const clientName = item?.user?.name?.toUpperCase() || "";
          const textData = search.toUpperCase();
          return itemData.indexOf(textData) > -1 || clientName.indexOf(textData) > -1;
        })
      );
    }
  }, [search, orderData]);

  return (
    <div className="w-full bg-gray-50 min-h-screen p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">

        { todayDate && 
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800" >
            Pedidos do Dia - <span className="text-blue-600">{todayDate}</span>
          </h1>
          <div className="flex space-x-3">
            <button 
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-700 hover:text-white rounded-lg transition-all duration-200 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar
            </button>
            <button 
              onClick={handleRefresh} 
              className={`px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all duration-200 flex items-center ${refreshing ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={refreshing}
            >
              <FiRefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
            <Link href={"/order/view-orders" as any}>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Novo Pedido
              </button>
            </Link>
          </div>
        </div>
      }
        {loading ? (
          <Loading />
        ) : (
          <div className="w-full">
            <div className="mb-4 flex justify-between items-center">
              <div className="relative w-80" >
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
                </div>
                <input
                  className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 shadow-sm"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Pesquisar por código ou cliente..."
                />
              </div>
              <div className="text-sm text-gray-500">
                Total: <span className="font-medium text-blue-600">{filteredData.length}</span> pedidos
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
        onOrderStatusUpdate={updateOrderStatus}
      />
    </div>
  );
}