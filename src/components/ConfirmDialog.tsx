import BootstrapModal from "./BootstrapModal";

interface ConfirmDialogProps {
  show: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "warning" | "info";
}

export default function ConfirmDialog({
  show,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "danger",
}: ConfirmDialogProps) {
  const getButtonClass = () => {
    switch (variant) {
      case "danger":
        return "btn-danger";
      case "warning":
        return "btn-warning";
      default:
        return "btn-primary";
    }
  };

  return (
    <BootstrapModal show={show} onHide={onCancel} title={title}>
      <div>
        <p className="mb-3">{message}</p>
        <div className="d-flex gap-2 justify-content-end">
          <button className="btn btn-secondary" onClick={onCancel}>
            {cancelText}
          </button>
          <button className={`btn ${getButtonClass()}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </BootstrapModal>
  );
}
