// components/SalasDeReuniao/SalasCards.tsx
import { Box, Card, CardContent, Typography, Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useState } from "react";
import type { Sala } from "~/services/salasService";

interface SalasCardsProps {
  salas: Sala[];
  tipo?: "disponibilidade" | "editar" | "remover"; // define tipo de botão
  onEditar?: (sala: Sala) => void;
  onRemover?: (sala: Sala) => void;
  onVerDisponibilidade?: (sala: Sala) => void;
}

export default function SalasCards({ salas, tipo = "disponibilidade", onEditar, onRemover, onVerDisponibilidade }: SalasCardsProps) {
  const [removerSala, setRemoverSala] = useState<Sala | null>(null);

  if (!salas || salas.length === 0) {
    return (
      <Typography mt={4} textAlign="center">
        Nenhuma sala encontrada.
      </Typography>
    );
  }

  const handleRemoverConfirm = () => {
    if (removerSala && onRemover) {
      onRemover(removerSala);
    }
    setRemoverSala(null);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {salas.map((sala) => (
        <Card key={sala.id} sx={{ width: "100%" }}>
          <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            
            {/* CONTEÚDO DO CARD */}
            <Box sx={{ flex: 1, pr: 2 }}>
              <Typography variant="h6">{sala.nome}</Typography>
              <Typography variant="body2" color="text.secondary">
                {`${sala.endereco.municipio} / ${sala.endereco.estado}`}
              </Typography>
                <Typography variant="body2" color="text.secondary">
                {`capacidade para ${sala.capacidade} pessoas`}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, fontWeight: "bold" }}>
                 R$ {sala.valorHora.toFixed(2)}
              </Typography>
            </Box>

            {/* BOTÕES */}
            <Box>
              {tipo === "disponibilidade" && (
                <Button variant="contained" onClick={() => onVerDisponibilidade?.(sala)}>
                  Ver Disponibilidade
                </Button>
              )}

              {tipo === "editar" && (
                <Stack direction="row" spacing={1}>
                  <Button variant="outlined" onClick={() => onEditar?.(sala)}>
                    Editar
                  </Button>
                  <Button variant="contained" color="error" onClick={() => setRemoverSala(sala)}>
                    Remover
                  </Button>
                </Stack>
              )}
            </Box>
          </CardContent>
        </Card>
      ))}

      {/* Modal de remoção */}
      <Dialog open={!!removerSala} onClose={() => setRemoverSala(null)}>
        <DialogTitle>Confirmar remoção</DialogTitle>
        <DialogContent>
          Tem certeza que deseja remover a sala "{removerSala?.nome}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoverSala(null)}>Cancelar</Button>
          <Button color="error" onClick={handleRemoverConfirm}>Remover</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
