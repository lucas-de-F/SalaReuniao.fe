import { useEffect, useState } from "react";
import type { Reserva } from "./components/reservarSala/MinhasReservasCards";
import MinhasReservasCards from "./components/reservarSala/MinhasReservasCards";
import { minhasReservasService } from "~/services/minhasReservasService";
import PaginationControl from "./components/SalasDeReuniao/PaginationControl";
import { toast } from "react-toastify";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export default function MinhasReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [statusFiltro, setStatusFiltro] = useState<string>("Agendada"); // "" = todos
  const [pageInfo, setPageInfo] = useState({
    totalItems: 0,
    pageSize: 0,
    totalPages: 0,
    page: 0,
  });

  async function carregarReservas(page = pageInfo.page, status = statusFiltro) {
    try {
      const response = await minhasReservasService.listar({
        page,
        status, // enviado para a API
      });

      setReservas(response.items);
      setPageInfo({
        totalItems: response.totalItems,
        pageSize: response.pageSize,
        totalPages: Math.ceil(response.totalItems / response.pageSize),
        page: response.page,
      });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar reservas.");
    }
  }

  // Carrega na primeira vez
  useEffect(() => {
    carregarReservas();
  }, []);

  // Carrega quando o status mudar
  useEffect(() => {
    carregarReservas(0, statusFiltro);
  }, [statusFiltro]);

  return (
    <div className="flex w-full flex-col justify-end mt-4">


      {/* PAGINAÇÃO */}
      <PaginationControl
        page={pageInfo.page}
        totalPages={pageInfo.totalPages}
        totalItems={pageInfo.totalItems}
        onChange={(newPage) => {
          setPageInfo((prev) => ({ ...prev, page: newPage }));
          carregarReservas(newPage);
        }}
      />
      {/* FILTRO DE STATUS */}
      <Box sx={{ mb: 2, mt: -2 }} className="flex justify-end">
        <FormControl style={{ width: 200, alignSelf: "self-end" }} size="small">
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="Agendada">Agendadas</MenuItem>
            <MenuItem value="Cancelada">Canceladas</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {/* LISTA DE RESERVAS */}
      <MinhasReservasCards
        reservas={reservas}
        onCancelar={async (item) => {
          try {
            await minhasReservasService.cancelar(item.id);
            toast.success("Reserva cancelada com sucesso!");

            // recarregar lista depois do cancelamento
            carregarReservas();
          } catch (error: any) {
            const msg = error.response?.data?.message || "Erro ao cancelar.";
            toast.error(msg);
            console.error(error);
          }
        }}
      />
    </div>
  );
}
