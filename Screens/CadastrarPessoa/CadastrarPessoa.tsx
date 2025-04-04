import React, { useState, useEffect } from "react";
import { 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import styles from "./StyleCadastrarPessoa";
import { Picker } from "@react-native-picker/picker";
import { buscaTurmas, GetTurmaResponse } from "../../Services/TurmaService";
import { cadastraAluno, cadastraProfessor } from "../../Services/PessoaService";

export interface Turma {
  id: number;
  nome: string;
}

export function CadastrarPessoa() {
  const [nome, setNome] = useState<string>("");
  const [pessoa, setPessoa] = useState<string>("Aluno");
  const [selectedTurma, setSelectedTurma] = useState<number>(1);
  const [turma, setTurma] = useState<Turma[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const btnCadastrar = async () => {
    if (!nome.trim()) {
      Alert.alert("Erro", "O campo Nome é obrigatório.");
      return;
    }

    setLoading(true); 
    try {
      let response;
      if (pessoa === "Aluno") {
        response = await cadastraAluno(nome, selectedTurma);
      } else {
        response = await cadastraProfessor(nome, selectedTurma);
      }

      if (response.success) {
        Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
        setNome("");
      } else {
        Alert.alert("Erro", "Não foi possível cadastrar a pessoa.");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível cadastrar a pessoa.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleBuscaTurmas = async () => {
      try {
        const response: GetTurmaResponse = await buscaTurmas();
        const formattedTurma: Turma[] = response.map((turma) => ({
          id: turma.id,
          nome: turma.nome,
        }));

        setTurma(formattedTurma);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar as turmas.");
      }
    };

    handleBuscaTurmas();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cadastrar Pessoa</Text>
          <Text style={styles.headerSubtitle}>
            Adicione um novo aluno ou professor à turma
          </Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome completo"
              placeholderTextColor="#8A94A6"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Tipo</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={pessoa}
                style={styles.picker}
                onValueChange={(itemValue: string) => setPessoa(itemValue)}
              >
                <Picker.Item label="Aluno" value="Aluno" />
                <Picker.Item label="Professor" value="Professor" />
              </Picker>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Turma</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedTurma}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedTurma(Number(itemValue))}
              >
                {turma.length > 0 ? (
                  turma.map((turma) => (
                    <Picker.Item key={turma.id} label={turma.nome} value={turma.id} />
                  ))
                ) : (
                  <Picker.Item label="Carregando turmas..." value={1} />
                )}
              </Picker>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.disabledButton]} 
            onPress={btnCadastrar} 
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>
                {pessoa === "Aluno" ? "Cadastrar Aluno" : "Cadastrar Professor"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}