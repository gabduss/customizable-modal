import { RefObject, useEffect, useRef } from "react";

// capuring vs bubbling, this is very important:
// otherwiese if you click the openModal button, it will be closed
// immediately because the event bubbles up and closes the modal
export function useOutsideClick(
  handler: () => void,
  listenCapturing = true
): RefObject<HTMLDivElement> {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // this checks if the outside was click
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler();
      }
    };

    document.addEventListener("click", handleClick, listenCapturing);

    return () =>
      document.removeEventListener("click", handleClick, listenCapturing);
  }, [handler, listenCapturing]);

  return ref;
}
