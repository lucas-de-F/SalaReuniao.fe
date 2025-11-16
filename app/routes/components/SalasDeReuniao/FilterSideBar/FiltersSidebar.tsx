// components/FiltersSidebar/FiltersSidebar.tsx
import { Box } from "@mui/material";
import FiltersContent from "./FiltersContent";

export default function FiltersSidebar({ filters, onChange }: any) {
  return (
    <Box
      sx={{
        width: 250,
        borderRight: "1px solid #ddd",
        display: { xs: "none", md: "block" },
        position: "block",
        top: 0,
      }}
    >
      <FiltersContent filters={filters} onChange={onChange} />
    </Box>
  );
}
