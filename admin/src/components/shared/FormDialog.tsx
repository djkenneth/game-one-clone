import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FormDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function FormDialog({ open, title, onClose, children, footer }: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-2">
          <div className="space-y-4 py-2">{children}</div>
        </ScrollArea>
        {footer && <div className="flex justify-end gap-2 border-t pt-4">{footer}</div>}
      </DialogContent>
    </Dialog>
  );
}
