import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const ConfirmDialog = ({
  open,
  title,
  description,
  loading,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) => (
  <Dialog
    open={open}
    onClose={loading ? undefined : onCancel}
    maxWidth="xs"
    fullWidth
  >
    <DialogTitle>{title}</DialogTitle>
    <DialogContent dividers>
      <Typography>{description}</Typography>
    </DialogContent>
    <DialogActions className="p-4">
      <Button onClick={onCancel} disabled={loading}>
        Cancel
      </Button>
      <Button
        color="error"
        variant="contained"
        onClick={onConfirm}
        disabled={loading}
      >
        {loading ? "Deleting..." : "Delete"}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
