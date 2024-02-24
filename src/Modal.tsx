import {
  ReactElement,
  ReactNode,
  cloneElement,
  createContext,
  useContext,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useOutsideClick } from "./useOutsideClick";

type ModalContextProps = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const ModalContext = createContext<ModalContextProps>({
  open: () => {},
  close: () => {},
  isOpen: false,
});

const Modal = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);

  return (
    <ModalContext.Provider value={{ isOpen, close, open }}>
      {children}
    </ModalContext.Provider>
  );
};

const Window = ({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) => {
  const { isOpen, close } = useContext(ModalContext);
  const ref = useOutsideClick(close);

  if (!isOpen) {
    return;
  }

  return createPortal(
    <div
      id="overlay"
      className="fixed top-0 left-0 w-full h-full z-1000 backdrop-blur-sm bg-gray-100/5"
    >
      <div
        id="modal"
        className="bg-white top-1/2 left-1/2 rounded-md shadow p-8 fixed -translate-x-1/2 -translate-y-1/2 w-[400px] flex items-start justify-between flex-col"
        ref={ref}
      >
        {title && (
          <h2 className="fixed left-8 top-4 text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
        )}
        <button
          type="button"
          onClick={close}
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-md text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white top-2 right-2 fixed"
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
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>
        <div className="mt-6 mb-16 text-gray-500">{children}</div>
      </div>
    </div>,
    document.body
  );
};

const Open = ({ children }: { children: ReactElement }) => {
  const { open } = useContext(ModalContext);

  return cloneElement(children, { onClick: () => open() });
};

const Footer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0  flex p-4 border-t border-gray-200 rounded-b gap-2 place-content-end">
      {children}
    </div>
  );
};

const CloseAction = ({ children }: { children: ReactElement }) => {
  const { close } = useContext(ModalContext);

  return <span onClick={close}>{children}</span>;
};

Modal.Open = Open;
Modal.Window = Window;
Modal.Footer = Footer;
Modal.CloseAction = CloseAction;

export default Modal;
