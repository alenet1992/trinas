import { ClientModel } from "@/model/Client";

interface IDialog {
  isVisible: boolean;
  info?: ClientModel | null;
  handleHideDialog: (e: any) => void;
}

export const Dialog = (props: IDialog) => {
  const { isVisible, info, handleHideDialog } = props;

  console.log("info", info);
  if (!info) {
    return <></>;
  }

  const { name, address, note, contact } = info;

  return (
    <>
      <div
        id="static-modal"
        data-modal-backdrop="static"
        aria-hidden="true"
        className={`${
          !isVisible ? "hidden" : ""
        }  overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-screen`}
        style={{ backgroundColor: "rgba(17, 24, 39, 0.7)", backdropFilter: "blur(4px)" }}
      >
        <div className="p-4 w-full max-w-2xl max-h-full mx-auto animate-fadeIn">
          <div className="relative bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800">
                Informações - {name}
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-full text-sm w-8 h-8 ms-auto inline-flex justify-center items-center transition-all duration-200"
                data-modal-hide="static-modal"
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
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Fechar</span>
              </button>
            </div>

            <div className="p-4 md:p-5 space-y-4 bg-gray-50 bg-opacity-50 rounded-b-2xl">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-2">
                <p className="text-base leading-relaxed text-gray-700 mb-3">
                  <label className="text-gray-900 font-medium block mb-1 text-sm">Nome:</label>
                  <span className="pl-2">{name}</span>
                </p>
                <p className="text-base leading-relaxed text-gray-700 mb-3">
                  <label className="text-gray-900 font-medium block mb-1 text-sm">Morada:</label>
                  <span className="pl-2">{address}</span>
                </p>
                <p className="text-base leading-relaxed text-gray-700 mb-3">
                  <label className="text-gray-900 font-medium block mb-1 text-sm">Contacto:</label>
                  <span className="pl-2">{contact.toString()}</span>
                </p>
                <p className="text-base leading-relaxed text-gray-700">
                  <label className="text-gray-900 font-medium block mb-1 text-sm">Observações:</label>
                  <span className="pl-2">{note}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
