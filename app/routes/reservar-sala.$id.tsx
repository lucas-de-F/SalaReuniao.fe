import { useEffect, useState } from "react";
import { Box, TextField, Button, Typography, Grid, Paper } from "@mui/material";
import CalendarioSala from "./components/reservarSala/CalendarioSala";
import { useParams } from "react-router";
import { salasService } from "~/services/salasService";

export default function ReservarSala() {
    const { id } = useParams();

  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");

  const [sala, setSala] = useState<any>(null);
  // pegar id do parametro da rota
  const handleReservar = () => {
    alert(`Reserva feita: Início ${horaInicio}, Fim ${horaFim}`);
  };
  
  useEffect(() => {
    console.log("ID da sala para reserva:", id);
    salasService.getSalaById(id as string).then((data) => {
      setSala(data);
    });
  }, []);
  return (
    <Box display="flex" height="100%">
      {/* Lado esquerdo - 2/3 */}
      <Box flex={2} p={4} >
        <CalendarioSala sala={sala} />
      </Box>

      {/* Lado direito - 1/3 */}
      <Box flex={1} p={4} elevation={3}>
        <Typography variant="h5" mb={3}>
          Reservar Sala
        </Typography>

        <div className="flex justify-between gap-x-8">
          <div 
              className="w-full"
           >
            
            <TextField
              label="início"
              type="time"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              className="w-full"
            />
          </div>
          <div 
              className="w-full"
           >
            <TextField
              label="fim"
              type="time"
              value={horaFim}
              onChange={(e) => setHoraFim(e.target.value)}
              InputLabelProps={{ shrink: true }}
              className="w-full"
              fullWidth
            />
          </div>

        </div>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleReservar}
        >
          Reservar Horário
        </Button>
      </Box>
    </Box>
  );
}
