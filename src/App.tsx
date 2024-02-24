import Modal from "./Modal";
import Button from "./components/Button";

function App() {
  return (
    <>
      <div className="h-screen flex items-center justify-center">
        <Modal>
          <Modal.Open>
            <Button>Open modal</Button>
          </Modal.Open>
          <Modal.Window title="Fehler aufgetretten">
            <div>Content</div>
            <Modal.Footer>
              <Button variant="secondary">Close</Button>
              <Button>Speichern</Button>
            </Modal.Footer>
          </Modal.Window>
        </Modal>
      </div>
    </>
  );
}

export default App;
