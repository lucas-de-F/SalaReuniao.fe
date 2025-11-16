import { useState } from "react";
import { Box, Typography, Paper, IconButton } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import weekday from "dayjs/plugin/weekday";
import advancedFormat from "dayjs/plugin/advancedFormat";
import "dayjs/locale/pt-br";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

dayjs.extend(isoWeek);
dayjs.extend(weekday);
dayjs.extend(advancedFormat);
dayjs.locale("pt-br");

type Disponibilidade = { diaSemana: string; inicio: string; fim: string };
type ReuniaoAgendada = { inicio: string; fim: string; data: string };
type Sala = { disponibilidades: Disponibilidade[]; reunioesAgendadas: ReuniaoAgendada[] };

const diasSemana = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function CalendarioSala({ sala, onSelectDia }: { sala: Sala, onSelectDia?: (dia: Dayjs) => void }) {
    
  const [mesAtual, setMesAtual] = useState<Dayjs>(dayjs());
  const [diaSelecionado, setDiaSelecionado] = useState<Dayjs | null>(null);
  const hoje = dayjs();

  const handleDiaClick = (d: Dayjs) => {
    setDiaSelecionado(d);
    if (onSelectDia) onSelectDia(d); // dispara callback para o pai
  };

  const isDiaDisponivel = (dia: Dayjs) => {
    const diaSemana = diasSemana[dia.day()];
    return sala?.disponibilidades.some(d => d.diaSemana === diaSemana);
  };

  // Gerar dias do mês incluindo preenchimento de semanas
  const gerarDiasDoMes = () => {
    const inicio = mesAtual.startOf("month");
    const fim = mesAtual.endOf("month");
    const dias: Dayjs[] = [];
    const diaSemanaInicio = inicio.day();

    for (let i = diaSemanaInicio - 1; i >= 0; i--) dias.push(inicio.subtract(i + 1, "day"));
    for (let d = inicio; d.isBefore(fim) || d.isSame(fim, "day"); d = d.add(1, "day")) dias.push(d);
    const diasParaCompletarSemana = 7 - (dias.length % 7);
    if (diasParaCompletarSemana < 7) for (let i = 0; i < diasParaCompletarSemana; i++) dias.push(fim.add(i + 1, "day"));
    return dias;
  };
  const diasDoMes = gerarDiasDoMes();

  // Horários do dia selecionado
  const horariosDoDia = () => {
    if (!diaSelecionado) return null;
    const diaStr = diasSemana[diaSelecionado.day()];
    const disp = sala?.disponibilidades.find(d => d.diaSemana === diaStr);
    if (!disp) return null;

    const inicio = dayjs(`${diaSelecionado.format("YYYY-MM-DD")}T${disp.inicio}`);
    const fim = dayjs(`${diaSelecionado.format("YYYY-MM-DD")}T${disp.fim}`);

    const reunioes = sala?.reunioesAgendadas
      .filter(r => r.data === diaSelecionado.format("YYYY-MM-DD"))
      .map(r => ({
        inicio: dayjs(`${r.data}T${r.inicio}`),
        fim: dayjs(`${r.data}T${r.fim}`)
      }));
    return { inicio, fim, reunioes };
  };
  const horarios = horariosDoDia();

  return (
    <Box p={4}>
      {/* Cabeçalho do mês */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <IconButton onClick={() => setMesAtual(mesAtual.subtract(1, "month"))}><ArrowBackIosNewIcon /></IconButton>
        <Typography variant="h5">{mesAtual.format("MMMM YYYY")}</Typography>
        <IconButton onClick={() => setMesAtual(mesAtual.add(1, "month"))}><ArrowForwardIosIcon /></IconButton>
      </Box>

      {/* Dias do mês */}
      <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1} mb={4}>
        {diasSemana.map(d => <Typography key={d} align="center" fontWeight="bold">{d.slice(0,3)}</Typography>)}
        {diasDoMes.map(d => {
          const disponivel = isDiaDisponivel(d);
          const selecionado = diaSelecionado?.isSame(d, "day");
          const bloqueado = d.isBefore(hoje, "day");
          return (
            <Box
              key={d.toString()}
              onClick={() => !bloqueado && disponivel && handleDiaClick(d)}
              sx={{
                width: 32,
                height: 32,
                mx: "auto",
                borderRadius: "50%",
                backgroundColor: selecionado ? "blue" : bloqueado ? "lightgray" : disponivel ? "green" : "gray",
                cursor: !bloqueado && disponivel ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                opacity: bloqueado ? 0.5 : 1
              }}
            >
              {d.date()}
            </Box>
          );
        })}
      </Box>

      {/* Barra de horários horizontal */}
      {horarios && (
        <div >
          <Typography variant="subtitle1" mb={1}>
            Horário do dia: {horarios.inicio.format("HH:mm")} - {horarios.fim.format("HH:mm")}
          </Typography>
          <Box position="relative" width="100%" height={60} bgcolor="#eee" borderRadius={2} display="flex">
            {/* Marcação a cada hora */}
            {Array.from({ length: horarios.fim.diff(horarios.inicio, "hour") + 1 }).map((_, i) => {
              const hora = horarios.inicio.add(i, "hour");
              const leftPercent = (hora.diff(horarios.inicio, "minute") / horarios.fim.diff(horarios.inicio, "minute")) * 100;
              return (
                <Box key={i} position="absolute" left={`${leftPercent}%`} height="100%" borderLeft="1px solid #ccc">
                  <Typography variant="caption" sx={{ position: "absolute", top: "100%", mt: 0.5, ml: -1 }}>{hora.format("HH:mm")}</Typography>
                </Box>
              );
            })}

            {/* Barras de reuniões */}
            {horarios.reunioes.map((r, i) => {
              const totalMin = horarios.fim.diff(horarios.inicio, "minute");
              const inicioMin = r.inicio.diff(horarios.inicio, "minute");
              const duracaoMin = r.fim.diff(r.inicio, "minute");
              const leftPercent = (inicioMin / totalMin) * 100;
              const widthPercent = (duracaoMin / totalMin) * 100;

              return (
                <Box
                  key={i}
                  position="absolute"
                  top={0}
                  left={`${leftPercent}%`}
                  width={`${widthPercent}%`}
                  height="100%"
                  bgcolor="#1976d2"
                />
              );
            })}
          </Box>
          <div  className="mt-8">

        <Box gap={4} display="flex"mt={2}>
        <Box display="flex" alignItems="center" gap={1}>
            <Box width={16} height={16} bgcolor="#1976d2" borderRadius={2} />
            <Typography variant="body2">Ocupado</Typography>
        </Box>

        {/* Quadrado livre */}
        <Box display="flex" alignItems="center" gap={1}>
            <Box width={16} height={16} bgcolor="#fff" border="1px solid #ccc" borderRadius={2} />
            <Typography variant="body2">Livre</Typography>
        </Box>
        </Box>
          </div>
        </div>
      )}
      {!horarios && diaSelecionado && <Typography>Não há disponibilidade neste dia.</Typography>}
    </Box>
  );
}
