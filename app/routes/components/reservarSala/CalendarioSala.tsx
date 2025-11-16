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

type Disponibilidade = {
  diaSemana: string; // "Monday", "Tuesday", etc.
  inicio: string; // "12:00:00"
  fim: string; // "22:00:00"
};

type ReuniaoAgendada = {
  inicio: string; // "12:00:00"
  fim: string; // "15:00:00"
  data: string; // "2025-11-17"
};

type Sala = {
  disponibilidades: Disponibilidade[];
  reunioesAgendadas: ReuniaoAgendada[];
};

const diasSemana = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function CalendarioSala({ sala }: { sala: Sala }) {
  const [mesAtual, setMesAtual] = useState<Dayjs>(dayjs());
  const [diaSelecionado, setDiaSelecionado] = useState<Dayjs | null>(null);
const hoje = dayjs(); // data mínima liberada (hoje)

  const isDiaDisponivel = (dia: Dayjs) => {
    const diaSemana = diasSemana[dia.day()];
    return sala?.disponibilidades.some(d => d.diaSemana === diaSemana);
  };

  // Gerar todos os dias do mês
const gerarDiasDoMes = () => {
  const inicio = mesAtual.startOf("month");
  const fim = mesAtual.endOf("month");

  const dias: Dayjs[] = [];

  // Descobrir o índice do dia da semana do primeiro dia do mês (0 = Sunday)
  const diaSemanaInicio = inicio.day();

  // Dias do mês anterior para preencher o início
  for (let i = diaSemanaInicio - 1; i >= 0; i--) {
    dias.push(inicio.subtract(i + 1, "day"));
  }

  // Dias do mês atual
  for (let d = inicio; d.isBefore(fim) || d.isSame(fim, "day"); d = d.add(1, "day")) {
    dias.push(d);
  }

  // Preencher o restante da última semana com dias do próximo mês
  const diasParaCompletarSemana = 7 - (dias.length % 7);
  if (diasParaCompletarSemana < 7) {
    for (let i = 0; i < diasParaCompletarSemana; i++) {
      dias.push(fim.add(i + 1, "day"));
    }
  }

  return dias;
};
  const diasDoMes = gerarDiasDoMes();

  // Obter horários do dia selecionado
  const horariosDoDia = () => {
    if (!diaSelecionado) return null;
    const diaStr = diasSemana[diaSelecionado.day()];
    const disp = sala?.disponibilidades.find(d => d.diaSemana === diaStr);
    if (!disp) return null;
    const inicio = dayjs(disp.inicio, "HH:mm:ss");
    const fim = dayjs(disp.fim, "HH:mm:ss");
    const reunioes = sala?.reunioesAgendadas
      .filter(r => r.data === diaSelecionado.format("YYYY-MM-DD"))
      .map(r => ({
        inicio: dayjs(r.inicio, "HH:mm:ss"),
        fim: dayjs(r.fim, "HH:mm:ss")
      }));
    return { inicio, fim, reunioes };
  };

  const horarios = horariosDoDia();

  return (
    <Box p={4}>
      {/* Cabeçalho do mês */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <IconButton onClick={() => setMesAtual(mesAtual.subtract(1, "month"))}>
          <ArrowBackIosNewIcon />
        </IconButton>
        <Typography variant="h5">{mesAtual.format("MMMM YYYY")}</Typography>
        <IconButton onClick={() => setMesAtual(mesAtual.add(1, "month"))}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>

      {/* Dias do mês */}
      <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1} mb={4}>
        {diasSemana.map(d => (
          <Typography key={d} align="center" fontWeight="bold">
            {d.slice(0, 3)}
          </Typography>
        ))}
        {diasDoMes.map(d => {
  const disponivel = isDiaDisponivel(d);
  const selecionado = diaSelecionado?.isSame(d, "day");
  const bloqueado = d.isBefore(hoje, "day"); // dia anterior a hoje
  return (
    <Box
      key={d.toString()}
      onClick={() => !bloqueado && disponivel && setDiaSelecionado(d)}
      sx={{
        width: 32,
        height: 32,
        mx: "auto",
        borderRadius: "50%",
        backgroundColor: selecionado
          ? "blue"
          : bloqueado
          ? "lightgray" // bloqueado cinza
          : disponivel
          ? "green"
          : "gray",
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

      {/* Barra de horários do dia selecionado */}
      {horarios && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" mb={1}>
            Horário do dia: {horarios.inicio.format("HH:mm")} - {horarios.fim.format("HH:mm")}
          </Typography>
          <Box position="relative" height={40} bgcolor="#eee" borderRadius={2}>
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
                  bgcolor="blue"
                  borderRadius={1}
                />
              );
            })}
          </Box>
        </Paper>
      )}

      {!horarios && diaSelecionado && (
        <Typography>Não há disponibilidade neste dia.</Typography>
      )}
    </Box>
  );
}
