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

export interface Aluno {
  id: number;
  nome: string;
  classeId: number;
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


export const deletaAluno = async (id: number, classeId: number): Promise<void> => {
    try {
        await api.delete(`/api/Aluno/${id}`, {
            data: { classeId },
            headers: {
                'Content-Type': 'application/json-patch+json'
            }
        });
        console.log(`Aluno com ID ${id} deletado com sucesso.`);
    } catch (error) {
        console.error(`Erro ao deletar aluno com ID ${id}:`, error);
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



export const buscaAlunos = async (classeId: number): Promise<Aluno[]> => {
  try {
    const response = await api.get<Aluno[]>(`/api/Aluno?classeId=${classeId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar alunos:", error);
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

export const deletaProfessor = async (id: number): Promise<void> => {
    try {
        await api.delete(`/api/Professor/${id}`);
        console.log(`Professor com ID ${id} deletado com sucesso.`);
    } catch (error) {
        console.error(`Erro ao deletar professor com ID ${id}:`, error);
        throw error;
    }
};



