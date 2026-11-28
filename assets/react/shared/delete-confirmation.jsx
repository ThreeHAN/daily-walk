import { useEffect, useRef } from "react";

export function DeleteConfirmation({ target, storageError, onCancel, onConfirm }) {
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    ref.current.showModal();
    return () => { if (previous?.isConnected) previous.focus(); };
  }, []);
  return (
    <dialog ref={ref} className="habit-delete-confirm" aria-labelledby="delete-confirm-title"
      onCancel={(event) => { event.preventDefault(); onCancel(); }}>
      <h2 id="delete-confirm-title">Are you sure?</h2>
      <p>{target.type === "group"
        ? `Delete ${target.name} and all habits in this group?`
        : `Delete ${target.name}?`}</p>
      {storageError && <p className="auth-error" role="alert">{storageError}</p>}
      <button type="button" className="ubtn sec" autoFocus onClick={onCancel}>
        {target.type === "group" ? "Keep group" : "Keep habit"}
      </button>
      <button type="button" className="ubtn" onClick={onConfirm}>Confirm delete</button>
    </dialog>
  );
}
