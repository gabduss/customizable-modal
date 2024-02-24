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
              <Modal.CloseAction>
                <Button
                  variant="secondary"
                  onClick={() => console.log("schliessen")}
                >
                  Close
                </Button>
              </Modal.CloseAction>
              <Modal.CloseAction>
                <Button onClick={() => console.log("speichern")}>
                  Speichern
                </Button>
              </Modal.CloseAction>
            </Modal.Footer>
          </Modal.Window>
        </Modal>
      </div>
    </>
  );
}

export default App;
