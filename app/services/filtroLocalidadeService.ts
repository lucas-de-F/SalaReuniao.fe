// services/salasService.ts
import api from "./api";

interface Localidade {
  estado: string;
  municipios: string[];
}
interface filtrosLocalidadeResponse {
  items: Localidade[];
  totalItems: number;
  page: number;
  pageSize: number;
}

export const FiltroLocalidadeService = {
  async obterLocalidades(page: number, pageSize: number): Promise<filtrosLocalidadeResponse> {
    const { data } = await api.get("/FiltrosLocalidade/filtros-localidade", {
      params: {
        page,
        pageSize,
      },
    });
    return data;
  }
};
