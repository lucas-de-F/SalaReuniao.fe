import { useEffect, useState } from "react";
import { Box, TextField, Button, Typography, Grid, Paper, Snackbar } from "@mui/material";
import CalendarioSala from "./components/reservarSala/CalendarioSala";
import { useParams } from "react-router";
import { salasService } from "~/services/salasService";
import { toast } from "react-toastify";
import type { Dayjs } from "dayjs";

export default function ReservarSala() {
    const { id } = useParams();

  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");
const [diaSelecionado, setDiaSelecionado] = useState<Dayjs | null>(null);

  const [sala, setSala] = useState<any>(null);
  // pegar id do parametro da rota
  const handleReservar = async () => {
    if (!diaSelecionado) {
      toast.error("Selecione uma data antes de reservar!");
      return;
    }
    if (!horaInicio || !horaFim) {
      toast.error("Selecione o horário de início e fim!");
      return;
    }

    if (Number(horaInicio.split(":")[0]) >= Number(horaFim.split(":")[0])) {
      toast.error("O horário de início deve ser antes do horário de fim!");
      return;
    }
    
try {
  await salasService.realizarReserva(
    id as string, 
    diaSelecionado!.format("YYYY-MM-DD"), 
    horaInicio, 
    horaFim
  );
  toast.success("Reserva realizada com sucesso!");
  obterSalaDetalhada(id as string);
} catch (error: any) {
  // Se for axios
  const msg =
    error.response?.data?.message || "Erro ao realizar a reserva.";
  toast.error(msg);
  console.error(error);
}
  };
  
  const obterSalaDetalhada = (id: string) => {
    salasService.getSalaById(id as string).then((data) => {
      setSala(data);
    });  
  }

  useEffect(() => {
    console.log("ID da sala para reserva:", id);
    obterSalaDetalhada(id as string);
  }, []);
  return (
    <Box display="flex" height="100%">
      {/* Lado esquerdo - 2/3 */}
      <Box flex={2} p={4} >
        <CalendarioSala sala={sala} onSelectDia={setDiaSelecionado} />
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
