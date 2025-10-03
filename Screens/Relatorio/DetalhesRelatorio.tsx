"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from "react-native"
import {
  infoRelatorio,
  type RelatorioResponse,
  compartilharRelatorioPlanilha,
  baixarRelatorioPlanilha,
} from "../../Services/RelatorioService"
import type { RouteProp } from "@react-navigation/native"
import type { RootStackParamList } from "../../App"
import { AxiosError } from "axios"
import * as NavigationServices from "../../Services/NavigationServices"

interface DetalhesRelatorioProps {
  route: RouteProp<RootStackParamList, "DetalhesRelatorio">
}

// Relatório consolidado
interface ListaRelatorioConsolidado {
  totalBiblias: number
  totalFaltas: number
  totalOfertas: number
  totalPresentes: number
  totalRevistas: number
  totalVisitantes: number
  data?: string
  relatorioId?: number // Para exibição no FlatList
  nomeClasse?: string
}

// Type guard para relatório consolidado
function isConsolidado(relatorio: any): relatorio is ListaRelatorioConsolidado {
  return "totalBiblias" in relatorio && !("id" in relatorio)
}

function formatarData(dataISO: string): string {
  if (!dataISO) return "-"
  const data = new Date(dataISO)
  const dia = data.getDate().toString().padStart(2, "0")
  const mes = (data.getMonth() + 1).toString().padStart(2, "0")
  const ano = data.getFullYear().toString()
  return `${dia}/${mes}/${ano}`
}

export function DetalhesRelatorio({ route }: DetalhesRelatorioProps) {
  const { relatorioId, dadosRelatorio } = route.params

  const [relatorio, setRelatorio] = useState<RelatorioResponse | ListaRelatorioConsolidado | null>(
    dadosRelatorio || null,
  )
  const [loading, setLoading] = useState(!(dadosRelatorio && isConsolidado(dadosRelatorio)))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const isConsolidadoReport = dadosRelatorio && isConsolidado(dadosRelatorio)

    // Se for consolidado e tiver dados, não faz fetch
    if (isConsolidadoReport) {
      setRelatorio(dadosRelatorio)
      setLoading(false)
      return
    }

    // Para relatórios comuns, sempre faz fetch para pegar dados completos
    const fetchRelatorio = async () => {
      try {
        const data = await infoRelatorio(relatorioId)
        setRelatorio(data)
      } catch (error) {
        console.error("Erro ao buscar detalhes do relatório:", error)
        setError("Não foi possível carregar os detalhes do relatório.")
      } finally {
        setLoading(false)
      }
    }

    fetchRelatorio()
  }, [relatorioId, dadosRelatorio])

  const handleGerarRelatorio = async () => {
    try {
      await compartilharRelatorioPlanilha()
    } catch (error) {
      console.error("Erro ao gerar planilha:", error)
      setError("Não foi possível gerar a planilha.")
    }
  }

  const handleBaixarRelatorio = async () => {
    try {
      await baixarRelatorioPlanilha()
      Alert.alert("Sucesso", "Relatório baixado com sucesso!", [{ text: "OK" }])
    } catch (error: unknown) {
      console.error("Erro ao baixar planilha:", error)
      if (error instanceof AxiosError && error.response) {
        setError("Erro ao baixar o relatório: " + error.response.data)
      } else {
        setError("Não foi possível baixar a planilha. Tente novamente mais tarde.")
      }
      Alert.alert("Erro", error instanceof Error ? error.message : "Ocorreu um erro inesperado.", [{ text: "OK" }])
    }
  }

  const handleEditarRelatorio = () => {
    if (!relatorio || isConsolidado(relatorio)) return

    NavigationServices.navigate("CadastrarRelatorio", {
      turmaId: relatorio.classeId,
      relatorioId: relatorio.id,
      dadosRelatorio: relatorio,
    })
  }

  if (loading) return <ActivityIndicator size="large" color="#6C5CE7" style={styles.loading} />

  if (error)
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )

  if (!relatorio) return <Text style={styles.noData}>Nenhum relatório encontrado.</Text>

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes do Relatório</Text>
      <View style={styles.card}>
        {isConsolidado(relatorio) ? (
          <>
            <Text style={styles.label}>📖 Total de Bíblias: {relatorio.totalBiblias}</Text>
            <Text style={styles.label}>💰 Total de Ofertas: {relatorio.totalOfertas}</Text>
            <Text style={styles.label}>👥 Total Presentes: {relatorio.totalPresentes}</Text>
            <Text style={styles.label}>📝 Total de Revistas: {relatorio.totalRevistas}</Text>
            <Text style={styles.label}>👥 Total Visitantes: {relatorio.totalVisitantes}</Text>
            <Text style={styles.label}>❌ Total de Faltas: {relatorio.totalFaltas}</Text>
          </>
        ) : (
          <>
            <Text style={styles.label}>📅 Data: {formatarData(relatorio.data)}</Text>
            <Text style={styles.label}>👨‍🏫 Professor: {relatorio.professor ?? "-"}</Text>
            <Text style={styles.label}>📖 Quantidade de Bíblias: {relatorio.quantidadeBiblias}</Text>
            <Text style={styles.label}>💰 Oferta: {relatorio.oferta}</Text>
            <Text style={styles.label}>👥 Presentes: {relatorio.presentes}</Text>
            <Text style={styles.label}>📝 Observação: {relatorio.observacao}</Text>
          </>
        )}
      </View>

      {!isConsolidado(relatorio) && (
        <>
          <TouchableOpacity style={styles.button} onPress={handleGerarRelatorio}>
            <Text style={styles.buttonText}>Compartilhar Relatório</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.downloadButton]} onPress={handleBaixarRelatorio}>
            <Text style={styles.buttonText}>Baixar Relatório</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity style={[styles.button, styles.editButton]} onPress={handleEditarRelatorio}>
            <Text style={styles.buttonText}>Editar Relatório</Text>
          </TouchableOpacity> */}
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FF", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#333B69", marginBottom: 20, marginTop: 10 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: { fontSize: 16, color: "#333B69", marginBottom: 16, fontWeight: "500" },
  button: {
    backgroundColor: "#6C5CE7",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  downloadButton: { backgroundColor: "#6C5CE7" },
  editButton: { backgroundColor: "#c9ab00ff" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#F5F7FF" },
  errorText: {
    color: "#FF6B6B",
    textAlign: "center",
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: "100%",
  },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  noData: {
    color: "#333B69",
    textAlign: "center",
    fontSize: 18,
    padding: 20,
    backgroundColor: "#FFFFFF",
    margin: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
})
