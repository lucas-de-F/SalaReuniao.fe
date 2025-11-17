import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { salasService } from "~/services/salasService";
import type { Sala } from "./minhas-salas";
import { jwtService } from "~/services/jwtService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";


const diasSemana = [
  { label: "dom", value: "Sunday" },
  { label: "seg", value: "Monday" },
  { label: "ter", value: "Tuesday" },
  { label: "qua", value: "Wednesday" },
  { label: "qui", value: "Thursday" },
  { label: "sex", value: "Friday" },
  { label: "sab", value: "Saturday" },
];

export default function CreateSala() {
  const [form, setForm] = useState({
    nome: "",
    capacidade: "",
    valorHora: "",
    descricao: "",
    endereco: {
      cep: "",
      estado: "",
      cidade: "",
      numero: 0,
      complemento: "",
    },
    disponibilidades: [],
  });

  const [openModal, setOpenModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<any>(null);
  const [horario, setHorario] = useState({ inicio: "", fim: "" });
const [loading, setLoading] = useState(false);
const navigate = useNavigate();

  // abre modal de horário
  const handleOpenModal = (day: any) => {
    setSelectedDay(day);
    const existing = form.disponibilidades.find((d: any) => d.diaSemana === day.value);
    setHorario(existing ? { inicio: existing.inicio, fim: existing.fim } : { inicio: "", fim: "" });
    setOpenModal(true);
  };
  const userId = jwtService.getDecoded()?.userId;
const criarSala = async () => {
  try {
    setLoading(true);

    const novaSala: Sala = {
      idResponsavel: userId as string,
      nome: form.nome,
      capacidade: Number(form.capacidade),
      descricao: form.descricao,
      valorHora: Number(form.valorHora),
      endereco: {
        cep: form.endereco.cep,
        numero: form.endereco.numero,
        complemento: form.endereco.complemento,
      },
      disponibilidadeSemanal: {
        disponibilidades: form.disponibilidades,
      }
    };

    await salasService.criar(novaSala);

    toast.success("Sala criada com sucesso!");

    navigate("/minhas-salas"); // ajuste a rota conforme sua listagem
  } catch (error) {
    toast.error("Erro ao criar a sala.");
  } finally {
    setLoading(false);
  }
};
  // salva horário do dia
  const handleSaveHorario = () => {
    const filtrado = form.disponibilidades.filter(
      (d: any) => d.diaSemana !== selectedDay?.value
    );

    setForm({
      ...form,
      disponibilidades: [
        ...filtrado,
        {
          diaSemana: selectedDay?.value,
          inicio: horario.inicio,
          fim: horario.fim,
        },
      ],
    });
    setOpenModal(false);
  };
  // busca endereço pelo CEP
  const fetchEndereco = async (cep: string) => {
    if (!cep) {
      setForm({
        ...form,
        endereco: { ...form.endereco, estado: "", cidade: "", numero: 0, complemento: form.endereco.complemento },
      });
      return;
    }

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();

      if (data.erro) throw new Error("CEP não encontrado");

      setForm({
        ...form,
        endereco: {
          ...form.endereco,
          estado: data.uf || "",
          cidade: data.localidade || "",
          complemento: data.complemento || form.endereco.complemento,
          numero: form.endereco.numero,
        },
      });
    } catch (err) {
      console.error(err);
      setForm({
        ...form,
        endereco: { ...form.endereco, estado: "", cidade: "", numero: form.endereco.numero, complemento: form.endereco.complemento },
      });
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Criar Sala de Reunião
      </Typography>

      <div className="grid grid-cols-4 gap-4">
        {/* Nome */}
        <div className="col-span-2" >
          <TextField
            fullWidth
            label="Nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />
        </div>

        {/* Capacidade */}
        <div  >
          <TextField
            fullWidth
            label="Capacidade"
            type="number"
            value={form.capacidade}
            onChange={(e) => setForm({ ...form, capacidade: e.target.value })}
          />
        </div>

        {/* Valor hora */}
        <div  >
          <TextField
            fullWidth
            label="Valor Hora"
            type="number"
            value={form.valorHora}
            onChange={(e) => setForm({ ...form, valorHora: e.target.value })}
          />
        </div>

        {/* Descrição */}
        <div  className="col-span-full" >
          <TextField
            fullWidth
            label="Descrição"
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          />
        </div>

        {/* Endereço */}
        <div  >
          <TextField
            fullWidth
            label="CEP"
            value={form.endereco.cep}
            onChange={(e) => setForm({ ...form, endereco: { ...form.endereco, cep: e.target.value } })}
            onBlur={() => fetchEndereco(form.endereco.cep)}
          />
        </div>

        <div  >
          <TextField
            fullWidth
            label="Estado"
            value={form.endereco.estado}
            disabled
            required
          />
        </div>

        <div  >
          <TextField
            fullWidth
            label="Cidade"
            value={form.endereco.cidade}
            disabled
            required
          />
        </div>

        <div  >
          <TextField
            type="number"
            fullWidth
            label="Número"
            value={form.endereco.numero}
            onChange={(e) => setForm({ ...form, endereco: { ...form.endereco, numero: Number(e.target.value) } })}
          />
        </div>

        <div className="col-span-2" >
          <TextField
            fullWidth
            label="Complemento"
            value={form.endereco.complemento}
            onChange={(e) => setForm({ ...form, endereco: { ...form.endereco, complemento: e.target.value } })}
          />
        </div>
      </div>

      {/* Mini calendário */}
      <Box sx={{ mt: 4 }}>
        <Typography fontWeight="bold" sx={{ mb: 1 }}>
          Disponibilidade semanal
        </Typography>

        <Grid container spacing={2}>
          {diasSemana.map((d) => {
            const existing = form.disponibilidades.find((x: any) => x.diaSemana === d.value);
            return (
              <Grid item xs={12} sm={20} md={3} lg={20} key={d.value}>
                <Paper
                  onClick={() => handleOpenModal(d)}
                  sx={{
                    p: 2,
                    textAlign: "center",
                    cursor: "pointer",
                    borderRadius: 2,
                    border: "2px solid #ccc",
                    "&:hover": { borderColor: "#1976d2" },
                  }}
                >
                  <Typography variant="subtitle1">{d.label}</Typography>
                  {existing ? (
                    <Typography variant="caption">{existing.inicio} - {existing.fim}</Typography>
                  ) : (
                    <Typography variant="caption" color="text.secondary">definir</Typography>
                  )}
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      <Box textAlign="right" mt={4}>
      <Button
        variant="contained"
        onClick={criarSala}
        size="large"
        disabled={loading}
      >
        {loading ? "Criando..." : "Criar Sala"}
      </Button>
      </Box>

      {/* MODAL */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Definir horário — {selectedDay?.label}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Início"
            type="time"
            sx={{ mt: 2 }}
            InputLabelProps={{ shrink: true }}
            value={horario.inicio}
            onChange={(e) => setHorario({ ...horario, inicio: e.target.value })}
          />
          <TextField
            fullWidth
            label="Fim"
            type="time"
            sx={{ mt: 2 }}
            InputLabelProps={{ shrink: true }}
            value={horario.fim}
            onChange={(e) => setHorario({ ...horario, fim: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveHorario}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}