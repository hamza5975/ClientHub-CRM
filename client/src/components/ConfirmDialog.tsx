import { Modal, Button } from '@/components/ui';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      className="max-w-sm"
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            data-icod-id="src_components_confirmdialog_tsx_88ca">
            {cancelLabel}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            loading={loading}
            data-icod-id="src_components_confirmdialog_tsx_34f9">
            {confirmLabel}
          </Button>
        </>
      }
      data-icod-id="src_components_confirmdialog_tsx_55a5">
      <div
        className="flex flex-col items-center gap-3 text-center"
        data-icod-id="src_components_confirmdialog_tsx_78ab">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10"
          data-icod-id="src_components_confirmdialog_tsx_45c7">
          <AlertTriangle
            className="h-6 w-6 text-destructive"
            data-icod-id="src_components_confirmdialog_tsx_3bb9" />
        </div>
        <h3
          className="text-lg font-semibold text-foreground"
          data-icod-id="src_components_confirmdialog_tsx_7d75">{title}</h3>
        <p
          className="text-sm text-muted-foreground"
          data-icod-id="src_components_confirmdialog_tsx_2779">{message}</p>
      </div>
    </Modal>
  );
}
