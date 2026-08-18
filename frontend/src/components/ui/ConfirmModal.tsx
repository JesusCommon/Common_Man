import type { ReactNode } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";

interface ConfirmModalProps {
  title: string;
  children: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  title,
  children,
  confirmLabel,
  cancelLabel = "Cancelar",
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal onClose={onCancel}>
      <div className="px-6 py-5 border-b border-slate-800">
        <h2 className="text-lg font-bold text-white">{title}</h2>
      </div>

      <div className="px-6 py-5 space-y-3">{children}</div>

      <div className="px-6 py-4 border-t border-slate-800 flex justify-end gap-3">
        <Button variant="ghost" onClick={onCancel} disabled={isPending}>
          {cancelLabel}
        </Button>
        <Button variant="primary" onClick={onConfirm} disabled={isPending}>
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-slate-400/30 border-t-slate-900 rounded-full animate-spin" />
              Procesando...
            </span>
          ) : (
            confirmLabel
          )}
        </Button>
      </div>
    </Modal>
  );
}