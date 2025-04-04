import React, { useEffect, useState } from "react";
import { 
  Text, 
  View, 
  FlatList, 
  ActivityIndicator, 
  Alert, 
  TouchableOpacity 
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import styles from "./StyleRelatorio";
import { CardRelatorio } from "../../components/CardRelatorio/CardRelatorio";
import { ListaRelatorioResponse, listarRelatorios } from "../../Services/RelatorioService";
import { buscaTurmas, GetTurmaResponse } from "../../Services/TurmaService";
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

export function Relatorios() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [selectedTurma, setSelectedTurma] = useState<number | undefined>(undefined);
  const [selectedData, setSelectedData] = useState("Selecione");
  const [relatorios, setRelatorios] = useState<ListaRelatorioResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [turmas, setTurmas] = useState<{ id: number; nome: string }[]>([]);

  const fetchRelatorios = async (params: { classeId?: number; startDate?: string; endDate?: string } = {}) => {
    setLoading(true);
    try {
      const data = await listarRelatorios(params);
      setRelatorios(data);
    } catch (error) {
      console.error("Erro ao buscar relatórios:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTurmas = async () => {
    try {
      const response: GetTurmaResponse = await buscaTurmas();
      const formattedTurmas = response.map((turma) => ({
        id: turma.id,
        nome: turma.nome,
      }));
      setTurmas(formattedTurmas);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as turmas.");
    }
  };

  useEffect(() => {
    fetchTurmas();
    fetchRelatorios();
  }, []);

  useEffect(() => {
    let params: { classeId?: number; startDate?: string; endDate?: string } = {};

    if (selectedData !== "Selecione") {
      const [year, month] = selectedData.split("-");
      const lastDay = new Date(Number(year), Number(month), 0).getDate();
      params.startDate = `${selectedData}-01`;
      params.endDate = `${selectedData}-${lastDay}`;
    }

    if (selectedTurma !== undefined) {
      params.classeId = selectedTurma;
    }

    fetchRelatorios(params);
  }, [selectedTurma, selectedData]);

  const onPressRelatorio = (relatorioId: number) => {
    navigation.navigate('DetalhesRelatorio', { relatorioId });
  };
  
  const sortedRelatorios = relatorios.sort((a, b) => Number(b.relatorioId) - Number(a.relatorioId));
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Relatórios</Text>
        <Text style={styles.headerSubtitle}>Visualize e filtre os relatórios</Text>
      </View>
      
      <View style={styles.filterContainer}>
        <View style={styles.filterRow}>
          <View style={styles.filterColumn}>
            <Text style={styles.filterLabel}>Turma</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedTurma}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedTurma(itemValue === undefined ? undefined : Number(itemValue))}
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
              >
                <Picker.Item label="Todos" value="Selecione" />
                {[...Array(12)].map((_, index) => {
                  const month = (index + 1).toString().padStart(2, "0");
                  return (
                    <Picker.Item 
                      key={month} 
                      label={new Date(2024, index).toLocaleString('pt-BR', { month: 'long' })} 
                      value={`2024-${month}`} 
                    />
                  );
                })}
              </Picker>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.contentContainer}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#6C5CE7" />
          </View>
        ) : sortedRelatorios.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum relatório encontrado</Text>
            <Text style={styles.emptySubtext}>Tente ajustar os filtros ou criar um novo relatório</Text>
          </View>
        ) : (
          <FlatList
            data={sortedRelatorios}
            keyExtractor={(item) => item.relatorioId.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.cardContainer}
                onPress={() => onPressRelatorio(item.relatorioId)}
              >
                <CardRelatorio relatorio={item} />
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}
