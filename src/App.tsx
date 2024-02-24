import { useRef, useState } from "react";
import Modal from "./Modal";
import Button from "./components/Button";

function App() {
  const ref = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("unknown");

  return (
    <>
      <div className="h-screen flex items-center justify-center flex-col">
        <div className="mb-4 font-bold">Hello, {name}.</div>
        <Modal>
          <Modal.Open>
            <Button>Open modal</Button>
          </Modal.Open>
          <Modal.Window title="Title">
            <div>
              <label
                htmlFor="first_name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                First name
              </label>
              <input
                ref={ref}
                type="text"
                id="first_name"
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="John"
                required
              />
            </div>
            <Modal.Footer>
              <Modal.CloseAction>
                <Button variant="tertiary">Close</Button>
              </Modal.CloseAction>
              <Modal.CancelButton />
              <Modal.ActionButton
                label="Save"
                onClick={() => setName(ref.current?.value ?? "")}
              />
            </Modal.Footer>
          </Modal.Window>
        </Modal>
      </div>
    </>
  );
}

export default App;
