import api from "./Api"
import * as FileSystem from "expo-file-system"
import * as Sharing from "expo-sharing"
import * as MediaLibrary from "expo-media-library"
import { Platform } from "react-native"

export interface CadastrarRelatorioResponse {
  success: boolean
}

export interface AlunoPresenca {
  alunoId: number
  presente: boolean
  aluno: {
    nome: string
  }
}

export interface EditarRelatorioRequest {
  id: number
  data: string // ISO string
  observacao: string
  oferta: number
  quantidadeBiblias: number
  professorId: number
  presencas: {
    alunoId: number
    presente: boolean
  }[]
}

export interface EditarRelatorioResponse {
  id: number
  data: string
  observacao: string
  oferta: number
  quantidadeBiblias: number
  professorId: number
  presencas: {
    alunoId: number
    presente: boolean
  }[]
}

export interface RelatorioResponse {
  id: number
  data: string
  observacao: string
  professor: string
  professorId?: number // Adicionado professorId opcional
  oferta: number
  presentes: number
  quantidadeBiblias: number
  quantidadeRevistas?: number // Adicionando campos de revistas e visitantes
  quantidadeVisitantes?: number // Adicionando campos de revistas e visitantes
  classeId: number
  presencas: AlunoPresenca[]
}

export interface ListaRelatorioResponse {
  relatorioId: number
  nomeClasse: string
  quantidadePresentes: number
  data: string
}

export interface ListarRelatoriosParams {
  classeId?: number
  startDate?: string
  endDate?: string
  pagina?: number
  quantidadeItens?: number
}

export interface RelatorioConsolidadoResponse {
  totalBiblias: number
  totalFaltas: number
  totalOferta: number
  totalPresentes: number
  totalRevistas: number
  totalVisitantes: number

}

export type GetRelatorioResponse = RelatorioResponse
export type GetListaRelatorioResponse = ListaRelatorioResponse

export const cadastrarRelatorio = async (
  observacao: string,
  oferta: number,
  professorId: number,
  quantidadeBiblias: number,
  quantidadeRevistas: number,
  quantidadeVisitantes: number,
  classeId: number,
  alunosPresentesIds: number[],
): Promise<CadastrarRelatorioResponse> => {
  try {
    const response = await api.post<CadastrarRelatorioResponse>("/api/relatorio", {
      observacao,
      oferta,
      professorId,
      quantidadeBiblias,
      quantidadeRevistas,
      quantidadeVisitantes,
      classeId,
      alunosPresentesIds,
    })
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error("Erro ao subir dados:", error)
    throw new Error("Não foi possível cadastrar o relatório. Tente novamente mais tarde.")
  }
}

export const listarRelatorios = async ({
  classeId,
  startDate,
  endDate,
  pagina = 1,
  quantidadeItens = 100,
}: ListarRelatoriosParams): Promise<GetListaRelatorioResponse[]> => {
  try {
    const response = await api.get<GetListaRelatorioResponse[]>("/api/relatorio", {
      params: {
        classeId,
        startDate,
        endDate,
        pagina,
        quantidadeItens,
      },
    })
    return response.data
  } catch (error) {
    console.error("Erro ao listar relatórios:", error)
    throw new Error("Não foi possível listar os relatórios. Tente novamente mais tarde.")
  }
}

export const infoRelatorio = async (id: number): Promise<RelatorioResponse> => {
  try {
    console.log("Buscando relatório via GET /api/relatorio/" + id)
    const response = await api.get<RelatorioResponse>(`/api/relatorio/${id}`)
    console.log("Dados retornados pela API:", JSON.stringify(response.data, null, 2))
    return response.data
  } catch (error) {
    console.error("Erro ao obter informações do relatório:", error)
    throw new Error("Não foi possível obter as informações do relatório. Tente novamente mais tarde.")
  }
}

export const listarRelatoriosConsolidado = async ({
  classeId,
  startDate,
  endDate,
}: {
  classeId?: number
  startDate?: string
  endDate?: string
}): Promise<RelatorioConsolidadoResponse> => {
  try {
    const response = await api.get<RelatorioConsolidadoResponse>("/api/relatorio/consolidado", {
      params: {
        classeId,
        startDate,
        endDate,
      },
    })
    return response.data
  } catch (error) {
    console.error("Erro ao buscar relatório consolidado:", error)
    throw new Error("Não foi possível buscar o relatório consolidado. Tente novamente mais tarde.")
  }
}

export const compartilharRelatorioPlanilha = async (): Promise<void> => {
  try {
    const response = await api.get("/api/relatorio/geral/planilha", {
      responseType: "arraybuffer",
    })

    const base64Data = arrayBufferToBase64(response.data)
    const fileUri = FileSystem.documentDirectory + "relatorio_turma.xlsx"

    await FileSystem.writeAsStringAsync(fileUri, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    })

    console.log("Planilha salva em:", fileUri)

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri)
    }
  } catch (error) {
    console.error("Erro ao gerar a planilha:", error)
    throw new Error("Não foi possível gerar a planilha. Tente novamente mais tarde.")
  }
}

export const baixarRelatorioPlanilha = async (): Promise<void> => {
  try {
    const response = await api.get("/api/relatorio/geral/planilha", {
      responseType: "arraybuffer",
    })

    const base64Data = arrayBufferToBase64(response.data)
    const downloadsDirectory = FileSystem.documentDirectory + "downloads/"

    const folderInfo = await FileSystem.getInfoAsync(downloadsDirectory)
    if (!folderInfo.exists) {
      await FileSystem.makeDirectoryAsync(downloadsDirectory, { intermediates: true })
    }

    const fileUri = downloadsDirectory + "relatorio_turma.xlsx"

    await FileSystem.writeAsStringAsync(fileUri, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    })

    console.log("Planilha salva em:", fileUri)

    if (Platform.OS === "android") {
      const permission = await MediaLibrary.requestPermissionsAsync()
      if (permission.granted) {
        await MediaLibrary.createAssetAsync(fileUri)
      }
    }
  } catch (error) {
    console.error("Erro ao gerar a planilha:", error)
    throw new Error("Não foi possível baixar a planilha. Tente novamente mais tarde.")
  }
}

const arrayBufferToBase64 = (arrayBuffer: ArrayBuffer): string => {
  const uint8Array = new Uint8Array(arrayBuffer)
  return btoa(String.fromCharCode(...uint8Array))
}

export const editarRelatorio = async (relatorio: EditarRelatorioRequest): Promise<EditarRelatorioResponse> => {
  try {
    console.log("Enviando PUT para /api/relatorio:", JSON.stringify(relatorio, null, 2))

    const response = await api.put<EditarRelatorioResponse>("/api/relatorio", relatorio, {
      headers: {
        "Content-Type": "application/json-patch+json",
      },
    })
    console.log("✅ Relatório editado com sucesso:", response.data)
    return response.data
  } catch (error: any) {
    if (error.response) {
      const errorMessage =
        typeof error.response.data === "string"
          ? error.response.data
          : error.response.data?.message || "Erro desconhecido no servidor"

      console.error("❌ Erro da API ao editar relatório:")
      console.error("Status:", error.response.status)
      console.error("Dados:", errorMessage)

      if (errorMessage.includes("IDbAsyncQueryProvider")) {
        throw new Error(
          "Erro no servidor",
        )
      }

      throw new Error(errorMessage)
    } else {
      console.error("❌ Erro inesperado ao editar relatório:", error.message)
      throw new Error("Não foi possível editar o relatório. Verifique sua conexão e tente novamente.")
    }
  }
}
