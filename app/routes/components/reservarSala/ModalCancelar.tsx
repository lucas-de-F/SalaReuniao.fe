import { useState } from "react";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";

interface ModalCancelarProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  reservaTitulo?: string;
}

export default function ModalCancelar({ open, onClose, onConfirm, reservaTitulo }: ModalCancelarProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent className="rounded-2xl p-6 max-w-sm">
        <DialogTitle className="text-xl font-semibold">Cancelar reserva</DialogTitle>
        <p className="text-sm text-gray-600 mt-2">
          Tem certeza que deseja cancelar a reserva
          {reservaTitulo ? (
            <>
              {" "}
              <strong>{reservaTitulo}</strong>?
            </>
          ) : (
            "?"
          )}
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outlined" onClick={onClose} disabled={loading}>
            Voltar
          </Button>

          <Button
            variant="contained"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Cancelando..." : "Confirmar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
