import api from './Api';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';

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
  professor: string;
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
  startDate?: string;
  endDate?: string;
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
    startDate,
    endDate,
    pagina = 1,
    quantidadeItens = 100,
  }: ListarRelatoriosParams): Promise<GetListaRelatorioResponse[]> => {
      try {
          const response = await api.get<GetListaRelatorioResponse[]>('/api/relatorio', {
              params: {
                  classeId,
                  startDate,
                  endDate,
                  pagina,
                  quantidadeItens,
              },
          });
          return response.data;
      } catch (error) {
          console.error('Erro ao listar relatórios:', error);
          throw new Error("Não foi possível listar os relatórios. Tente novamente mais tarde.");
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

export const compartilharRelatorioPlanilha = async (): Promise<void> => {
  try {
    const response = await api.get('/api/relatorio/geral/planilha', {
      responseType: 'arraybuffer', // Garante que a resposta seja tratada como ArrayBuffer
    });

    // Converter ArrayBuffer para Base64 de forma otimizada
    const base64Data = arrayBufferToBase64(response.data);

    // Caminho do arquivo no dispositivo
    const fileUri = FileSystem.documentDirectory + 'relatorio_turma.xlsx';

    // Escrever o arquivo como Base64 no dispositivo
    await FileSystem.writeAsStringAsync(fileUri, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log('Planilha salva em:', fileUri);

    // Compartilhar o arquivo com outras aplicações (opcional)
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    }

  } catch (error) {
    console.error('Erro ao gerar a planilha:', error);
    throw new Error("Não foi possível gerar a planilha. Tente novamente mais tarde.");
  }
};

export const baixarRelatorioPlanilha = async (): Promise<void> => {
  try {
    const response = await api.get('/api/relatorio/geral/planilha', {
      responseType: 'arraybuffer', // Garante que a resposta seja tratada como ArrayBuffer
    });

    // Converter ArrayBuffer para Base64
    const base64Data = arrayBufferToBase64(response.data);

    // Caminho da pasta de Downloads
    const downloadsDirectory = FileSystem.documentDirectory + 'downloads/';

    // Verificar se a pasta de Downloads existe, caso contrário, criar
    const folderInfo = await FileSystem.getInfoAsync(downloadsDirectory);
    if (!folderInfo.exists) {
      await FileSystem.makeDirectoryAsync(downloadsDirectory, { intermediates: true });
    }

    // Nome do arquivo da planilha
    const fileUri = downloadsDirectory + 'relatorio_turma.xlsx';

    // Escrever o arquivo como Base64 no dispositivo
    await FileSystem.writeAsStringAsync(fileUri, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log('Planilha salva em:', fileUri);

    // Para usuários no Android, pode ser necessário adicionar permissão para acessar a pasta de Downloads
    if (Platform.OS === 'android') {
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (permission.granted) {
        await MediaLibrary.createAssetAsync(fileUri);
      }
    }

  } catch (error) {
    console.error('Erro ao gerar a planilha:', error);
    throw new Error("Não foi possível baixar a planilha. Tente novamente mais tarde.");
  }
};

// Função para converter ArrayBuffer para Base64
const arrayBufferToBase64 = (arrayBuffer: ArrayBuffer): string => {
  const uint8Array = new Uint8Array(arrayBuffer);
  return btoa(String.fromCharCode(...uint8Array)); // Converte ArrayBuffer para Base64
};