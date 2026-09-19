import { useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";

function ActionsMenu({ label, children }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <div className="dropdown">
      <button
        type="button"
        className="icon-action-button"
        aria-label={label}
        onClick={() => setOpen((value) => !value)}
      >
        <MoreHorizontal />
      </button>

      {open && (
        <>
          <button
            type="button"
            className="dropdown-backdrop"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setOpen(false)}
          />

          <div
            className="dropdown-menu"
            onClick={() => setOpen(false)}
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
}

export default ActionsMenu;
