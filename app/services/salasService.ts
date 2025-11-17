import api from "./api";

export interface Endereco {
  rua: string;
  numero: number;
  complemento: string;
  bairro: string;
  municipio: string;
  estado: string;
  cep: string;
}

export interface Sala {
  id: string;
  nome: string;
  capacidade: number;
  descricao: string;
  valorHora: number;
  endereco: Endereco;
}

export interface SalasFilter {
  id?: string;
  idProprietario?: string;
  nome?: string;
  data?: string;       // ISO date: YYYY-MM-DD
  horaInicio?: string; // HH:mm
  duracao?: string;    // HH:mm ou minutos
  capacidade?: number;
  estado?: string;
  municipio?: string;
  page?: number;
  pageSize?: number;
}
interface SalaResponse {
  items: Sala[];
  totalItems: number;
  page: number;
  pageSize: number;
}

export interface ReuniaoAgendada {
  id: string;
  idSalaReuniao: string;
  inicio: string; // "HH:mm:ss"
  fim: string;    // "HH:mm:ss"
  data: string;   // "YYYY-MM-DD"
  status: string; // "Agendada", etc
}

// Disponibilidades
export interface Disponibilidade {
  diaSemana: string; // "Monday", "Tuesday", etc
  inicio: string;    // "HH:mm:ss"
  fim: string;       // "HH:mm:ss"
}
// Interface detalhada da sala
export interface SalaDetalhada extends Sala {
  disponibilidades: Disponibilidade[];
  reunioesAgendadas: ReuniaoAgendada[];
}
export const salasService = {
  async getSalas(page: number, pageSize: number, filters: SalasFilter): Promise<SalaResponse> {
    const { data } = await api.get("/SalaDeReuniao", {
      params: {
        page,
        pageSize,
        ...filters,
      },
      paramsSerializer: {
        serialize: (params) => {
          const searchParams = new URLSearchParams();
          Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach((v) => searchParams.append(key, v));
            } else if (value !== undefined && value !== null) {
              searchParams.append(key, String(value));
            }
          });
          return searchParams.toString();
        }
      }
    });
    return data;
  },
  async getSalaById(id: string): Promise<SalaDetalhada> {
    const { data } = await api.get(`/SalaDeReuniao/${id}`);
    return data;
  },
  async realizarReserva(idSala: string, data: string, horaInicio: string, horaFim: string): Promise<void> {
    await api.post(`/Reservas/Reservar`, {
      idSala,
      data,
      inicio: horaInicio,
      fim: horaFim
    });
  },
  async criar(data: any) {
    const { data: created } = await api.post(`/SalaDeReuniao`, data);
    return created;
  },
  async atualizar(id: string,  data: any) {
    },
  async remover(id: string): Promise<void> {
    await api.delete(`/SalaDeReuniao/${id}`);
  }

};
