import React, { useEffect, useState, useCallback } from "react";
import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
  SafeAreaView
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import styles from "./StyleRelatorio";
import { CardRelatorio } from "../../components/CardRelatorio/CardRelatorio";
import {
  ListaRelatorioResponse,
  listarRelatorios,
  listarRelatoriosConsolidado,
} from "../../Services/RelatorioService";
import { buscaTurmas, GetTurmaResponse } from "../../Services/TurmaService";
import { useNavigation, NavigationProp, useFocusEffect } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { Feather } from '@expo/vector-icons';

// Extensão da interface para suportar campos extras do consolidado
interface ListaRelatorioConsolidado extends ListaRelatorioResponse {
  totalFaltas?: number;
  totalRevistas?: number;
  totalVisitantes?: number;
  totalBiblias?: number;
  totalOfertas?: number;
  totalPresentes?: number;
}

export function Relatorios() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [selectedTurma, setSelectedTurma] = useState<number | undefined>(undefined);
  const [selectedData, setSelectedData] = useState("Selecione");
  const [relatorios, setRelatorios] = useState<ListaRelatorioConsolidado[]>([]);
  const [loading, setLoading] = useState(false);
  const [turmas, setTurmas] = useState<{ id: number; nome: string }[]>([]);
  const [activeSection, setActiveSection] = useState<'comum' | 'consolidado'>('comum');

  const fetchRelatorios = async () => {
    setLoading(true);
    const params: { classeId?: number; startDate?: string; endDate?: string } = {};

    if (selectedData !== "Selecione") {
      const [year, month] = selectedData.split("-");
      const lastDay = new Date(Number(year), Number(month), 0).getDate();
      params.startDate = `${selectedData}-01`;
      params.endDate = `${selectedData}-${lastDay}`;
    }

    if (selectedTurma !== undefined) {
      params.classeId = selectedTurma;
    }

    try {
      let data: ListaRelatorioConsolidado[] = [];

      if (activeSection === "consolidado") {
  const consolidatedData = await listarRelatoriosConsolidado(params);

  // DEBUG: veja os dados no console
  console.log("Dados do relatório consolidado:", consolidatedData);

  // Só criar o card se houver algum dado
  const hasData = Object.values(consolidatedData).some(value => value > 0);
  if (hasData) {
    data = [
      {
        relatorioId: 1, // id fictício
        nomeClasse: "Consolidado",
        quantidadePresentes: consolidatedData.totalPresentes,
        data: `${params.startDate || ""} até ${params.endDate || ""}`,
        totalBiblias: consolidatedData.totalBiblias,
        totalOfertas: consolidatedData.totalOfertas,
        totalRevistas: consolidatedData.totalRevistas,
        totalVisitantes: consolidatedData.totalVisitantes,
        totalFaltas: consolidatedData.totalFaltas,
      }
    ];
  }
}
 else {
        data = await listarRelatorios(params);
      }

      setRelatorios(data);
    } catch (error) {
      console.error("Erro ao buscar relatórios:", error);
      Alert.alert("Erro", "Não foi possível carregar os relatórios.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTurmas = async () => {
    try {
      const response: GetTurmaResponse = await buscaTurmas();
      setTurmas(response.map((t) => ({ id: t.id, nome: t.nome })));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as turmas.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTurmas();
      fetchRelatorios();
    }, [selectedTurma, selectedData, activeSection])
  );

  useEffect(() => {
    fetchRelatorios();
  }, [selectedTurma, selectedData, activeSection]);

  const onPressRelatorio = (relatorio: ListaRelatorioConsolidado) => {
  navigation.navigate("DetalhesRelatorio", { 
    relatorioId: relatorio.relatorioId,
    dadosRelatorio: relatorio // <- dados completos
  });
};


  const sortedRelatorios = relatorios.sort(
    (a, b) => Number(b.relatorioId) - Number(a.relatorioId)
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Relatórios</Text>
        <Text style={styles.headerSubtitle}>Visualize e filtre os relatórios</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeSection === 'comum' && styles.activeTab]}
          onPress={() => setActiveSection('comum')}
        >
          <Feather 
            name="file-text" 
            size={18} 
            color={activeSection === 'comum' ? "#6C5CE7" : "#8A94A6"} 
          />
          <Text style={[styles.tabText, activeSection === 'comum' && styles.activeTabText]}>
            Comuns
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeSection === 'consolidado' && styles.activeTab]}
          onPress={() => setActiveSection('consolidado')}
        >
          <Feather 
            name="bar-chart-2" 
            size={18} 
            color={activeSection === 'consolidado' ? "#6C5CE7" : "#8A94A6"} 
          />
          <Text style={[styles.tabText, activeSection === 'consolidado' && styles.activeTabText]}>
            Consolidados
          </Text>
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
                  {turmas.map((turma) => (
                    <Picker.Item key={turma.id} label={turma.nome} value={turma.id} />
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
                  {[...Array(12)].map((_, index) => {
                    const month = (index + 1).toString().padStart(2, "0");
                    const label = new Date(2025, index).toLocaleString("pt-BR", { month: "long" });
                    return (
                      <Picker.Item
                        key={month}
                        label={`${label.charAt(0).toUpperCase()}${label.slice(1)}`}
                        value={`2025-${month}`}
                      />
                    );
                  })}
                </Picker>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.reportsCard}>
          <View style={styles.cardHeader}>
            <Feather 
              name={activeSection === 'comum' ? "file-text" : "bar-chart-2"} 
              size={20} 
              color="#6C5CE7" 
            />
            <Text style={styles.cardTitle}>
              {activeSection === 'comum' ? 'Relatórios Comuns' : 'Relatórios Consolidados'}
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
                {activeSection === 'comum' 
                  ? "Tente ajustar os filtros ou criar um novo relatório"
                  : "Não há dados consolidados para os filtros selecionados"}
              </Text>
            </View>
          ) : (
            <FlatList<ListaRelatorioConsolidado>
              data={sortedRelatorios.filter(item => {
                if (activeSection === 'consolidado') {
                  return (
                    (item.totalPresentes ?? 0) > 0 ||
                    (item.totalBiblias ?? 0) > 0 ||
                    (item.totalOfertas ?? 0) > 0 ||
                    (item.totalRevistas ?? 0) > 0 ||
                    (item.totalVisitantes ?? 0) > 0 ||
                    (item.totalFaltas ?? 0) > 0
                  );
                }
                return true;
              })}
              keyExtractor={(item) => item.relatorioId.toString()}
              renderItem={({ item }) => (
  <TouchableOpacity
    style={styles.cardContainer}
    onPress={() => onPressRelatorio(item)} // passa o objeto inteiro
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
            {activeSection === 'comum' 
              ? "Os relatórios comuns mostram dados individuais de cada aula ministrada."
              : "Os relatórios consolidados apresentam dados agrupados e estatísticas gerais."}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
