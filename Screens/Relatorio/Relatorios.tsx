"use client"

import { useState, useCallback } from "react"
import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native"
import { Picker } from "@react-native-picker/picker"
import styles from "./StyleRelatorio"
import { CardRelatorio } from "../../components/CardRelatorio/CardRelatorio"
import {
  type ListaRelatorioResponse,
  listarRelatorios,
  listarRelatoriosConsolidado,
  type RelatorioConsolidadoResponse,
} from "../../Services/RelatorioService"
import { buscaTurmas, type GetTurmaResponse } from "../../Services/TurmaService"
import { useNavigation, type NavigationProp, useFocusEffect } from "@react-navigation/native"
import type { RootStackParamList } from "../../App"
import { Feather } from "@expo/vector-icons"

// Extensão para consolidado
interface ListaRelatorioConsolidado extends ListaRelatorioResponse {
  totalFaltas?: number
  totalRevistas?: number
  totalVisitantes?: number
  totalBiblias?: number
  totalOfertas?: number
  totalPresentes?: number
}

export function Relatorios() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const [selectedTurma, setSelectedTurma] = useState<number | undefined>(undefined)
  const [selectedData, setSelectedData] = useState("Selecione")
  const [relatorios, setRelatorios] = useState<ListaRelatorioConsolidado[]>([])
  const [loading, setLoading] = useState(false)
  const [turmas, setTurmas] = useState<{ id: number; nome: string }[]>([])
  const [activeSection, setActiveSection] = useState<"comum" | "consolidado">("comum")

  // Busca os relatórios
  const fetchRelatorios = async () => {
    setLoading(true)

    const params: { classeId?: number; startDate?: string; endDate?: string } = {}

    if (selectedData !== "Selecione") {
      const [year, month] = selectedData.split("-")
      const lastDay = new Date(Number(year), Number(month), 0).getDate()
      params.startDate = `${selectedData}-01`
      params.endDate = `${selectedData}-${lastDay}`
    }

    if (selectedTurma !== undefined) params.classeId = selectedTurma

    try {
      let data: ListaRelatorioConsolidado[] = []

      if (activeSection === "consolidado") {
        const consolidated: RelatorioConsolidadoResponse = await listarRelatoriosConsolidado(params)
        console.log("[v0] Dados consolidados da API:", consolidated)
        console.log("[v0] Total Ofertas:", consolidated.totalOferta)
        console.log("[v0] Total Presentes:", consolidated.totalPresentes)

        const hasData = Object.values(consolidated).some((value) => value > 0)
        if (hasData) {
          data = [
            {
              relatorioId: 1,
              nomeClasse: "Consolidado",
              data: `${params.startDate || ""} até ${params.endDate || ""}`,
              quantidadePresentes: consolidated.totalPresentes,
              totalPresentes: consolidated.totalPresentes,
              totalBiblias: consolidated.totalBiblias,
              totalOfertas: consolidated.totalOferta,
              totalRevistas: consolidated.totalRevistas,
              totalVisitantes: consolidated.totalVisitantes,
              totalFaltas: consolidated.totalFaltas,
            },
          ]
          console.log("[v0] Objeto consolidado criado:", data[0])
        }
      } else {
        data = await listarRelatorios(params)
      }

      setRelatorios(data)
    } catch (error) {
      console.error("Erro ao buscar relatórios:", error)
      Alert.alert("Erro", "Não foi possível carregar os relatórios.")
    } finally {
      setLoading(false)
    }
  }

  // Busca turmas
  const fetchTurmas = async () => {
    try {
      const response: GetTurmaResponse = await buscaTurmas()
      setTurmas(response.map((t) => ({ id: t.id, nome: t.nome })))
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as turmas.")
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchTurmas()
      fetchRelatorios()
    }, [selectedTurma, selectedData, activeSection]),
  )

  // FlatList press
  const onPressRelatorio = (relatorio: ListaRelatorioConsolidado) => {
    navigation.navigate("DetalhesRelatorio", {
      relatorioId: relatorio.relatorioId ?? 0,
      dadosRelatorio: relatorio,
    })
  }

  const sortedRelatorios = relatorios.sort((a, b) => Number(b.relatorioId) - Number(a.relatorioId))

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Relatórios</Text>
        <Text style={styles.headerSubtitle}>Visualize e filtre os relatórios</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeSection === "comum" && styles.activeTab]}
          onPress={() => setActiveSection("comum")}
        >
          <Feather name="file-text" size={18} color={activeSection === "comum" ? "#6C5CE7" : "#8A94A6"} />
          <Text style={[styles.tabText, activeSection === "comum" && styles.activeTabText]}>Comuns</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeSection === "consolidado" && styles.activeTab]}
          onPress={() => setActiveSection("consolidado")}
        >
          <Feather name="bar-chart-2" size={18} color={activeSection === "consolidado" ? "#6C5CE7" : "#8A94A6"} />
          <Text style={[styles.tabText, activeSection === "consolidado" && styles.activeTabText]}>Consolidados</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* FILTROS */}
        <View style={styles.filterCard}>
          <View style={styles.cardHeader}>
            <Feather name="filter" size={20} color="#6C5CE7" />
            <Text style={styles.cardTitle}>Filtros</Text>
          </View>

          <View style={styles.filterRow}>
            <View style={styles.filterColumn}>
              <Text style={styles.filterLabel}>Turma</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedTurma}
                  style={styles.picker}
                  onValueChange={(itemValue) =>
                    setSelectedTurma(itemValue === undefined ? undefined : Number(itemValue))
                  }
                  dropdownIconColor="#6C5CE7"
                >
                  <Picker.Item label="Todas" value={undefined} />
                  {turmas.map((t) => (
                    <Picker.Item key={t.id} label={t.nome} value={t.id} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.filterColumn}>
              <Text style={styles.filterLabel}>Mês</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedData}
                  style={styles.picker}
                  onValueChange={(itemValue) => setSelectedData(itemValue)}
                  dropdownIconColor="#6C5CE7"
                >
                  <Picker.Item label="Todos" value="Selecione" />
                  {[...Array(12)].map((_, i) => {
                    const month = (i + 1).toString().padStart(2, "0")
                    const label = new Date(2025, i).toLocaleString("pt-BR", { month: "long" })
                    return (
                      <Picker.Item
                        key={month}
                        label={`${label.charAt(0).toUpperCase()}${label.slice(1)}`}
                        value={`2025-${month}`}
                      />
                    )
                  })}
                </Picker>
              </View>
            </View>
          </View>
        </View>

        {/* RELATÓRIOS */}
        <View style={styles.reportsCard}>
          <View style={styles.cardHeader}>
            <Feather name={activeSection === "comum" ? "file-text" : "bar-chart-2"} size={20} color="#6C5CE7" />
            <Text style={styles.cardTitle}>
              {activeSection === "comum" ? "Relatórios Comuns" : "Relatórios Consolidados"}
            </Text>
          </View>

          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#6C5CE7" />
              <Text style={styles.loadingText}>Carregando relatórios...</Text>
            </View>
          ) : sortedRelatorios.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Feather name="inbox" size={48} color="#8A94A6" />
              <Text style={styles.emptyText}>Nenhum relatório encontrado</Text>
              <Text style={styles.emptySubtext}>
                {activeSection === "comum"
                  ? "Tente ajustar os filtros ou criar um novo relatório"
                  : "Não há dados consolidados para os filtros selecionados"}
              </Text>
            </View>
          ) : (
            <FlatList<ListaRelatorioConsolidado>
              data={sortedRelatorios.filter((item) => {
                if (activeSection === "consolidado") {
                  return (
                    (item.totalPresentes ?? 0) > 0 ||
                    (item.totalBiblias ?? 0) > 0 ||
                    (item.totalOfertas ?? 0) > 0 ||
                    (item.totalRevistas ?? 0) > 0 ||
                    (item.totalVisitantes ?? 0) > 0 ||
                    (item.totalFaltas ?? 0) > 0
                  )
                }
                return true
              })}
              keyExtractor={(item) => (item.relatorioId ?? Math.random()).toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.cardContainer}
                  onPress={() => onPressRelatorio(item)}
                  activeOpacity={0.8}
                >
                  <CardRelatorio relatorio={item} />
                </TouchableOpacity>
              )}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        <View style={styles.infoCard}>
          <Feather name="info" size={20} color="#6C5CE7" />
          <Text style={styles.infoText}>
            {activeSection === "comum"
              ? "Os relatórios comuns mostram dados individuais de cada aula ministrada."
              : "Os relatórios consolidados apresentam dados agrupados e estatísticas gerais."}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
