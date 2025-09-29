"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { TailSpin } from "react-loader-spinner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { add_new_client } from "@/Services/Admin/cliente";
import { ClientModel } from "@/model/Client";

type Inputs = {
  name: String;
  contact: Number;
  address: String;
  note?: String;
  nif: String;
};

export default function CreatClient() {
  const [loader, setLoader] = useState(false);
  const Router = useRouter();

  useEffect(() => {
    if (!Cookies.get("token")) {
      Router.push("/");
    }
  }, [Router]);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Inputs>({
    criteriaMode: "all",
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoader(true);

    const finalData: ClientModel = {
      name: data.name.toString(),
      contact: data.contact,
      address: data.address.toString(),
      note: data?.note?.toString(),
      nif: data.nif.toString(),
    };

    const res = await add_new_client(finalData);
    if (res.success) {
      toast.success(res?.message);
      setTimeout(() => {
        Router.push("/dashboard");
      }, 2000);
      setLoader(false);
    } else {
      toast.error(res?.message);
      setLoader(false);
    }
  };

  return (
    <div className="w-full  p-4 min-h-screen  bg-gray-50 flex flex-col ">
      <div className="text-sm breadcrumbs  border-b-2 border-b-orange-600">
        <ul className="dark:text-black">
          <li>
            <Link href={"/dashboard"}>
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
              Home
            </Link>
          </li>
          <li>
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
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            Adicionar Cliente
          </li>
        </ul>
      </div>
      <div className="w-full my-2 text-center">
        <h1 className="text-2xl py-2 dark:text-black">Adicionar Cliente</h1>
      </div>
      {loader ? (
        <div className="w-full  flex-col h-96 flex items-center justify-center ">
          <TailSpin
            height="50"
            width="50"
            color="orange"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
          <p className="text-sm mt-2 font-semibold text-orange-500">
            Adicionar cliente ....
          </p>
        </div>
      ) : (
        <div className="w-full h-full flex items-start justify-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-lg  py-2 flex-col "
          >
            <div className="form-control w-full mb-2">
              <label className="label">
                <span className="label-text">Nome</span>
              </label>
              <input
                {...register("name", { required: true })}
                type="text"
                placeholder="Nome do cliente"
                className="input input-bordered w-full"
              />
              {errors.name && (
                <span className="text-red-500 text-xs mt-2">
                  Este campo é obrigatorio
                </span>
              )}
            </div>

            <div className="form-control w-full mb-2">
              <label className="label">
                <span className="label-text">Contacto</span>
              </label>
              <input
                {...register("contact", { required: true })}
                type="number"
                placeholder="Contacto do cliente"
                className="input input-bordered w-full"
              />
              {errors.contact && (
                <span className="text-red-500 text-xs mt-2">
                  Este campo é obrigatorio
                </span>
              )}
            </div>

            <div className="form-control w-full mb-2">
              <label className="label">
                <span className="label-text">Morada</span>
              </label>
              <input
                {...register("address", { required: true })}
                type="text"
                placeholder="Escrever aqui a morada do cliente"
                className="input input-bordered w-full"
              />
              {errors.address && (
                <span className="text-red-500 text-xs mt-2">
                  Este campo é obrigatorio
                </span>
              )}
            </div>

            <div className="form-control w-full mb-2">
              <label className="label">
                <span className="label-text">Observações</span>
              </label>
              <textarea
                placeholder="Escrever aqui uma observação"
                className="textarea textarea-bordered h-24"
              />
            </div>

            <div className="form-control w-full mb-2">
              <label className="label">
                <span className="label-text">Nif (numero de contribuinte)</span>
              </label>
              <input
                type="text"
                placeholder="Escrever aqui o numero de contribuinte"
                className="input input-bordered w-full"
              />
              {errors.nif && (
                <span className="text-red-500 text-xs mt-2">
                  Este campo é obrigatorio
                </span>
              )}
            </div>

            <button className="btn btn-block mt-3">Guardar</button>
          </form>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
