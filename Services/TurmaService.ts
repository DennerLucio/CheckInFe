import api from './Api';


export type GetTurmaResponse = TurmaResponse[];

export interface TurmaResponse {
    id: number;
    nome: string;
   
}

export interface Aluno {
    alunoId: number;
    nome: string;
  }
  
  export interface ClasseResponse {
    classeId: number;
    nome: string;
    quantidadeAlunos: number;
    quantidadeRelatorios: number;
    professores: any[]; 
    alunos: Aluno[];
  }

export const buscaTurmas = async (): Promise<GetTurmaResponse> => {
    try {
        const response = await api.get<GetTurmaResponse>('/api/Classe');
        
        return response.data;
    } catch (error) {
        console.error('Erro ao obter dados:', error);
        throw error;
    }
};

export const buscaAluno = async (
    classeId: number,
    pagina: number = 1,
    quantidadeItens: number = 10
  ): Promise<ClasseResponse[]> => {
    try {
      const response = await api.get<ClasseResponse[]>(`/api/classe/${classeId}/alunos`, {
        params: { pagina, quantidadeItens },
      });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar aluno:', error);
      throw error;
    }
  };
  