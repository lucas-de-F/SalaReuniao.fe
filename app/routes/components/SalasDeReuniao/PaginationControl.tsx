// components/SalasDeReuniao/PaginationControl.tsx
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function PaginationControl({ page, totalPages, onChange }: Props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
      <IconButton disabled={page === 1} onClick={() => onChange(page - 1)}>
        <ArrowBackIcon />
      </IconButton>

      <Typography>
        Página {page} de {totalPages}
      </Typography>

      <IconButton disabled={page === totalPages} onClick={() => onChange(page + 1)}>
        <ArrowForwardIcon />
      </IconButton>
    </Box>
  );
}
