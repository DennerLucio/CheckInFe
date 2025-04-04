import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  View,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import Checkbox from "expo-checkbox";
import { Picker } from "@react-native-picker/picker";
import { useRoute, RouteProp } from "@react-navigation/native";
import styles from "./StyleCadastrarRelatorio";
import { buscaProfessor } from "../../Services/PessoaService";
import { buscaAluno } from "../../Services/TurmaService";
import { cadastrarRelatorio } from "../../Services/RelatorioService";

interface Item {
  alunoId: number;
  name: string;
}

export function CadastrarRelatorio() {
  const route =
    useRoute<RouteProp<{ params: { turmaId: number } }, "params">>();
  const turmaId = route.params.turmaId;

  const [oferta, setOferta] = useState<string>("");
  const [visitantes, setVisitantes] = useState<string>("");
  const [biblias, setBiblias] = useState<string>("");
  const [revistas, setRevistas] = useState<string>("");
  const [obs, setObs] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<Record<number, boolean>>({});
  const [alunos, setAlunos] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [professorId, setProfessorId] = useState<number | null>(null);
  const [professores, setProfessores] = useState<{ id: number; nome: string }[]>([]);

  useEffect(() => {
    const fetchAlunosEProfessores = async () => {
      try {
        const alunosResponse = await buscaAluno(turmaId, 1, 10); 
        const alunosData = alunosResponse.flatMap((classe) => classe.alunos);

        setAlunos(
          alunosData.map((aluno) => ({
            alunoId: aluno.alunoId,
            name: aluno.nome,
          }))
        );

        const professoresResponse = await buscaProfessor();
        setProfessores(
          professoresResponse.map((professor) => ({
            id: professor.id,
            nome: professor.nome,
          }))
        );
      } catch (error) {
        Alert.alert(
          "Erro",
          "Não foi possível buscar os alunos ou professores."
        );
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchAlunosEProfessores();
  }, [turmaId]);

  const toggleCheckbox = (id: number) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSubmit = async () => {
    if (!oferta || !visitantes || !biblias || !revistas || !professorId) {
      Alert.alert(
        "Campos obrigatórios",
        "Por favor, preencha todos os campos obrigatórios."
      );
      return;
    }

    if (
      isNaN(parseFloat(oferta)) ||
      isNaN(parseInt(visitantes)) ||
      isNaN(parseInt(biblias)) ||
      isNaN(parseInt(revistas))
    ) {
      Alert.alert("Erro", "Por favor, insira valores numéricos válidos.");
      return;
    }

    const alunosPresentesIds = alunos
      .filter((aluno) => selectedItems[aluno.alunoId])
      .map((aluno) => aluno.alunoId);

    if (alunosPresentesIds.length === 0) {
      Alert.alert("Erro", "Selecione pelo menos um aluno presente.");
      return;
    }

    setLoading(true);

    try {
      await cadastrarRelatorio(
        obs,
        parseFloat(oferta),
        professorId,
        parseInt(biblias),
        parseInt(revistas),
        parseInt(visitantes),
        turmaId,
        alunosPresentesIds
      );
      Alert.alert("Sucesso", "Relatório cadastrado com sucesso");

      setOferta("");
      setVisitantes("");
      setBiblias("");
      setRevistas("");
      setObs("");
      setSelectedItems({});
      setProfessorId(null);
    } catch (error) {
      Alert.alert("Erro", "Erro ao cadastrar o relatório.");
      console.error("Erro ao cadastrar relatório:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem: ListRenderItem<Item> = ({ item }) => (
    <View style={styles.studentItem}>
      <Checkbox
        style={styles.checkbox}
        value={!!selectedItems[item.alunoId]}
        onValueChange={() => toggleCheckbox(item.alunoId)}
        color={selectedItems[item.alunoId] ? "#6C5CE7" : undefined}
      />
      <Text style={styles.studentName}>{item.name}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cadastrar Relatório</Text>
          <Text style={styles.headerSubtitle}>Preencha os dados da aula</Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Informações Gerais</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ofertas (R$):</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Ex: 100.50"
                value={oferta}
                onChangeText={setOferta}
                placeholderTextColor="#8A94A6"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Visitantes:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Ex: 5"
                value={visitantes}
                onChangeText={setVisitantes}
                placeholderTextColor="#8A94A6"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bíblias:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Ex: 3"
                value={biblias}
                onChangeText={setBiblias}
                placeholderTextColor="#8A94A6"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Revistas:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Ex: 2"
                value={revistas}
                onChangeText={setRevistas}
                placeholderTextColor="#8A94A6"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Professor:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={professorId}
                  style={styles.picker}
                  onValueChange={(itemValue) => setProfessorId(itemValue)}
                >
                  <Picker.Item label="Selecione" value={null} />
                  {professores.map((professor) => (
                    <Picker.Item
                      key={professor.id}
                      label={professor.nome}
                      value={professor.id}
                    />
                  ))}
                </Picker>
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Observações:</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Digite observações adicionais"
                multiline
                numberOfLines={4}
                value={obs}
                onChangeText={setObs}
                placeholderTextColor="#8A94A6"
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>

        <View style={styles.studentsCard}>
          <Text style={styles.sectionTitle}>Alunos Presentes</Text>
          
          {alunos.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Nenhum aluno encontrado.</Text>
            </View>
          ) : (
            <FlatList
              data={alunos}
              renderItem={renderItem}
              keyExtractor={(item) => item.alunoId.toString()}
              style={styles.studentsList}
              scrollEnabled={false}
            />
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            (loading || alunos.length === 0) && styles.disabledButton
          ]}
          onPress={handleSubmit}
          disabled={loading || alunos.length === 0}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitButtonText}>Enviar Relatório</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}