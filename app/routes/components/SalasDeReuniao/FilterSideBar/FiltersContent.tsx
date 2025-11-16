import { Box, Typography, TextField, Checkbox, FormControlLabel } from "@mui/material";
import { useEffect, useState } from "react";
import type { SalasFilter } from "~/routes/salas-de-reuniao";
import { FiltroLocalidadeService } from "~/services/filtroLocalidadeService";

interface Props {
  filters:  SalasFilter;
  onChange: (changes: any) => void;
}

export default function FiltersContent({ filters, onChange }: Props) {

  const [localidades, setLocalidades] = useState<{ estado: string; municipios: string[] }[]>([]);

  useEffect(() => {
    // Buscar estados e municípios
    FiltroLocalidadeService.obterLocalidades(1, 100).then((data) => {
      setLocalidades(data.items);

      // Se não houver estado selecionado, seleciona o primeiro
      if (!filters.estado?.length && data.items.length > 0) {
        onChange({
          estado: [data.items[0].estado],
          municipio: [...data.items[0].municipios],
        });
      }
    });
  }, []);

  const municipiosDoEstadoSelecionado =
    localidades.find((l) => l.estado === filters.estado?.[0])?.municipios || [];
  return (
    <Box sx={{ p: 2, width: 250 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Filtros
      </Typography>

      <Typography variant="subtitle2">Data</Typography>
      <TextField
        fullWidth
        size="small"
        sx={{ my: 1 }}
        type="date"
        value={filters?.data || ""}
        onChange={(e) => onChange({ data: e.target.value })}
      />

<div className="flex">

<div>

      <Typography variant="subtitle2">Início</Typography>
    <TextField
      fullWidth
      size="small"
      type="time"
      sx={{ my: 1 }}
      value={filters?.horaInicio || ""}
      onChange={(e) => onChange({ horaInicio: e.target.value })}
      inputProps={{
        step: 60, // permite apenas minutos exatos (sem segundos)
      }}
      />
      </div>
<div style={{ marginLeft: '14px' }}>

     {filters?.horaInicio && (
       <>
    <Typography variant="subtitle2">Duração (h)</Typography>
    <TextField
      fullWidth
      size="small"
      sx={{ my: 1 }}
      placeholder="1 hora"
      value={filters?.duracao || ""}
      onChange={(e) => onChange({ duracao: e.target.value })}
      />
  </>
)}
      </div>
</div>

      <Typography variant="subtitle2">Capacidade</Typography>
      <TextField
        fullWidth
        size="small"
        type="number"
        sx={{ my: 1 }}
        value={filters?.capacidade || ""}
        onChange={(e) => onChange({ capacidade: Number(e.target.value) })}
      />
<Typography variant="subtitle2" sx={{ mt: 2 }}>
  Estado
</Typography>
{localidades.map((l) => (
  <FormControlLabel
    className="w-full"
    key={l.estado}
    control={
      <Checkbox
        checked={filters.estado?.includes(l.estado) || false}
        onChange={(e) => {
          const estados = new Set(filters.estado || []);
          if (e.target.checked) {
            estados.add(l.estado);
            // Ao adicionar um estado, adiciona os municípios dele sem remover os já selecionados
            const municipios = new Set(filters.municipio || []);
            l.municipios.forEach((m) => municipios.add(m));
            onChange({
              estado: Array.from(estados),
              municipio: Array.from(municipios),
            });
          } else {
            estados.delete(l.estado);
            // Remove os municípios desse estado da seleção
            const municipios = new Set(filters.municipio || []);
            l.municipios.forEach((m) => municipios.delete(m));
            onChange({
              estado: Array.from(estados),
              municipio: Array.from(municipios),
            });
          }
        }}
      />
    }
    label={l.estado}
  />
))}

<Typography variant="subtitle2" sx={{ mt: 2 }}>
  Cidade
</Typography>
{localidades
  .filter((l) => filters.estado?.includes(l.estado))
  .flatMap((l) => l.municipios)
  .map((cidade) => (
    <FormControlLabel
      className="w-full"
      key={cidade}
      control={
        <Checkbox
          checked={filters.municipio?.includes(cidade) || false}
          onChange={(e) => {
            const municipios = new Set(filters.municipio || []);
            e.target.checked ? municipios.add(cidade) : municipios.delete(cidade);
            onChange({ municipio: Array.from(municipios) });
          }}
        />
      }
      label={cidade}
    />
  ))}
    </Box>
  );
}
