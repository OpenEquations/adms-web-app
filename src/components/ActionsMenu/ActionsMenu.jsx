import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal } from "lucide-react";

function ActionsMenu({ label, children }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(null);
  const buttonRef = useRef(null);

  const updatePosition = () => {
    if (!buttonRef.current) {
      return;
    }
    const rect = buttonRef.current.getBoundingClientRect();
    setPosition({ top: rect.bottom + 4, left: rect.right });
  };

  const toggleOpen = () => {
    if (!open) {
      updatePosition();
    }
    setOpen((value) => !value);
  };

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    // The trigger lives inside a horizontally-scrollable table; reposition
    // (rather than just close) so the menu tracks the button while scrolling.
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="dropdown">
      <button
        type="button"
        ref={buttonRef}
        className="icon-action-button"
        aria-label={label}
        onClick={toggleOpen}
      >
        <MoreHorizontal />
      </button>

      {open && position && createPortal(
        <>
          <button
            type="button"
            className="dropdown-backdrop"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setOpen(false)}
          />

          <div
            className="dropdown-menu dropdown-menu-portal"
            style={{ top: position.top, left: position.left }}
            onClick={() => setOpen(false)}
          >
            {children}
          </div>
        </>,
        document.body,
      )}
    </div>
  );
}

export default ActionsMenu;
