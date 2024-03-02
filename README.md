# The Art of Component Composition: Leveraging Compound Components in React

As front end application gets bigger and bigger, they have to cover more and more use cases and therfore their UI component needs to get more flexiable.
Dieser Blog Post beschreibt wie sich die Anforderungen an eine UI Komponente, im laufe eines typischen Projektes, vergrössert. Wir zeigen auf, welche Probleme dies mit sich bringt und wie diese mit dem Compound Component Pattern lösen können.

## Das Problem am Beispiel eines Dialoges

Wir haben eine React applikation, mit welchem man Dateien verwalten kann. Ein Features ist es, Dateien zu löschen eine anderes eine Datei zu duplizieren. Bei beiden Aktionen soll die Aktion mit einenm Dialog bestätigt werden. Da das Löschen eine Destructive Aktion ist, wollen wir den Löschen Button im Dialog zusätzlich rot einfärben.
In einem solchen Fall, wollen wir eine Dialog Komponente implementieren, welche wir für beide Fälle verwenden können.
Wir benötigen also verschiedenen Parameter um den Dialog entsprechend zu konfigurieren. Folgender Code zeigt wie der aufruf einer solchen Komponente aussehen könnte:

```typescript
<Dialog
  title="Delete File"
  content="Do you really want to delete this file? You cannot undo this action."
  labelActionButton="Delete"
  isDestructiveAction
/>
```

Der Dialog sieht nun wie folgt aus:
![Delete Dialog](https://github.com/gabduss/customizable-modal/blob/main/public/DeleteDialog.png)

Die nächste Anfordung ist es, dass im Dialog für das umbnennen gewünscht ist, bei welchem man im Dialog einen neuen File Namen eingeben kann. Der Inhalt des Dialoges besteht neu also nicht nur noch aus einem Text, sondern beinhaltet eine Input Feld. Dies müssen wir dem Dialog übergeben können.
Die nächste Anforderung ist es die Dokumente in eine Bild zu Konvertieren. Der Bestätigungsdialog soll nun drei Buttons haben: "Cancel", "Zu PNG konvertieren", "Zu JPG konvertieren". Wir müssen jetzt also noch einen dritten Button einführen und konfigurierbar machen.
Wir sind erst am Anfang userer Applikation und die Anzahl der Paramter fängt schon an aus dem Ufer zu laufen. Es kommen noch viele Anforderungen auf uns zu, abseits des File Managements, welche wieder andere Anfordung an den Dialog haben.

Wenn wir keine riesige, unübersichtliche Dialog Komponente wollen, welcher voller Konfigurationsparamter ist, müssen wir einen anderen Ansatz wählen. Ein Ansatz der immer wieder gewählt wird, ist es verschieden Subtypen von Dialogen zu implementieren. Statt einen Dialog hat man einen ConfirmDialog, dieser wird nur dann genutzt, wenn eine Aktion bestätigt werden muss und benötigt entsprechend wenig Konfigurationsparameter. Ein andere Dialog heisst vielleicht CalculateTaxDialog, mit diesem Dialog werden wieder andere Anforderungen abgedekt.
Verschieden Dialoge zu haben, birgt aber die Gefahr, dass sie ausseinander laufen und eine anderes Look and Feel bekommen. Nicht selten gibt es dann so viele Dialoge, dass eizelne Entwickler nicht alle kennnen und beginnen neuen Dialoge einzuführen, obwohl es schon einen Dialog für eine ähnliche Anfordung gibt.

Hier kommt uns das Compound Component pattern zu Hilfe.

## The compound component pattern

The compound component pattern is a component compsition pattern. Das Ziel ist es statt eine grosse Komponente, viele kleine Komponente zu haben, welche alle viel weniger Konfigurationsparameter benötigen.
Um eine Compound Component zu implementieren braucht es immer vier Schritte:

1. Create a Context
2. Create a parent component
3. Create child components
4. Add child components as properties to the parent components

Alle child components können beliebg kombiniert werden und haben einen gemeinsamen Kontext.
Der gemeinsame Kontext macht das Pattern so Powerful. Nicht viele React Entwickler kennen und nutzen das Pattern. In Komponenten libraries wird das pattern aber oft angewant, da die Komponenten von verschiedenen Nutzern anderst gebraucht werden und entsprechend hohe flexibilität benötigen. Ein bekanntes Beispiel ist die Headless UI library von tailwind labs.
Im folgenden Kapitel implementieren wir einen Dialog mit dem Compound component Pattern. Das Beispiel wir zeigen, wie die Subkomponent implementiert werden und wie der gemeinsame Kontext erstellt wird.

## Implementing a Dialog with the compound component pattern

Let's first see how a Dialog looks like, what's common with all of them and what has to be customizable.

![Delete Dialog](https://github.com/gabduss/customizable-modal/blob/main/public/DialogParts.png)

- Title: The title has always the same font style but the text has to be customizalbe
- Close Button: The close button has to be identical
- Content: the content can be completely different
- Footer: The footer has always the same style, but the buttons have to be customizable. Not only the the text has to be customizalbe but also the style, the triggered action and the number of buttons.
- Background: A click on the background should always close the dialog

Bevor wir Anfgaen wollen wir noch zwei Grundsätze festlegen:

- Der Style der Komponente soll für alle Dialoge der gleiche sein. Der Nutzer der Komponente solle sich nicht darum kümmern müssen.
- Das schliessen des Dialoges über den Klick auf den Hintergrund, den Close Button oder die Action Buttons ist ein Concern des Dialoges. Der Anweder des Dialoges soll sich weder um die Logik für das öffnen noch um die des Schliessens kümmern müssen.

Now, let's start with the implementation:

1. We implement the context of the Dialog. All chidren components will have access to the defined properties. In our example we need to know if the dialog is open or closed and we need the actions to close or open an dialog.

```typescript
// Dialog.tsx

// 1. Create a context
type DialogContextProps = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const DialogContext = createContext<DialogContextProps>({
  open: () => {},
  close: () => {},
  isOpen: false,
});
```

2. We implement a parent component. All following components will be children of this parent component. It creates the Context provider and ensures that all children can have access to the same context data.

```typescript
// Dialog.tsx

// 2. Create a parent component
tconst Dialog = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);

  return (
    <DialogContext.Provider value={{ isOpen, close, open }}>
      {children}
    </DialogContext.Provider>
  );
};
```

3. Create child components. In our case, we have to levels of child components. The first level includes the component that opens the dialog (mostly a button) and the dialog itself. The second level are all children of the dialog, like the content or the footer.

Our first child component is the Open component. We add the open action to the child of that component, so the caller only needs to define a UI element that should open the dialog, the open action itself will be triggerd by the Open component.

```typescript
// Dialog.tsx

const Open = ({ children }: { children: ReactElement }) => {
  const { open } = useContext(DialogContext);

  return cloneElement(children, { onClick: () => open() });
};
```

The Window component describes the dialog itself and implents the parts of the dialog that are not customizable, like to close button on the upper right corner. The component can receive children like the footer or the content.

```typescript
// Dialog.tsx
// The design is simplyfied for better readability. The complete code can be found under:
// https://github.com/gabduss/customizable-modal

const Window = ({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) => {
  const { isOpen, close } = useContext(DialogContext);
  const ref = useOutsideClick(close);

  if (!isOpen) {
    return;
  }

  return createPortal(
    <div id="overlay" className="fixed top-0 left-0 w-full h-full z-1000">
      <div id="dialog" className="top-1/2 left-1/2 rounded-md" ref={ref}>
        {title && (
          <h2 className="fixed left-8 top-4 text-xl font-semibold text-gray-900">
            {title}
          </h2>
        )}
        <button
          type="button"
          onClick={close}
          className="text-gray-400 rounded-md text-sm w-8 h-8 ms-auto top-2 right-2 fixed"
        >
          // Close button SVG
        </button>
        <div className="mt-6 mb-16 text-gray-500">{children}</div>
      </div>
    </div>,
    document.body
  );
};
```

The next component we need is the Footer component. This component ensures that all Footers look the same and that they elements within are aligned correctly.

```typescript
// Dialog.tsx

const Footer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0  flex p-4 border-t border-gray-200 rounded-b gap-2 place-content-end">
      {children}
    </div>
  );
};
```

The CancelButton component is a predefined Button that already includes the label (that can be overwritten) the logic for closing the dialog.

```typescript
// Dialog.tsx

const CancelButton = ({ label = "Cancel" }: { label?: string }) => {
  const { close } = useContext(DialogContext);

  return (
    <Button variant="secondary" onClick={close}>
      {label}
    </Button>
  );
};
```

The ActionButton is a Button that can be used to execute an action. After the action is executed, the Dialog will close automatically.

```typescript
// Dialog.tsx

const ActionButton = ({
  label,
  onClick = () => {},
}: {
  label: string;
  onClick: () => void;
}) => {
  const { close } = useContext(DialogContext);

  return (
    <Button
      variant="primary"
      onClick={() => {
        onClick();
        close();
      }}
    >
      {label}
    </Button>
  );
};
```

4. After we defined all the child components, we have to assign them to the parent component.

```typescript
// Dialog.tsx

// 4. Add child components as properties to the parent components
Dialog.Open = Open;
Dialog.Window = Window;
Dialog.Footer = Footer;
Dialog.CloseAction = CloseAction;
Dialog.CancelButton = CancelButton;
```

We defined our dialog and can start using it. The following example shows a example of the usage. It include an button to open the dialog as well as the content of the dialog.

```typescript
// App.tsx

<Dialog>
  <Dialog.Open>
    <Button>Open Dialog</Button>
  </Dialog.Open>
  <Dialog.Window title="Delete File">
    Do you really want to delete this file? You cannot undo this action.
    <Dialog.Footer>
      <Dialog.CancelButton />
      <Dialog.ActionButton
        label="Delete"
        onClick={() => delete()}
      />
    </Dialog.Footer>
  </Dialog.Window>
</Dialog>
```

As you can see you are very flexable with the configuration of the dialog. You don't need to close or open the dialog yourself, it is handled for you. It is easy to and new buttons with different actions or to add you owen components to the dialog. In the following github repoository, you will find a example with a input field, where the input will be used after the click of an action button: https://github.com/gabduss/customizable-modal

## Conclusion

Wenn du eine React Komponente implementierst, welche viel flexibilität benötige, überlege dir das component component pattern zu verwenden. Speziell nützlich wird das Pattern, wenn du eine Komponenten library implementierts, welche in verschiedenen Projekten eingesetzt wird. Die Chancen sind sehr gross das die verschiedenen Projekte die Komponente ein wenig anders verwenden wollen. In diesen Fällen, hilf dir das compound component pattern die nötige flexibilität zu geben.
