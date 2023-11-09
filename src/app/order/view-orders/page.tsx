"use client";
import { get_all_orders_of_user } from "@/Services/common/order";
import { RootState } from "@/Store/store";
import OrdersDetailsDataTable from "@/components/OrdersDetailsDataTable";
import { setOrder } from "@/utils/OrderSlice";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { GrDeliver } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

interface userData {
  email: String;
  role: String;
  _id: String;
  name: String;
}

export default function Page() {
  const Router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(
    (state: RootState) => state.User.userData
  ) as userData | null;

  // useEffect(() => {
  //   const user: userData | null = JSON.parse(
  //     localStorage.getItem("user") || "{}"
  //   );
  //   if (!Cookies.get("token") || !user) {
  //     Router.push("/");
  //   }
  // }, [Router]);

  // useEffect(() => {
  //   fetchOrdersData();
  // }, []);

  // const fetchOrdersData = async () => {
  //   if (!user?._id) return Router.push("/");
  //   const orderData = await get_all_orders_of_user(user?._id);
  //   if (orderData?.success) {
  //     dispatch(setOrder(orderData?.data));
  //   } else {
  //     toast.error(orderData?.message);
  //   }
  // };

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
                <g>
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
                </g>
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
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
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
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
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
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
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
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      ></path>
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                  </span>
                </a>
              </li>
            </ul>
            <a
              href="https://github.com/emsifa/tailwind-pos"
              target="_blank"
              className="mt-auto flex items-center justify-center text-cyan-200 hover:text-cyan-100 h-10 w-10 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </a>
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
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                className="bg-white rounded-3xl shadow text-lg full w-full h-16 py-4 pl-16 transition-shadow focus:shadow-2xl focus:outline-none"
                placeholder="Procurar prato"
                x-model="keyword"
              />
            </div>

            <div className="h-full overflow-hidden mt-4">
              <div className="h-full overflow-y-auto px-2">
                {/* <div
                  className="select-none bg-blue-gray-100 rounded-3xl flex flex-wrap content-center justify-center h-full opacity-25"
                  x-show="filteredProducts().length === 0 &amp;&amp; keyword.length > 0"
                >
                  <div className="w-full text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-24 w-24 inline-block"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      ></path>
                    </svg>
                    <p className="text-xl">
                      EMPTY SEARCH RESULT
                      <br />"
                      <span x-text="keyword" className="font-semibold"></span>"
                    </p>
                  </div>
                </div> */}
                <div
                  x-show="filteredProducts().length"
                  className="grid grid-cols-4 gap-4 pb-3"
                >
                  <template x-for="product in filteredProducts()">
                    <div
                      role="button"
                      className="select-none cursor-pointer transition-shadow overflow-hidden rounded-2xl bg-white shadow hover:shadow-lg"
                      title="product.name"
                    >
                      <img
                        src="https://www.emsifa.com/tailwind-pos/img/beef-burger.png"
                        alt="product.name"
                      />
                      <div className="flex pb-3 px-3 text-sm -mt-3">
                        <p
                          className="flex-grow truncate mr-1"
                          x-text="product.name"
                        ></p>
                        <p
                          className="nowrap font-semibold"
                          x-text="priceFormat(product.price)"
                        ></p>
                      </div>
                    </div>
                  </template>

                  <div
                    role="button"
                    className="select-none cursor-pointer transition-shadow overflow-hidden rounded-2xl bg-white shadow hover:shadow-lg"
                    title="product.name"
                  >
                    <img
                      src="https://www.emsifa.com/tailwind-pos/img/beef-burger.png"
                      alt="product.name"
                    />
                    <div className="flex pb-3 px-3 text-sm -mt-3">
                      <p
                        className="flex-grow truncate mr-1"
                        x-text="product.name"
                      >
                        Beef Burger
                      </p>
                      <p
                        className="nowrap font-semibold"
                        x-text="priceFormat(product.price)"
                      >
                        Rp. 45.000
                      </p>
                    </div>
                  </div>

                  <div
                    role="button"
                    className="select-none cursor-pointer transition-shadow overflow-hidden rounded-2xl bg-white shadow hover:shadow-lg"
                    title="product.name"
                  >
                    <img
                      src="https://www.emsifa.com/tailwind-pos/img/beef-burger.png"
                      alt="product.name"
                    />
                    <div className="flex pb-3 px-3 text-sm -mt-3">
                      <p
                        className="flex-grow truncate mr-1"
                        x-text="product.name"
                      >
                        Sandwich
                      </p>
                      <p
                        className="nowrap font-semibold"
                        x-text="priceFormat(product.price)"
                      >
                        Rp. 32.000
                      </p>
                    </div>
                  </div>

                  <div
                    role="button"
                    className="select-none cursor-pointer transition-shadow overflow-hidden rounded-2xl bg-white shadow hover:shadow-lg"
                    title="product.name"
                  >
                    <img
                      src="https://www.emsifa.com/tailwind-pos/img/beef-burger.png"
                      alt="product.name"
                    />
                    <div className="flex pb-3 px-3 text-sm -mt-3">
                      <p
                        className="flex-grow truncate mr-1"
                        x-text="product.name"
                      >
                        Sawarma
                      </p>
                      <p
                        className="nowrap font-semibold"
                        x-text="priceFormat(product.price)"
                      >
                        Rp. 30.000
                      </p>
                    </div>
                  </div>

                  <div
                    role="button"
                    className="select-none cursor-pointer transition-shadow overflow-hidden rounded-2xl bg-white shadow hover:shadow-lg"
                    title="product.name"
                  >
                    <img
                      src="https://www.emsifa.com/tailwind-pos/img/beef-burger.png"
                      alt="product.name"
                    />
                    <div className="flex pb-3 px-3 text-sm -mt-3">
                      <p
                        className="flex-grow truncate mr-1"
                        x-text="product.name"
                      >
                        Croissant
                      </p>
                      <p
                        className="nowrap font-semibold"
                        x-text="priceFormat(product.price)"
                      >
                        Rp. 16.000
                      </p>
                    </div>
                  </div>

                  <div
                    role="button"
                    className="select-none cursor-pointer transition-shadow overflow-hidden rounded-2xl bg-white shadow hover:shadow-lg"
                    title="product.name"
                  >
                    <img
                      src="https://www.emsifa.com/tailwind-pos/img/beef-burger.png"
                      alt="product.name"
                    />
                    <div className="flex pb-3 px-3 text-sm -mt-3">
                      <p
                        className="flex-grow truncate mr-1"
                        x-text="product.name"
                      >
                        Cinnamon Roll
                      </p>
                      <p
                        className="nowrap font-semibold"
                        x-text="priceFormat(product.price)"
                      >
                        Rp. 20.000
                      </p>
                    </div>
                  </div>

                  <div
                    role="button"
                    className="select-none cursor-pointer transition-shadow overflow-hidden rounded-2xl bg-white shadow hover:shadow-lg"
                    title="product.name"
                  >
                    <img
                      src="https://www.emsifa.com/tailwind-pos/img/beef-burger.png"
                      alt="product.name"
                    />
                    <div className="flex pb-3 px-3 text-sm -mt-3">
                      <p
                        className="flex-grow truncate mr-1"
                        x-text="product.name"
                      >
                        Choco Glaze Donut with Peanut
                      </p>
                      <p
                        className="nowrap font-semibold"
                        x-text="priceFormat(product.price)"
                      >
                        Rp. 10.000
                      </p>
                    </div>
                  </div>

                  <div
                    role="button"
                    className="select-none cursor-pointer transition-shadow overflow-hidden rounded-2xl bg-white shadow hover:shadow-lg"
                    title="product.name"
                  >
                    <img
                      src="https://www.emsifa.com/tailwind-pos/img/beef-burger.png"
                      alt="product.name"
                    />
                    <div className="flex pb-3 px-3 text-sm -mt-3">
                      <p
                        className="flex-grow truncate mr-1"
                        x-text="product.name"
                      >
                        Choco Glazed Donut
                      </p>
                      <p
                        className="nowrap font-semibold"
                        x-text="priceFormat(product.price)"
                      >
                        Rp. 10.000
                      </p>
                    </div>
                  </div>

                  <div
                    role="button"
                    className="select-none cursor-pointer transition-shadow overflow-hidden rounded-2xl bg-white shadow hover:shadow-lg"
                    title="product.name"
                  >
                    <img
                      src="https://www.emsifa.com/tailwind-pos/img/beef-burger.png"
                      alt="product.name"
                    />
                    <div className="flex pb-3 px-3 text-sm -mt-3">
                      <p
                        className="flex-grow truncate mr-1"
                        x-text="product.name"
                      >
                        Red Glazed Donut
                      </p>
                      <p
                        className="nowrap font-semibold"
                        x-text="priceFormat(product.price)"
                      >
                        Rp. 10.000
                      </p>
                    </div>
                  </div>

                  <div
                    role="button"
                    className="select-none cursor-pointer transition-shadow overflow-hidden rounded-2xl bg-white shadow hover:shadow-lg"
                    title="product.name"
                  >
                    <img src="img/coffee-latte.png" alt="Iced Coffee Latte" />
                    <div className="flex pb-3 px-3 text-sm -mt-3">
                      <p
                        className="flex-grow truncate mr-1"
                        x-text="product.name"
                      >
                        Iced Coffee Latte
                      </p>
                      <p
                        className="nowrap font-semibold"
                        x-text="priceFormat(product.price)"
                      >
                        Rp. 25.000
                      </p>
                    </div>
                  </div>

                  <div
                    role="button"
                    className="select-none cursor-pointer transition-shadow overflow-hidden rounded-2xl bg-white shadow hover:shadow-lg"
                    title="product.name"
                  >
                    <img
                      src="https://www.emsifa.com/tailwind-pos/img/beef-burger.png"
                      alt="product.name"
                    />
                    <div className="flex pb-3 px-3 text-sm -mt-3">
                      <p
                        className="flex-grow truncate mr-1"
                        x-text="product.name"
                      >
                        Iced Chocolate
                      </p>
                      <p
                        className="nowrap font-semibold"
                        x-text="priceFormat(product.price)"
                      >
                        Rp. 20.000
                      </p>
                    </div>
                  </div>

                  <div
                    role="button"
                    className="select-none cursor-pointer transition-shadow overflow-hidden rounded-2xl bg-white shadow hover:shadow-lg"
                    title="product.name"
                  >
                    <img
                      src="https://www.emsifa.com/tailwind-pos/img/beef-burger.png"
                      alt="product.name"
                    />
                    <div className="flex pb-3 px-3 text-sm -mt-3">
                      <p
                        className="flex-grow truncate mr-1"
                        x-text="product.name"
                      >
                        Iced Tea
                      </p>
                      <p
                        className="nowrap font-semibold"
                        x-text="priceFormat(product.price)"
                      >
                        Rp. 15.000
                      </p>
                    </div>
                  </div>

                  <div
                    role="button"
                    className="select-none cursor-pointer transition-shadow overflow-hidden rounded-2xl bg-white shadow hover:shadow-lg"
                    title="product.name"
                  >
                    <img
                      src="https://www.emsifa.com/tailwind-pos/img/beef-burger.png"
                      alt="product.name"
                    />
                    <div className="flex pb-3 px-3 text-sm -mt-3">
                      <p
                        className="flex-grow truncate mr-1"
                        x-text="product.name"
                      >
                        Iced Matcha Latte
                      </p>
                      <p
                        className="nowrap font-semibold"
                        x-text="priceFormat(product.price)"
                      >
                        Rp. 22.000
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-5/12 flex flex-col bg-blue-gray-50 h-full bg-white pr-4 pl-2 py-4">
            <div className="bg-white rounded-3xl flex flex-col h-full shadow">
              <div
                x-show="cart.length === 0"
                className="flex-1 w-full p-4 opacity-25 select-none flex flex-col flex-wrap content-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 inline-block"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
                <p>CART EMPTY</p>
              </div>

              <div
                x-show="cart.length > 0"
                className="flex-1 flex flex-col overflow-auto"
              >
                <div className="h-16 text-center flex justify-center">
                  <div className="pl-8 text-left text-lg py-4 relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 inline-block"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      ></path>
                    </svg>
                    <div
                      x-show="getItemsCount() > 0"
                      className="text-center absolute bg-cyan-500 text-white w-5 h-5 text-xs p-0 leading-5 rounded-full -right-2 top-3"
                      x-text="getItemsCount()"
                    >
                      7
                    </div>
                  </div>
                  <div className="flex-grow px-8 text-right text-lg py-4 relative">
                    <button className="text-blue-gray-300 hover:text-pink-500 focus:outline-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 inline-block"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex-1 w-full px-4 overflow-auto">
                  <template x-for="item in cart" key="item.productId">
                    <div className="select-none mb-3 bg-blue-gray-50 rounded-lg w-full text-blue-gray-700 py-2 px-2 flex justify-center">
                      <img
                        src="https://www.emsifa.com/tailwind-pos/img/red-glaze-donut.png"
                        alt=""
                        className="rounded-lg h-10 w-10 bg-white shadow mr-2"
                      />
                      <div className="flex-grow">
                        <h5 className="text-sm" x-text="item.name"></h5>
                        <p
                          className="text-xs block"
                          x-text="priceFormat(item.price)"
                        ></p>
                      </div>
                      <div className="py-1">
                        <div className="w-28 grid grid-cols-3 gap-2 ml-2">
                          <button className="rounded-lg text-center py-1 text-white bg-blue-gray-600 hover:bg-blue-gray-700 focus:outline-none">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-3 inline-block"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M20 12H4"
                              ></path>
                            </svg>
                          </button>
                          <input
                            type="text"
                            className="bg-white rounded-lg text-center shadow focus:outline-none focus:shadow-lg text-sm"
                          />
                          <button className="rounded-lg text-center py-1 text-white bg-blue-gray-600 hover:bg-blue-gray-700 focus:outline-none">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-3 inline-block"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </template>

                  <div className="select-none mb-3 bg-blue-gray-50 rounded-lg w-full text-blue-gray-700 py-2 px-2 flex justify-center">
                    <img
                      src="https://www.emsifa.com/tailwind-pos/img/red-glaze-donut.png"
                      alt=""
                      className="rounded-lg h-10 w-10 bg-white shadow mr-2"
                    />
                    <div className="flex-grow">
                      <h5 className="text-sm" x-text="item.name">
                        Red Glazed Donut
                      </h5>
                      <p
                        className="text-xs block"
                        x-text="priceFormat(item.price)"
                      >
                        Rp. 10.000
                      </p>
                    </div>
                    <div className="py-1">
                      <div className="w-28 grid grid-cols-3 gap-2 ml-2">
                        <button className="rounded-lg text-center py-1 text-white bg-blue-gray-600 hover:bg-blue-gray-700 focus:outline-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-3 inline-block"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M20 12H4"
                            ></path>
                          </svg>
                        </button>
                        <input
                          type="text"
                          className="bg-white rounded-lg text-center shadow focus:outline-none focus:shadow-lg text-sm"
                        />
                        <button className="rounded-lg text-center py-1 text-white bg-blue-gray-600 hover:bg-blue-gray-700 focus:outline-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-3 inline-block"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="select-none mb-3 bg-blue-gray-50 rounded-lg w-full text-blue-gray-700 py-2 px-2 flex justify-center">
                    <img
                      src="https://www.emsifa.com/tailwind-pos/img/red-glaze-donut.png"
                      alt=""
                      className="rounded-lg h-10 w-10 bg-white shadow mr-2"
                    />
                    <div className="flex-grow">
                      <h5 className="text-sm" x-text="item.name">
                        Choco Glazed Donut
                      </h5>
                      <p
                        className="text-xs block"
                        x-text="priceFormat(item.price)"
                      >
                        Rp. 10.000
                      </p>
                    </div>
                    <div className="py-1">
                      <div className="w-28 grid grid-cols-3 gap-2 ml-2">
                        <button className="rounded-lg text-center py-1 text-white bg-blue-gray-600 hover:bg-blue-gray-700 focus:outline-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-3 inline-block"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M20 12H4"
                            ></path>
                          </svg>
                        </button>
                        <input
                          type="text"
                          className="bg-white rounded-lg text-center shadow focus:outline-none focus:shadow-lg text-sm"
                        />
                        <button className="rounded-lg text-center py-1 text-white bg-blue-gray-600 hover:bg-blue-gray-700 focus:outline-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-3 inline-block"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="select-none mb-3 bg-blue-gray-50 rounded-lg w-full text-blue-gray-700 py-2 px-2 flex justify-center">
                    <img
                      src="https://www.emsifa.com/tailwind-pos/img/red-glaze-donut.png"
                      alt=""
                      className="rounded-lg h-10 w-10 bg-white shadow mr-2"
                    />
                    <div className="flex-grow">
                      <h5 className="text-sm" x-text="item.name">
                        Choco Glaze Donut with Peanut
                      </h5>
                      <p
                        className="text-xs block"
                        x-text="priceFormat(item.price)"
                      >
                        Rp. 10.000
                      </p>
                    </div>
                    <div className="py-1">
                      <div className="w-28 grid grid-cols-3 gap-2 ml-2">
                        <button className="rounded-lg text-center py-1 text-white bg-blue-gray-600 hover:bg-blue-gray-700 focus:outline-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-3 inline-block"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M20 12H4"
                            ></path>
                          </svg>
                        </button>
                        <input
                          type="text"
                          className="bg-white rounded-lg text-center shadow focus:outline-none focus:shadow-lg text-sm"
                        />
                        <button className="rounded-lg text-center py-1 text-white bg-blue-gray-600 hover:bg-blue-gray-700 focus:outline-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-3 inline-block"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="select-none mb-3 bg-blue-gray-50 rounded-lg w-full text-blue-gray-700 py-2 px-2 flex justify-center">
                    <img
                      src="https://www.emsifa.com/tailwind-pos/img/red-glaze-donut.png"
                      alt=""
                      className="rounded-lg h-10 w-10 bg-white shadow mr-2"
                    />
                    <div className="flex-grow">
                      <h5 className="text-sm" x-text="item.name">
                        Sandwich
                      </h5>
                      <p
                        className="text-xs block"
                        x-text="priceFormat(item.price)"
                      >
                        Rp. 32.000
                      </p>
                    </div>
                    <div className="py-1">
                      <div className="w-28 grid grid-cols-3 gap-2 ml-2">
                        <button className="rounded-lg text-center py-1 text-white bg-blue-gray-600 hover:bg-blue-gray-700 focus:outline-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-3 inline-block"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M20 12H4"
                            ></path>
                          </svg>
                        </button>
                        <input
                          type="text"
                          className="bg-white rounded-lg text-center shadow focus:outline-none focus:shadow-lg text-sm"
                        />
                        <button className="rounded-lg text-center py-1 text-white bg-blue-gray-600 hover:bg-blue-gray-700 focus:outline-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-3 inline-block"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="select-none mb-3 bg-blue-gray-50 rounded-lg w-full text-blue-gray-700 py-2 px-2 flex justify-center">
                    <img
                      src="https://www.emsifa.com/tailwind-pos/img/red-glaze-donut.png"
                      alt=""
                      className="rounded-lg h-10 w-10 bg-white shadow mr-2"
                    />
                    <div className="flex-grow">
                      <h5 className="text-sm" x-text="item.name">
                        Sawarma
                      </h5>
                      <p
                        className="text-xs block"
                        x-text="priceFormat(item.price)"
                      >
                        Rp. 30.000
                      </p>
                    </div>
                    <div className="py-1">
                      <div className="w-28 grid grid-cols-3 gap-2 ml-2">
                        <button className="rounded-lg text-center py-1 text-white bg-blue-gray-600 hover:bg-blue-gray-700 focus:outline-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-3 inline-block"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M20 12H4"
                            ></path>
                          </svg>
                        </button>
                        <input
                          type="text"
                          className="bg-white rounded-lg text-center shadow focus:outline-none focus:shadow-lg text-sm"
                        />
                        <button className="rounded-lg text-center py-1 text-white bg-blue-gray-600 hover:bg-blue-gray-700 focus:outline-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-3 inline-block"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="select-none mb-3 bg-blue-gray-50 rounded-lg w-full text-blue-gray-700 py-2 px-2 flex justify-center">
                    <img
                      src="https://www.emsifa.com/tailwind-pos/img/red-glaze-donut.png"
                      alt=""
                      className="rounded-lg h-10 w-10 bg-white shadow mr-2"
                    />
                    <div className="flex-grow">
                      <h5 className="text-sm" x-text="item.name">
                        Croissant
                      </h5>
                      <p
                        className="text-xs block"
                        x-text="priceFormat(item.price)"
                      >
                        Rp. 16.000
                      </p>
                    </div>
                    <div className="py-1">
                      <div className="w-28 grid grid-cols-3 gap-2 ml-2">
                        <button className="rounded-lg text-center py-1 text-white bg-blue-gray-600 hover:bg-blue-gray-700 focus:outline-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-3 inline-block"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M20 12H4"
                            ></path>
                          </svg>
                        </button>
                        <input
                          type="text"
                          className="bg-white rounded-lg text-center shadow focus:outline-none focus:shadow-lg text-sm"
                        />
                        <button className="rounded-lg text-center py-1 text-white bg-blue-gray-600 hover:bg-blue-gray-700 focus:outline-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-3 inline-block"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="select-none mb-3 bg-blue-gray-50 rounded-lg w-full text-blue-gray-700 py-2 px-2 flex justify-center">
                    <img
                      src="https://www.emsifa.com/tailwind-pos/img/red-glaze-donut.png"
                      alt=""
                      className="rounded-lg h-10 w-10 bg-white shadow mr-2"
                    />
                    <div className="flex-grow">
                      <h5 className="text-sm" x-text="item.name">
                        Iced Matcha Latte
                      </h5>
                      <p
                        className="text-xs block"
                        x-text="priceFormat(item.price)"
                      >
                        Rp. 22.000
                      </p>
                    </div>
                    <div className="py-1">
                      <div className="w-28 grid grid-cols-3 gap-2 ml-2">
                        <button className="rounded-lg text-center py-1 text-white bg-blue-gray-600 hover:bg-blue-gray-700 focus:outline-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-3 inline-block"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M20 12H4"
                            ></path>
                          </svg>
                        </button>
                        <input
                          type="text"
                          className="bg-white rounded-lg text-center shadow focus:outline-none focus:shadow-lg text-sm"
                        />
                        <button className="rounded-lg text-center py-1 text-white bg-blue-gray-600 hover:bg-blue-gray-700 focus:outline-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-3 inline-block"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="select-none h-auto w-full text-center pt-3 pb-4 px-4">
                <div className="flex mb-3 text-lg font-semibold text-blue-gray-700">
                  <div>TOTAL</div>
                  <div
                    className="text-right w-full"
                    x-text="priceFormat(getTotalPrice())"
                  >
                    Rp. 130.000
                  </div>
                </div>
                <div className="mb-3 text-blue-gray-700 px-3 pt-2 pb-3 rounded-lg bg-blue-gray-50">
                  <div className="flex text-lg font-semibold">
                    <div className="flex-grow text-left">CASH</div>
                    <div className="flex text-right">
                      <div className="mr-2">Rp</div>
                      <input
                        type="text"
                        className="w-28 text-right bg-white shadow rounded-lg focus:bg-white focus:shadow-lg px-2 focus:outline-none"
                      />
                    </div>
                  </div>
                  <hr className="my-2" />
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <template x-for="money in moneys">
                      <button className="bg-white rounded-lg shadow hover:shadow-lg focus:outline-none inline-block px-2 py-1 text-sm">
                        +<span x-text="numberFormat(money)"></span>
                      </button>
                    </template>

                    <button className="bg-white rounded-lg shadow hover:shadow-lg focus:outline-none inline-block px-2 py-1 text-sm">
                      +<span x-text="numberFormat(money)">2.000</span>
                    </button>

                    <button className="bg-white rounded-lg shadow hover:shadow-lg focus:outline-none inline-block px-2 py-1 text-sm">
                      +<span x-text="numberFormat(money)">5.000</span>
                    </button>

                    <button className="bg-white rounded-lg shadow hover:shadow-lg focus:outline-none inline-block px-2 py-1 text-sm">
                      +<span x-text="numberFormat(money)">10.000</span>
                    </button>

                    <button className="bg-white rounded-lg shadow hover:shadow-lg focus:outline-none inline-block px-2 py-1 text-sm">
                      +<span x-text="numberFormat(money)">20.000</span>
                    </button>

                    <button className="bg-white rounded-lg shadow hover:shadow-lg focus:outline-none inline-block px-2 py-1 text-sm">
                      +<span x-text="numberFormat(money)">50.000</span>
                    </button>

                    <button className="bg-white rounded-lg shadow hover:shadow-lg focus:outline-none inline-block px-2 py-1 text-sm">
                      +<span x-text="numberFormat(money)">100.000</span>
                    </button>
                  </div>
                </div>
                <div
                  x-show="change > 0"
                  className="flex mb-3 text-lg font-semibold bg-cyan-50 text-blue-gray-700 rounded-lg py-2 px-3"
                >
                  <div className="text-cyan-800">CHANGE</div>
                  <div
                    className="text-right flex-grow text-cyan-600"
                    x-text="priceFormat(change)"
                  >
                    Rp. -130.000
                  </div>
                </div>
                <div
                  x-show="change < 0"
                  className="flex mb-3 text-lg font-semibold bg-pink-100 text-blue-gray-700 rounded-lg py-2 px-3"
                >
                  <div
                    className="text-right flex-grow text-pink-600"
                    x-text="priceFormat(change)"
                  >
                    Rp. -130.000
                  </div>
                </div>
                <div
                  x-show="change == 0 &amp;&amp; cart.length > 0"
                  className="flex justify-center mb-3 text-lg font-semibold bg-cyan-50 text-cyan-700 rounded-lg py-2 px-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 inline-block"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    ></path>
                  </svg>
                </div>
                <button className="text-white rounded-2xl text-lg w-full py-3 focus:outline-none bg-blue-gray-200">
                  SUBMIT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
