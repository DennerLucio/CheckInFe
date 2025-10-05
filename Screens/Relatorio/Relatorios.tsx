"use client"

import { useState, useCallback } from "react"
import { Picker } from "@react-native-picker/picker"
import DateTimePickerModal from "react-native-modal-datetime-picker"
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

interface ListaRelatorioConsolidado extends ListaRelatorioResponse {
  totalFaltas?: number
  totalRevistas?: number
  totalVisitantes?: number
  totalBiblias?: number
  totalOferta?: number
  totalPresentes?: number
}

const hojeBrasilia = (): Date => {
  const now = new Date()
  const offset = -3 * 60
  const brasiliaTime = new Date(now.getTime() + offset * 60 * 1000 + now.getTimezoneOffset() * 60000)
  return brasiliaTime
}

export function Relatorios() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const [selectedTurma, setSelectedTurma] = useState<number | undefined>(undefined)
  const [relatorios, setRelatorios] = useState<ListaRelatorioConsolidado[]>([])
  const [loading, setLoading] = useState(false)
  const [turmas, setTurmas] = useState<{ id: number; nome: string }[]>([])
  const [activeSection, setActiveSection] = useState<"comum" | "consolidado">("comum")

  const [startDate, setStartDate] = useState<Date>(hojeBrasilia())
  const [endDate, setEndDate] = useState<Date>(hojeBrasilia())
  const [showStartPicker, setShowStartPicker] = useState(false)
  const [showEndPicker, setShowEndPicker] = useState(false)

  // Função genérica: converte meia-noite local -> UTC e opcionalmente soma dias (use addDays=1 para endDate).
  const formatDateToUtc = (date: Date, addDays = 0): string => {
    const localMidnight = new Date(date)
    localMidnight.setHours(0, 0, 0, 0) // meia-noite local
    const timezoneOffsetMs = localMidnight.getTimezoneOffset() * 60000
    const utcDate = new Date(localMidnight.getTime() - timezoneOffsetMs + addDays * 86400000)
    return utcDate.toISOString().split("T")[0] // yyyy-mm-dd
  }

  const formatDateBR = (date: Date) => {
    const dd = String(date.getDate()).padStart(2, "0")
    const mm = String(date.getMonth() + 1).padStart(2, "0")
    const yyyy = date.getFullYear()
    return `${dd}/${mm}/${yyyy}`
  }

  const fetchRelatorios = async () => {
    setLoading(true)
    const params: { classeId?: number; startDate?: string; endDate?: string } = {}

    // startDate: meia-noite local convertida pra UTC (yyyy-mm-dd)
    params.startDate = formatDateToUtc(startDate, 0)

    // endDate: enviar o dia seguinte em UTC para incluir todo o dia selecionado
    // (muitos backends usam end-exclusive ou comparam < endDate)
    params.endDate = formatDateToUtc(endDate, 1)

    if (selectedTurma !== undefined) params.classeId = selectedTurma

    try {
      let data: ListaRelatorioConsolidado[] = []

      if (activeSection === "consolidado") {
        const consolidated: RelatorioConsolidadoResponse = await listarRelatoriosConsolidado(params)
        const hasData = Object.values(consolidated).some((value) => value > 0)
        if (hasData) {
          data = [
            {
              relatorioId: 1,
              nomeClasse: "Consolidado",
              data: `${formatDateBR(startDate)} até ${formatDateBR(endDate)}`,
              quantidadePresentes: consolidated.totalPresentes,
              totalPresentes: consolidated.totalPresentes,
              totalBiblias: consolidated.totalBiblias,
              totalOferta: consolidated.totalOferta,
              totalRevistas: consolidated.totalRevistas,
              totalVisitantes: consolidated.totalVisitantes,
              totalFaltas: consolidated.totalFaltas,
            },
          ]
        } else {
          data = []
        }
      } else {
        data = await listarRelatorios(params)
      }

      setRelatorios(data)
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os relatórios.")
    } finally {
      setLoading(false)
    }
  }

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
    }, []),
  )

  // Atualiza automaticamente sempre que filtros mudarem
  useFocusEffect(
    useCallback(() => {
      fetchRelatorios()
    }, [selectedTurma, startDate, endDate, activeSection]),
  )

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
              <Text style={styles.filterLabel}>Data Início</Text>
              <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowStartPicker(true)}>
                <Text style={styles.datePickerText}>{formatDateBR(startDate)}</Text>
              </TouchableOpacity>

              <DateTimePickerModal
                isVisible={showStartPicker}
                mode="date"
                date={startDate}
                onConfirm={(date) => {
                  setStartDate(date)
                  setShowStartPicker(false)
                }}
                onCancel={() => setShowStartPicker(false)}
              />

              <Text style={[styles.filterLabel, { marginTop: 10 }]}>Data Fim</Text>
              <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowEndPicker(true)}>
                <Text style={styles.datePickerText}>{formatDateBR(endDate)}</Text>
              </TouchableOpacity>

              <DateTimePickerModal
                isVisible={showEndPicker}
                mode="date"
                date={endDate}
                onConfirm={(date) => {
                  setEndDate(date)
                  setShowEndPicker(false)
                }}
                onCancel={() => setShowEndPicker(false)}
              />
            </View>
          </View>
        </View>

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
                    (item.totalOferta ?? 0) > 0 ||
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
