"use client";
import React, { useEffect, useCallback } from "react";
import Button from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = "sm" }) => {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div className="ui-modal-overlay" onClick={onClose}>
      <div
        className={`ui-modal ui-modal--${size}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {title && (
          <div className="ui-modal__header">
            <h3>{title}</h3>
            <button className="ui-modal__close" onClick={onClose} aria-label="Close">
              <i className="fi fi-rr-cross-small" />
            </button>
          </div>
        )}
        <div className="ui-modal__body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

// Convenient confirm-delete modal
interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  itemName?: string;
  message?: string;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  itemName = "this item",
  message,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="delete-modal">
        <div className="d-flex flex-column align-items-center text-center gap-3 py-2">
          <div className="warning-icon">
            <i className="fi fi-rr-trash" />
          </div>
          <div>
            <h4 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#0f172a" }}>
              Delete {itemName}?
            </h4>
            <p style={{ margin: 0, fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>
              {message || `Are you sure you want to delete "${itemName}"? This action cannot be undone.`}
            </p>
          </div>
          <div className="d-flex gap-3 mt-2 w-100">
            <Button variant="outline" fullWidth onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button variant="danger" fullWidth onClick={onConfirm} loading={loading}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
