"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { Oval } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { RootState } from "@/Store/store";
import useSWR from "swr";
import { GetAllQuantity } from "@/Services/Admin/quantity";
import { add_new_product, get_product_by_id, update_a_product } from "@/Services/Admin/product";
import { getProductPricesByProductId, newProductPrice } from "@/Services/Admin/product/price";

type Inputs = {
  name: string;
  description: string;
  feature: boolean;
  categoryID: string;
  image: Array<File>;
  quantity: string[];
};

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productId?: string;
  isEditing?: boolean;
}

export default function AddProductModal({ isOpen, onClose, onSuccess, productId, isEditing = false }: AddProductModalProps) {
  const [loader, setLoader] = useState(false);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const category = useSelector((state: RootState) => state.Admin.category);
  const { data: quantity } = useSWR("/gettingAllQuantity", GetAllQuantity);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm<Inputs>();

  const { data: productData } = useSWR(
    isEditing && productId ? `/gettingProductbyID/${productId}` : null,
    () => productId ? get_product_by_id(productId) : null
  );

  useEffect(() => {
    if (isEditing && productData?.success && productData?.data) {
      const product = productData.data;
      setLoadingPrices(true);
      getProductPricesByProductId(product._id)
        .then((pricesResponse) => {
          if (pricesResponse?.success && pricesResponse?.data?.length > 0) {
            reset({
              name: product.name,
              description: product.description,
              categoryID: product.category._id,
              quantity: pricesResponse?.data?.map((price: any) => price.value) || []
            });
          }
        })
        .finally(() => {
          setLoadingPrices(false);
        });
    }
  }, [productData, reset, isEditing]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoader(true);
    try {
      const { name, description, categoryID, quantity: quant } = data;
      
      console.log('quant', quant);

      if (isEditing && productId) {
        const updatedData = {
          _id: productId,
          name,
          description,
          categoryID,
          quantity: quant
        };
        const res = await update_a_product(updatedData);
        if (res?.success) {
          toast.success(res?.message);
          onSuccess();
          onClose();
        } else {
          toast.error(res?.message);
        }
      } else {
        const productData = new FormData();
        productData.append("name", name);
        productData.append("description", description);
        productData.append("categoryID", categoryID);
        productData.append("quant", JSON.stringify(quant));

        const res = await add_new_product(productData);
        if (res.success && quantity?.data?.length > 0) {
          toast.success(res?.message);
          quantity.data.forEach(({ _id }: { _id: string }, index: number) => {
            newProductPrice({
              value: quant[index],
              quantity: _id,
              product: res.saveData._id,
            });
          });
          onSuccess();
          reset();
          onClose();
        } else {
          toast.error(res?.message);
        }
      }
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      toast.error("Erro ao criar produto");
    } finally {
      setLoader(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">{isEditing ? 'Editar Prato' : 'Novo Prato'}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loader || loadingPrices ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Oval
            height={50}
            width={50}
            color="#003087"
            secondaryColor="#3355AA"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
            <p className="text-sm mt-3 font-semibold text-gray-700">
              {isEditing ? 'A atualizar prato...' : 'A criar um novo prato...'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Categoria</span>
              </label>
              <select
                {...register("categoryID", { required: true })}
                className="select select-bordered rounded-full px-6 border-2 border-gray-200 focus:border-gray-600 focus:outline-none transition-all duration-300 shadow-sm w-full"
              >
                <option disabled selected>
                  Selecionar categoria
                </option>
                {category?.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
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
                  Este campo é obrigatório
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
              />
              {errors.description && (
                <span className="text-red-500 text-xs mt-2">
                  Este campo é obrigatório
                </span>
              )}
            </div>

            <section className="mt-6 mb-4">
              <p className="text-base font-medium text-black mb-3 pl-2">
                Tabela de Preços
              </p>
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 rounded-2xl overflow-hidden shadow-sm">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:text-gray-600">
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
                  {quantity?.data?.map(({ name, _id }: { name: string; _id: string }, index: number) => (
                    <tr
                      key={_id}
                      className="bg-white border-b hover:bg-gray-50 transition-colors duration-200"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        {name}
                      </th>
                      <td className="px-6 py-4">
                        <input
                          {...register(`quantity.${index}`)}
                          type="text"
                          placeholder="Escreva o preço"
                          className="input w-full px-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:ring-brand focus:border-brand transition-all duration-300 shadow-sm"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-full border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-brand to-brand-dark text-white hover:from-brand-dark hover:to-brand-dark transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {loader ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}