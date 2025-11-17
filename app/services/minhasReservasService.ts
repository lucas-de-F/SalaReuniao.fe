import api from "./api";


export interface SalasFilter {
  page?: number;
  pageSize?: number;
}


export interface Reserva {
      "id": "2cf05028-0abd-4244-bf19-e325bef75b53",
      "idSalaReuniao": "f26d6796-9588-4cdb-86a5-6e158600b904",
      "inicio": "08:00:00",
      "fim": "10:00:00",
      "data": "2025-11-17",
      "status": "Agendada"
}

export interface ReservaResponse {
  items: Reserva[];
  totalItems: number;
  page: number;
  pageSize: number;
}
export const minhasReservasService = {
  async listar(filter: SalasFilter): Promise<ReservaResponse> {
    const {data } = await api.get(`/Reservas`, {
      params: filter,
    });
    return data;
  },
  async cancelar(id: string): Promise<void> {
    await api.post(`/Reservas/Cancelar/${id}`);
  }

};
