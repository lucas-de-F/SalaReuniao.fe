// components/SalasDeReuniao/SalasCards.tsx
import { Box, Card, CardContent, Typography } from "@mui/material";
import type { Sala } from "~/services/salasService";

interface SalasCardsProps {
  salas: Sala[];
}

export default function SalasCards({ salas }: SalasCardsProps) {
  if (!salas || salas.length === 0) {
    return (
      <Typography mt={4} textAlign="center">
        Nenhuma sala encontrada.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {salas.map((sala) => (
        <Card key={sala.id} sx={{ width: "100%" }}>
          <CardContent>
            <Typography variant="h6">{sala.nome}</Typography>
            <Typography variant="body2" color="text.secondary">
              {`${sala.endereco.municipio} / ${sala.endereco.estado}`}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, fontWeight: "bold" }}>
              R$ {sala.valorHora.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
