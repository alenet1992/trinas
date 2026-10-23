import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { add_new_client, update_a_client } from "@/Services/Admin/cliente";
import { ClientModel } from "@/model/Client";
import { useSWRConfig } from "swr";
import { TailSpin } from 'react-loader-spinner'

type Inputs = {
  name: String;
  contact: Number;
  address: String;
  note?: String;
  nif: String;
};

interface IAddClientDialog {
  isVisible: boolean;
  handleHideDialog: () => void;
  onClientAdded?: () => void;
  // Quando definido, o diálogo edita este cliente em vez de criar um novo
  client?: ClientModel | null;
}

export const AddClientDialog = (props: IAddClientDialog) => {
  const { isVisible, handleHideDialog, onClientAdded, client } = props;
  const isEdit = !!client?._id;
  const [loader, setLoader] = useState(false);
  const { mutate } = useSWRConfig();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm<Inputs>({
    criteriaMode: "all",
  });

  useEffect(() => {
    if (!isVisible) return;
    reset({
      name: client?.name ?? "",
      contact: client?.contact,
      address: client?.address ?? "",
      note: client?.note ?? "",
      nif: client?.nif ?? "",
    });
  }, [isVisible, client, reset]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoader(true);

    const finalData: ClientModel = {
      name: data.name.toString(),
      contact: data.contact,
      address: data.address.toString(),
      note: data?.note?.toString(),
      nif: data?.nif?.toString() ?? "",
    };

    try {
      const res = isEdit
        ? await update_a_client({ ...finalData, _id: client?._id })
        : await add_new_client(finalData);
      if (res.success) {
        toast.success(res?.message);
        // Atualizar os dados da lista
        mutate("/gettingAllClientesFOrAdmin");
        // Resetar o formulário
        reset();
        // Fechar o diálogo
        handleHideDialog();
        // Callback opcional
        if (onClientAdded) {
          onClientAdded();
        }
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      toast.error(isEdit ? "Erro ao atualizar cliente" : "Erro ao adicionar cliente");
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <div
        id="add-client-modal"
        data-modal-backdrop="static"
        aria-hidden="true"
        className={`${
          !isVisible ? "hidden" : ""
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-screen`}
        style={{ backgroundColor: "rgba(17, 24, 39, 0.7)", backdropFilter: "blur(4px)" }}
      >
        <div className="p-4 w-full max-w-2xl max-h-full mx-auto animate-fadeIn">
          <div className="relative bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800">
                {isEdit ? "Editar Cliente" : "Adicionar Cliente"}
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-full text-sm w-8 h-8 ms-auto inline-flex justify-center items-center transition-all duration-200"
                data-modal-hide="add-client-modal"
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

            <div className="p-4 md:p-5 space-y-4 bg-gray-50 bg-opacity-50 rounded-b-2xl">
              {loader ? (
                <div className="w-full flex-col h-64 flex items-center justify-center">
                  <TailSpin
                    height="50"
                    width="50"
                    color="blue"
                    ariaLabel="tail-spin-loading"
                    radius="1"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                  />
                  <p className="text-sm mt-2 font-semibold text-brand">
                    {isEdit ? "A atualizar cliente..." : "A adicionar cliente..."}
                  </p>
                </div>
              ) : (
                <div className="w-full h-full flex items-start justify-center">
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full py-2 flex-col"
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
                          Este campo é obrigatório
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
                          Este campo é obrigatório
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
                          Este campo é obrigatório
                        </span>
                      )}
                    </div>

                    <div className="form-control w-full mb-2">
                      <label className="label">
                        <span className="label-text">Observações</span>
                      </label>
                      <textarea
                        {...register("note")}
                        placeholder="Escrever aqui uma observação"
                        className="textarea textarea-bordered h-24"
                      />
                    </div>

                    <div className="form-control w-full mb-2">
                      <label className="label">
                        <span className="label-text">Nif (número de contribuinte)</span>
                      </label>
                      <input
                        {...register("nif", { required: false })}
                        type="text"
                        placeholder="Escrever aqui o número de contribuinte"
                        className="input input-bordered w-full"
                      />
                      {errors.nif && (
                        <span className="text-red-500 text-xs mt-2">
                          Este campo é obrigatório
                        </span>
                      )}
                    </div>

                    <button type="submit" className="btn btn-primary btn-block mt-3">
                      Guardar
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};