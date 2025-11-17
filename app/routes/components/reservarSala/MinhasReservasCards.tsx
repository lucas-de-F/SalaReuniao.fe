// components/MinhasReservas/MinhasReservasCards.tsx
import { Box, Card, CardContent, Typography, Stack, Button } from "@mui/material";
import type { Sala } from "~/services/salasService";

export interface Reserva {
  id: string;
  idSalaReuniao: string;
  salaReuniao: Sala;
  inicio: string;   // "08:00:00"
  fim: string;      // "10:00:00"
  data: string;     // "2025-11-17"
  status: string;   // "Agendada"
}

interface MinhasReservasCardsProps {
  reservas: Reserva[];
  onCancelar?: (reserva: Reserva) => void;
}

export default function MinhasReservasCards({ reservas, onCancelar }: MinhasReservasCardsProps) {
    console.log("Reservas recebidas:", reservas);
  if (!reservas || reservas.length === 0) {
    return (
      <Typography mt={4} textAlign="center">
        Você ainda não possui reservas.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {reservas.map((r) => (
        <Card key={r.id} sx={{ width: "100%" }}>
          <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            
            {/* CONTEÚDO DO CARD */}
            <Box sx={{ flex: 1, pr: 2 }}>
            <Typography variant="h6">
              Reserva — {new Date(r.data).toLocaleDateString("pt-BR")}
            </Typography>

              <Typography variant="body2" color="text.secondary">
                Sala: {r.salaReuniao.nome}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Horário: {r.inicio} às {r.fim}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {r.salaReuniao.endereco.cep} — {r.salaReuniao.endereco.bairro}, {r.salaReuniao.endereco.municipio} / {r.salaReuniao.endereco.estado}
              </Typography>

              <Typography variant="body1" sx={{ mt: 1, fontWeight: "bold" }}>
                Status: {r.status}
              </Typography>
            </Box>

            <Stack>
              {onCancelar  && r.status === "Agendada" && (
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={() => onCancelar(r)}
                >
                  Cancelar
                </Button>
              )}
            </Stack>

          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
