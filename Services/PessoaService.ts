import api from './Api';

export interface CadastrarPessoaResponse {
    success: boolean;
   
}
export interface AlunoResponse {
    nome: string;
    classeId: number;
  }
  export interface ProfessorResponse {
    id: number;
    nome: string;
    relatorios: any | null;
}



export const cadastraAluno = async ( nome:string, classeId:number): Promise<CadastrarPessoaResponse> => {
    console.log(nome, classeId)
    try {
        const response = await api.post<CadastrarPessoaResponse>('/api/Aluno', { nome, classeId });
        return response.data;
    } catch (error) {
        console.error('Erro ao obter dados:', error);
        throw error;
    }
};

export const cadastraProfessor = async (nome:string, classeId:number): Promise<CadastrarPessoaResponse> => {
    try {
        const response = await api.post<CadastrarPessoaResponse>('/api/Professor', { nome, classeId });
        return response.data;
    } catch (error) {
        console.error('Erro ao obter dados:', error);
        throw error;
    }
};

export const buscaProfessor = async (): Promise<ProfessorResponse[]> => {
    try {
        const response = await api.get<ProfessorResponse[]>('/api/Professor');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar professor:', error);
        throw error;
    }
};



