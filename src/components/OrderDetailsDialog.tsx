import React from "react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { update_order_status } from "@/Services/Admin/order";
import { toast } from "react-toastify";

export interface Order {
  orderName: string;
  orderType: 'takeaway' | 'delivery';
  createdAt: string;
  deliveredAt: string;
  isDelivered: boolean;
  isPaid: boolean;
  itemsPrice: number;
  orderItems: {
    quantityIndex: number;
    price: number;
    product: {
      productImage: string;
      productName: string;
      productPrice: number;
      _id: string;
    };
    _id: string;
  }[];
  paidAt: string;
  paymentMethod: string;
  shippingAddress?: {
    name: string;
    contact: number;
    address: string;
    note?: string;
    nif?: string;
  };
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  user: {
    email: string;
    name: string;
    _id: string;
  };
  _id: string;
  status: 'new' | 'in_progress' | 'delivered';
  pickupTime: string;
  orderNumber: number;
}

interface IOrderDetailsDialog {
  isVisible: boolean;
  order?: Order | null;
  handleHideDialog: () => void;
  onOrderStatusUpdate?: (orderId: string, status: 'new' | 'in_progress' | 'delivered') => void;
}

export const OrderDetailsDialog = (props: IOrderDetailsDialog) => {
  const { isVisible, order, handleHideDialog, onOrderStatusUpdate } = props;
  const [isUpdating, setIsUpdating] = React.useState<boolean>(false);

  if (!order) {
    return null;
  }
  
  const handleUpdateOrderStatus = async () => {
    if (!order._id || order.isDelivered) return;
    
    setIsUpdating(true);
    try {
      const res = await update_order_status(order._id, order.status);
      if (res?.data.success) {
        toast.success(res?.data?.message || "Estado da encomenda atualizado");
        if (onOrderStatusUpdate) {
          onOrderStatusUpdate(order._id, res?.data?.status || '');
        }
      } else {
        toast.error(res?.data?.message || "Erro ao atualizar estado da encomenda");
      }
    } catch (error) {
      toast.error("Erro ao atualizar estado da encomenda");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      id="order-details-modal"
      data-modal-backdrop="static"
      aria-hidden="true"
      className={`${
        !isVisible ? "hidden" : ""
      } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-screen`}
      style={{ backgroundColor: "rgba(17, 24, 39, 0.7)", backdropFilter: "blur(4px)" }}
    >
      <div className="p-4 w-full max-w-4xl max-h-full mx-auto animate-fadeIn">
        <div className="relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-y-auto max-h-[90vh]">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800">
              Encomenda #{order.orderNumber}
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-full text-sm w-8 h-8 ms-auto inline-flex justify-center items-center transition-all duration-200"
              data-modal-hide="order-details-modal"
              onClick={handleHideDialog}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Fechar</span>
            </button>
          </div>

          <div className="p-4 md:p-5 space-y-4 bg-gray-50 bg-opacity-50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
              <div>
                <p className="text-sm text-gray-600">
                  Criado em {order.createdAt ? format(new Date(order.createdAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: pt }) : "--"}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Tipo: <span className="font-medium">{order.orderType === 'takeaway' ? 'Takeaway' : 'Entrega'}</span>
                </p>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Estado da Entrega:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.isDelivered ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                  {order.isDelivered ? "Entregue" : "Pendente"}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-lg font-medium text-gray-800 mb-3">Itens da Encomenda</h4>
              <div className="grid grid-cols-1 gap-4">
                {order.orderItems.map((item) => (
                  <div key={item._id} className="bg-white shadow-sm border border-gray-100 rounded-lg flex items-center overflow-hidden">
                    <div className="flex flex-col p-3 flex-1">
                      <h5 className="font-medium text-gray-800">{item.product.productName}</h5>
                      {/* <p className="text-sm font-semibold text-brand-dark">€{item.product.productPrice.toFixed(2)}</p> */}
                      <p className="text-sm text-gray-600">
                        Quantidade: <span className="font-semibold">{item.quantityIndex === 0 ? '1/2 dose' : '1 dose'}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Total: <span className="font-semibold">€ {item.price}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-lg font-medium text-gray-800 mb-3">Resumo da Encomenda</h4>
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex justify-between py-2 mt-2 pt-2">
                  <span className="text-gray-800 font-medium">Total:</span>
                  <span className="font-bold text-brand-dark">€{order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-lg font-medium text-gray-800 mb-3">Informações de Entrega</h4>
              {order.shippingAddress && order.orderType === 'delivery' && (
                <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Nome:</span> {order.shippingAddress.name}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Morada:</span> {order.shippingAddress.address}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Numero:</span> {order.shippingAddress.contact}
                  </p>
                </div>
              ) || (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Entrega:</span> {order.pickupTime ? format(new Date(order.pickupTime), "HH:mm", { locale: pt }) : 'Retirar na Loja'}
                </p>
              )}
            </div>
        

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-lg font-medium text-gray-800 mb-3">Informações do Cliente</h4>
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Nome:</span> {order.shippingAddress?.name || order.user.name}
                </p>
              </div>
            </div>
          </div>
          
          {(order.status || order.status === 'new' ||  order.status === 'in_progress') && (
            <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-md flex justify-center">
              <button
                onClick={handleUpdateOrderStatus}
                disabled={isUpdating}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center justify-center min-w-[200px]"
              >
                {isUpdating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    A atualizar...
                  </>
                ) : (
                  "Marcar como " + (order.status === 'new' ? 'Em Progresso' : 'Entregue')
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};