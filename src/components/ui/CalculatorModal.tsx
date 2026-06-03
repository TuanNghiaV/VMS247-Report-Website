import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface CalculatorModalProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const CalculatorModal: React.FC<CalculatorModalProps> = ({
  open,
  title,
  description,
  onClose,
  children,
}) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        onClose();
      }
    };

    document.body.dataset.modalOpen = "true";
    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      delete document.body.dataset.modalOpen;
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 p-4"
      role="dialog"
      aria-modal="true"
      data-section-nav-ignore="true"
      data-modal-open="true"
      onWheel={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="absolute inset-0 z-0 cursor-default"
        aria-label="ÄÃ³ng báº£ng tÃ­nh"
        onClick={onClose}
      />

      <div
        className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--hairline-strong)] bg-[var(--surface)] shadow-[var(--shadow-card)]"
        onClick={(e) => e.stopPropagation()}
        data-section-nav-ignore="true"
        onWheel={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-[var(--hairline)]">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[var(--ink)]">{title}</h3>
            {description && (
              <p className="text-xs text-[var(--mute)]">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[var(--mute)] hover:text-[var(--ink)] hover:bg-[var(--canvas-soft)] transition-colors cursor-pointer"
            aria-label="Đóng bảng tính"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div
          className="flex-1 overflow-y-auto p-6"
          data-section-nav-ignore="true"
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
