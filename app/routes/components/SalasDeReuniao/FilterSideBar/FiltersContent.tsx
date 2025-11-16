import { Box, Typography, TextField, Checkbox, FormControlLabel } from "@mui/material";

interface Props {
  filters: any;
  onChange: (changes: any) => void;
}

export default function FiltersContent({ filters, onChange }: Props) {
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

      <Typography variant="subtitle2">Início / Duração</Typography>
      <TextField
        fullWidth
        size="small"
        sx={{ my: 1 }}
        placeholder="08:00"
        value={filters?.horaInicio || ""}
        onChange={(e) => onChange({ horaInicio: e.target.value })}
      />

      <Typography variant="subtitle2">Capacidade</Typography>
      <TextField
        fullWidth
        size="small"
        type="number"
        sx={{ my: 1 }}
        value={filters?.capacidade || ""}
        onChange={(e) => onChange({ capacidade: Number(e.target.value) })}
      />

      {/* Estados – exemplo simples */}
      <Typography variant="subtitle2" sx={{ mt: 2 }}>
        Estado
      </Typography>

      <FormControlLabel
        control={
          <Checkbox
            checked={filters?.estado?.includes("SP") || false}
            onChange={(e) => {
              const list = new Set(filters?.estado || []);
              e.target.checked ? list.add("SP") : list.delete("SP");
              onChange({ estado: Array.from(list) });
            }}
          />
        }
        label="SP"
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={filters?.estado?.includes("RJ") || false}
            onChange={(e) => {
              const list = new Set(filters?.estado || []);
              e.target.checked ? list.add("RJ") : list.delete("RJ");
              onChange({ estado: Array.from(list) });
            }}
          />
        }
        label="RJ"
      />
    </Box>
  );
}
