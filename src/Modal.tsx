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

const Window = ({ children }: { children: ReactNode }) => {
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
        className="bg-green-200 top-1/2 left-1/2 rounded shadow p-16 fixed -translate-x-1/2 -translate-y-1/2"
        ref={ref}
      >
        <button onClick={close} className="fixed top-0 right-0 pt-2 pr-3">
          X
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

const Open = ({ children }: { children: ReactElement }) => {
  const { open } = useContext(ModalContext);

  return cloneElement(children, { onClick: () => open() });
};

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
