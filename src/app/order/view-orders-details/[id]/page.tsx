"use client";
import { get_order_details } from "@/Services/common/order";
import { RootState } from "@/Store/store";
import Loading from "@/app/loading";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { GrDeliver } from "react-icons/gr";
import { TbListDetails } from "react-icons/tb";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface userData {
  email: String;
  role: String;
  _id: String;
  name: String;
}

interface Order {
  orderName: string;
  orderType: 'takeaway' | 'delivery';
  createdAt: string;
  deliveredAt: string;
  isDelivered: boolean;
  isPaid: boolean;
  itemsPrice: number;
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

interface pageParam {
  id: string;
}

export default function Page({
  params,
  searchParams,
}: {
  params: pageParam;
  searchParams: any;
}) {
  const Router = useRouter();

  const user = useSelector(
    (state: RootState) => state.User.userData
  ) as userData | null;
  const [orderData, setOrderData] = useState<Order | null>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user: userData | null = JSON.parse(
      localStorage.getItem("user") || "{}"
    );
    if (!Cookies.get("token") || !user) {
      Router.push("/");
    }
  }, [Router]);

  useEffect(() => {
    fetchOrdersData();
  }, []);

  const fetchOrdersData = async () => {
    if (!user?._id) return Router.push("/");
    try {
      const orderData = await get_order_details(params?.id);
      if (orderData?.success) {
        setOrderData(orderData?.data);
      } else {
        toast.error(orderData?.message || "Erro ao carregar detalhes do pedido");
      }
    } catch (error) {
      toast.error("Erro ao carregar detalhes do pedido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen px-2 py-2">
      <div className="text-sm breadcrumbs border-b-2 border-b-line mb-4">
        <ul className="dark:text-black">
          <li>
            <Link href={"/"}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="w-4 h-4 mr-2 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                ></path>
              </svg>
              Início
            </Link>
          </li>
          <li>
            <Link href="/order/view-orders">
              <GrDeliver className="w-4 h-4 mr-2 stroke-current" />
              Pedidos
            </Link>
          </li>
          <li>
            <TbListDetails className="w-4 h-4 mr-2 stroke-current" />
            Detalhes do Pedido
          </li>
        </ul>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full dark:text-black overflow-y-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 px-4 gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Pedido #{params?.id.substring(params?.id.length - 6)}</h1>
              <p className="text-sm text-gray-600 mt-1">
                Criado em {orderData?.createdAt ? format(new Date(orderData.createdAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: pt }) : "--"}
              </p>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Estado da Entrega:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${orderData?.isDelivered ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                {orderData?.isDelivered ? "Entregue" : "Pendente"}
              </span>
            </div>
          </div>
          <div className="w-full flex px-2 flex-wrap items-center  justify-center">
            {/*Order product Card */}
            {orderData?.orderItems.map((item, index) => {
              return (
                <div
                  key={index}
                  className="md:w-96 m-2 w-52 h-52 bg-white shadow-sm border border-gray-100 rounded-lg flex md:flex-row flex-col items-center justify-start overflow-hidden"
                >
                  <div className="relative w-1/2 h-full">
                    <Image
                      src={item?.product?.productImage}
                      alt={item?.product?.productName || "Imagem do produto"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex px-3 py-2 flex-col items-start justify-start w-1/2">
                    <h1 className="my-1 font-medium text-gray-800">{item?.product?.productName}</h1>
                    <p className="text-sm my-1 font-semibold text-brand-dark">
                      €{item?.product?.productPrice?.toFixed(2)}
                    </p>
                    <p className="text-sm my-1 text-gray-600">
                      Quantidade:{" "}
                      <span className="font-semibold">{item?.qty}</span>
                    </p>
                    <p className="text-sm my-1 text-gray-600">
                      Subtotal:{" "}
                      <span className="font-semibold">€{(item?.product?.productPrice * item?.qty).toFixed(2)}</span>
                    </p>
                  </div>
                </div>
              );
            })}

            {/*Order product Card */}
          </div>
          <div className="flex flex-wrap w-full items-center justify-center">
            <div className="border border-gray-100 rounded-lg shadow-sm bg-white m-2 w-96 flex-col flex items-start justify-start py-4 px-5">
              <h1 className="text-xl font-semibold text-gray-800 mb-3">Endereço de Entrega</h1>
              <div className="flex py-2 w-full text-sm justify-between border-b border-gray-100">
                <p className="text-gray-600">Nome Completo</p>
                <p className="font-semibold text-gray-800">
                  {orderData?.shippingAddress?.fullName}
                </p>
              </div>
              <div className="flex py-2 w-full text-sm justify-between border-b border-gray-100">
                <p className="text-gray-600">Endereço</p>
                <p className="font-semibold text-gray-800">
                  {orderData?.shippingAddress?.address}
                </p>
              </div>
              <div className="flex py-2 w-full text-sm justify-between border-b border-gray-100">
                <p className="text-gray-600">Cidade</p>
                <p className="font-semibold text-gray-800">
                  {orderData?.shippingAddress?.city}
                </p>
              </div>
              <div className="flex py-2 w-full text-sm justify-between border-b border-gray-100">
                <p className="text-gray-600">Código Postal</p>
                <p className="font-semibold text-gray-800">
                  {orderData?.shippingAddress?.postalCode}
                </p>
              </div>
              <div className="flex py-2 w-full text-sm justify-between">
                <p className="text-gray-600">País</p>
                <p className="font-semibold text-gray-800">
                  {orderData?.shippingAddress?.country}
                </p>
              </div>
            </div>
            <div className="border border-gray-100 rounded-lg shadow-sm bg-white m-2 w-96 flex-col flex items-start justify-start py-4 px-5">
              <h1 className="text-xl font-semibold text-gray-800 mb-3">Detalhes do Pagamento</h1>
              <div className="flex py-2 w-full text-sm justify-between border-b border-gray-100">
                <p className="text-gray-600">Método de Pagamento</p>
                <p className="font-semibold text-gray-800">{orderData?.paymentMethod}</p>
              </div>
              <div className="flex py-2 w-full text-sm justify-between border-b border-gray-100">
                <p className="text-gray-600">Valor dos Itens</p>
                <p className="font-semibold text-gray-800">€{orderData?.itemsPrice?.toFixed(2)}</p>
              </div>
              <div className="flex py-2 w-full text-sm justify-between border-b border-gray-100">
                <p className="text-gray-600">Taxa de Entrega</p>
                <p className="font-semibold text-gray-800">€{orderData?.shippingPrice?.toFixed(2)}</p>
              </div>
              <div className="flex py-2 w-full text-sm justify-between border-b border-gray-100">
                <p className="text-gray-600">Impostos</p>
                <p className="font-semibold text-gray-800">€{orderData?.taxPrice?.toFixed(2)}</p>
              </div>
              <div className="flex py-2 w-full text-sm justify-between border-b border-gray-100">
                <p className="text-gray-600">Valor Total</p>
                <p className="font-semibold text-brand-dark">€{orderData?.totalPrice?.toFixed(2)}</p>
              </div>
              <div className="flex py-2 w-full text-sm justify-between">
                <p className="text-gray-600">Estado do Pagamento</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
