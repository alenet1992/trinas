"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import useSWR from "swr";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/Store/store";
import Cookies from "js-cookie";
import { ICategory } from "../../../model/Category";
import { GetAllQuantity } from "@/Services/Admin/quantity";
import { add_new_product } from "@/Services/Admin/product";
import { newProductPrice } from "@/Services/Admin/product/price";
import { TailSpin } from 'react-loader-spinner'

type Inputs = {
  name: string;
  description: string;
  slug: string;
  feature: Boolean;
  categoryID: string;
  image: Array<File>;
  quantity: Array<string>[];
};

interface userData {
  _id: string;
  email: string;
  role: string;
  name: string;
}

export default function AddProduct() {
  const [loader, setLoader] = useState(false);
  const Router = useRouter();
  const category = useSelector((state: RootState) => state.Admin.category) as
    | ICategory[];

  const { data: quantity } = useSWR("/gettingAllQuantity", GetAllQuantity);

  useEffect(() => {
    const user: userData | null = JSON.parse(
      localStorage.getItem("user") || "{}"
    );
    if (!Cookies.get("token") || user?.role !== "admin") {
      Router.push("/");
    }
  }, [Router]);

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<Inputs>({
    criteriaMode: "all",
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoader(true);
    const { name, description, categoryID, quantity: quant } = data;
    const productData = new FormData();
    // for (let i = 0; i < selectedFiles.length; i++) {
    //   productData.append("files", selectedFiles[i]);
    // }

    productData.append("name", name);
    productData.append("description", description);
    productData.append("categoryID", categoryID);
    productData.append("quant", JSON.stringify(quant));

    console.log(productData, "productData");

    const res = await add_new_product(productData);
    if (res.success && quantity.data.length > 0) {
      toast.success(res?.message);
      quantity.data.forEach(({ _id }: { _id: string }, index: number) => {
        newProductPrice({
          value: quant[index],
          quantity: _id,
          product: res.saveData._id,
        });
      });
      setTimeout(() => {
        Router.push("/dashboard");
      }, 2000);
      setLoader(false);
    } else {
      toast.error(res?.message);
      setLoader(false);
    }
  };

  const SelectQuantity = () => {
    useFieldArray({
      control,
      name: "quantity",
    });

    if (quantity?.data.length > 0) {
      return quantity.data.map(({ name }: { name: string }, index: number) => {
        return (
          <tr
            key={index}
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              {name}
            </th>
            <td className="px-6 py-4">
              <input
                {...register(`quantity.${index}`)}
                type="text"
                placeholder="Escreva o preço"
                className="input w-full px-4 py-2 rounded-full border-2 border-gray-200 focus:border-gray-600 focus:outline-none transition-all duration-300 shadow-sm"
              />
            </td>
          </tr>
        );
      });
    }
    return <></>;
  };

  return (
    <div className="w-full p-6 min-h-screen bg-gray-50 flex flex-col">
      <div className="text-sm breadcrumbs border-b-2 border-b-gray-800 pb-2 mb-4">
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
            Novo Prato
          </li>
        </ul>
      </div>
      <div className="w-full my-4 text-center">
        <h1 className="text-2xl py-3 dark:text-black font-medium">Novo Prato</h1>
      </div>
      {loader ? (
        <div className="w-full flex-col h-96 flex items-center justify-center rounded-3xl bg-white/50 backdrop-blur-sm shadow-lg">
          <TailSpin
            height="50"
            width="50"
            color="#333333"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
          <p className="text-sm mt-3 font-semibold text-gray-700">
            A criar um novo prato ....
          </p>
        </div>
      ) : (
        <div className="w-full h-full flex items-start justify-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-lg py-6 px-8 flex-col bg-white/80 backdrop-blur-sm shadow-lg rounded-3xl"
          >
            <div className="form-control w-full max-w-full">
              <label className="label">
                <span className="label-text">Categoria</span>
              </label>
              <select
                {...register("categoryID", { required: true })}
                className="select select-bordered rounded-full px-6 border-2 border-gray-200 focus:border-gray-600 focus:outline-none transition-all duration-300 shadow-sm"
              >
                <option disabled selected>
                  Selecionar categoria
                </option>
                {category?.map((item) => {
                  return (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="form-control w-full mb-2">
              <label className="label">
                <span className="label-text">Nome</span>
              </label>
              <input
                {...register("name", { required: true })}
                type="text"
                placeholder="Nome"
                className="input w-full px-6 py-3 rounded-full border-2 border-gray-200 focus:border-gray-600 focus:outline-none transition-all duration-300 shadow-sm"
              />
              {errors.name && (
                <span className="text-red-500 text-xs mt-2">
                  Este campo é obrigatorio,
                </span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Descrição</span>
              </label>
              <textarea
                {...register("description", { required: true })}
                className="textarea h-24 px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-gray-600 focus:outline-none transition-all duration-300 shadow-sm"
                placeholder="Descrição"
              ></textarea>
              {errors.description && (
                <span className="text-red-500 text-xs mt-2">
                  Este campo é obrigatorio,
                </span>
              )}
            </div>
            <section className="mt-6 mb-4">
              <p className="text-base font-medium text-black mb-3 pl-2">
                Tabela de Preços
              </p>
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 rounded-2xl overflow-hidden shadow-sm">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Quantidade
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Preço
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <SelectQuantity />
                </tbody>
              </table>
            </section>
            {/* <input
              type="file"
              name="files"
              multiple
              onChange={handleFileChange}
            /> */}

            <button className="btn btn-block mt-6 rounded-full bg-gradient-to-r from-gray-600 to-gray-800 border-none text-white hover:from-gray-700 hover:to-black shadow-md hover:shadow-lg transition-all duration-300 py-3 text-base font-medium">Criar prato</button>
          </form>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
