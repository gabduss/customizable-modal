import Modal from "./Modal";

function App() {
  return (
    <>
      <div className="flex justify-center self-center">
        <Modal>
          <Modal.Open>
            <button>Open modal</button>
          </Modal.Open>
          <Modal.Window>
            <div>Content</div>
          </Modal.Window>
        </Modal>
      </div>
    </>
  );
}

export default App;
