"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { login_me } from "@/Services/auth";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import Navbar from "@/components/Navbar";
import { setUserData } from "@/utils/UserDataSlice";
import { useRouter } from "next/navigation";
import { TailSpin } from "react-loader-spinner";

export default function Login() {
  const dispatch = useDispatch();
  const Router = useRouter();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState({ email: "", password: "" });
  const [loading, setLoding] = useState<Boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoding(true);
    if (!formData.email) {
      setError({ ...error, email: "Email Field is Required" });
      return;
    }
    if (!formData.password) {
      setError({ ...error, password: "Password Field is required" });
      return;
    }

    const res = await login_me(formData);
    if (res.success) {
      setLoding(false);
      Cookies.set("token", res?.finalData?.token);
      localStorage.setItem("user", JSON.stringify(res?.finalData?.user));
      const userData = localStorage.getItem("user");
      const userDataString = typeof userData === "string" ? userData : "";
      dispatch(setUserData(JSON.parse(userDataString)));
      if (res?.finalData?.user?.role === "admin") {
        Router.push("/dashboard" as any);
      } else if (res?.finalData?.user?.role === "user") {
        Router.push("/order/view-orders" as any);
      } else {
        Router.push("/");
      }
    } else {
      setLoding(false);
      toast.error(res.message);
    }
  };

  useEffect(() => {
    if (Cookies.get("token")) {
      Router.push("/");
    }
  }, [Router]);

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 text-black">
        <div className="flex flex-col items-center text-center justify-center px-6 py-12 mx-auto min-h-screen">
          <div className="w-full bg-white/80 backdrop-blur-sm text-black rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-8 space-y-4 md:space-y-6">
              <h1 className="text-2xl font-bold leading-tight tracking-tight text-brand md:text-3xl">
                Login
              </h1>
              <form
                onSubmit={handleSubmit}
                className="space-y-4 md:space-y-6"
                action="#"
              >
                <div className="text-left">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Email
                  </label>
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50/50 backdrop-blur-sm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-brand focus:border-brand block w-full p-2.5 transition-all duration-200"
                    placeholder="name@company.com"
                  />
                  {error.email && (
                    <p className="text-sm text-red-500">{error.email}</p>
                  )}
                </div>
                <div className="text-left">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Password
                  </label>
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50/50 backdrop-blur-sm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-brand focus:border-brand block w-full p-2.5 transition-all duration-200"
                  />
                  {error.password && (
                    <p className="text-sm text-red-500">{error.password}</p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        checked
                        className="w-4 h-4 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-brand/30"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="remember" className="text-gray-500  ">
                        Memorizar
                      </label>
                    </div>
                  </div>
                  {/* <Link
                    href="/auth/reset"
                    className="text-sm font-medium text-brand hover:underline "
                  >
                    Forgot password?
                  </Link> */}
                </div>
                {loading ? (
                  <button
                    type="button"
                    className="w-full flex items-center justify-center text-white bg-brand hover:bg-brand-dark focus:ring-4 focus:outline-none focus:ring-brand/30 font-medium rounded-full text-sm px-5 py-2.5 text-center transition-all duration-200"
                  >
                    <TailSpin
                      height="20"
                      width="20"
                      color="white"
                      ariaLabel="tail-spin-loading"
                      radius="1"
                      wrapperStyle={{}}
                      wrapperClass=""
                      visible={true}
                    />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-full text-white bg-brand hover:bg-brand-dark focus:ring-4 focus:outline-none focus:ring-brand/30 font-medium rounded-full text-sm px-5 py-2.5 text-center transition-all duration-200"
                  >
                    Sign in
                  </button>
                )}

                {/* <p className="text-sm text-black ">
                  Ainda não tem uma conta?{" "}
                  <Link
                    href={"/auth/register"}
                    className="font-medium text-brand hover:underline "
                  >
                    Registar
                  </Link>
                </p> */}
              </form>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}
