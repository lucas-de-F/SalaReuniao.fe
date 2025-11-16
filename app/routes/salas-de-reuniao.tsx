import { Box } from "@mui/material";
import { useEffect, useState } from "react";

import FiltersDrawer from "./components/SalasDeReuniao/FilterSideBar/FiltersDrawer";
import FiltersSidebar from "./components/SalasDeReuniao/FilterSideBar/FiltersSidebar";
import FiltersToggleButton from "./components/SalasDeReuniao/FilterSideBar/FiltersToggleButton";

import PaginationControl from "./components/SalasDeReuniao/PaginationControl";

import { salasService, type Sala } from "~/services/salasService";
import SalasCards from "./components/SalasDeReuniao/SalasList";
import { useNavigate } from "react-router";

export interface SalasFilter {
  data?: string;
  horaInicio?: string;
  duracao?: string;
  capacidade?: number;
  estado?: string[];
  municipio?: string[];
}
export default function SalasDeReuniao() {
  const navigate = useNavigate();
  const [openFilters, setOpenFilters] = useState(false);
  const [filters, setFilters] = useState<SalasFilter>({});
  const [salas, setSalas] = useState<Sala[]>([]);
  const [pageInfo, setPageInfo] = useState({
    totalItems: 0,
    pageSize: 10,
    totalPages: 0,
    page: 1,
  });

  const totalPages = Math.ceil(pageInfo.totalItems / pageInfo.pageSize);
  useEffect(() => {
    console.log("Filters changed:", filters);
    salasService.getSalas(pageInfo.page, pageInfo.pageSize, filters as any).then((resp) => {
      setSalas(resp.items);
      setPageInfo({
        totalItems: resp.totalItems,
        pageSize: resp.pageSize,
        totalPages: Math.ceil(resp.totalItems / resp.pageSize),
        page: resp.page,
      }); // Atualiza pageSize se necessário
    });
  }, [pageInfo.page , filters]);

    // 🔥 função que atualizará filtros vindos do componente filho
  const updateFilters = (newValues: Partial<SalasFilter>) => {
    setFilters((prev) => ({ ...prev, ...newValues }));
    setPageInfo((prev) => ({ ...prev, page: 1 })); // resetar paginação
  };

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <FiltersSidebar filters={filters} onChange={updateFilters} />
      <FiltersDrawer filters={filters} onChange={updateFilters} open={openFilters} onClose={() => setOpenFilters(false)} />
      <FiltersToggleButton
        onClick={() => setOpenFilters(true)}
        show={!openFilters}
      />

      <Box sx={{ flex: 1, p: 3 }}>
        <PaginationControl
          page={pageInfo.page}
          totalPages={totalPages}
          totalItems={pageInfo.totalItems}
          onChange={(newPage) =>
            setPageInfo((prev) => ({ ...prev, page: newPage }))
          }
        />

        <SalasCards salas={salas} tipo="disponibilidade" onVerDisponibilidade={(sala) => {
          navigate(`/reservar-sala/${sala.id}`);
        }} />
      </Box>
    </Box>
  );
}
