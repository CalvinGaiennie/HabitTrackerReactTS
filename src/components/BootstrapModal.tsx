// components/BootstrapModal.tsx
export default function BootstrapModal({
  show,
  onHide,
  title,
  children,
  onSave,
}: {
  show: boolean;
  onHide: () => void;
  title: string;
  children: React.ReactNode;
  onSave?: () => void;
}) {
  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      tabIndex={-1}
      style={{ backgroundColor: show ? "rgba(0,0,0,0.5)" : undefined }}
      onClick={onHide}
    >
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title justify-content-center">{title}</h5>
            <button type="button" className="btn-close" onClick={onHide} />
          </div>
          <div className="modal-body">{children}</div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onHide}>
              Close
            </button>
            {onSave && (
              <button type="button" className="btn btn-primary" onClick={onSave}>
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}