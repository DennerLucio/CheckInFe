import api from './Api';

export interface CadastrarRelatorioResponse {
    success: boolean;
  }

export interface AlunoPresenca {
  alunoId: number;
  presente: boolean;
  aluno: {
    nome: string;
  };
}

export interface RelatorioResponse {
  id: number;
  data: string;
  observacao: string;
  oferta: number;
  presentes: number;
  quantidadeBiblias: number;
  classeId: number;
  presencas: AlunoPresenca[];
}
export interface ListaRelatorioResponse {
  relatorioId: number;
  nomeClasse: string;
  quantidadePresentes: number; 
  data: string;
}

export interface ListarRelatoriosParams {
  classeId?: number;
  data?: string;
  pagina?: number;
  quantidadeItens?: number;
}

export type GetRelatorioResponse = RelatorioResponse;

export type GetListaRelatorioResponse = ListaRelatorioResponse;

export const cadastrarRelatorio = async (
    observacao: string,
    oferta: number,
    professorId: number,
    quantidadeBiblias: number,
    quantidadeRevistas: number,
    quantidadeVisitantes: number,
    classeId: number,
    alunosPresentesIds: number[] 
  ): Promise<CadastrarRelatorioResponse> => {
    try {
      const response = await api.post<CadastrarRelatorioResponse>('/api/relatorio', {
        observacao,
        oferta,
        professorId,
        quantidadeBiblias,
        quantidadeRevistas,
        quantidadeVisitantes,
        classeId,
        alunosPresentesIds,
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao subir dados:', error);
      throw new Error("Não foi possível cadastrar o relatório. Tente novamente mais tarde.");
    }
  };



  export const listarRelatorios = async ({
    classeId,
    data,
    pagina = 1,
    quantidadeItens = 10,
}: ListarRelatoriosParams): Promise<GetListaRelatorioResponse[]> => {
    try {
        const response = await api.get<GetListaRelatorioResponse[]>('/api/relatorio', {
            params: {
                classeId,
                data,
                pagina,
                quantidadeItens,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao listar relatórios:', error);
        throw new Error("Não foi possível listar os relatórios. Tente novamente mais tarde (Listar todos).");
    }
};


export const infoRelatorio = async (id: number): Promise<RelatorioResponse> => {
  try {
      const response = await api.get<RelatorioResponse>(`/api/relatorio/${id}`);
      return response.data;
  } catch (error) {
      console.error('Erro ao obter informações do relatório:', error);
      throw new Error("Não foi possível obter as informações do relatório. Tente novamente mais tarde.");
  }
};