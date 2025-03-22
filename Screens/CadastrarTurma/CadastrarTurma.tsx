import React, { useState, useEffect } from "react";
import { Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from "react-native";
import { cadastrarClasse, excluirClasse, buscaTurmas } from "../../Services/TurmaService";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { Picker } from "@react-native-picker/picker"; // Importar o Picker para o dropdown
import styles from "../CadastrarTurma/StyleCadastrarTurma";


export function CadastrarTurma() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [nome, setNome] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [turmas, setTurmas] = useState<{ id: number; nome: string }[]>([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState<number | undefined>(undefined); // Variável para turma selecionada para exclusão

  const btnCadastrar = async () => {
    if (!nome.trim()) {
      Alert.alert("Erro", "O campo Nome é obrigatório.");
      return;
    }

    setLoading(true);
    try {
      await cadastrarClasse(nome);
      Alert.alert("Sucesso", "Turma cadastrada com sucesso!");
      setNome(""); // Limpa o campo de nome
      carregarTurmas(); // Atualiza a lista de turmas
    } catch (error) {
      Alert.alert("Erro", "Não foi possível cadastrar a turma.");
    } finally {
      setLoading(false);
    }
  };

  // Função para excluir uma turma
  const btnExcluir = async () => {
    if (turmaSelecionada === undefined) {
      Alert.alert("Erro", "Selecione uma turma para excluir.");
      return;
    }

    setLoading(true);
    try {
      await excluirClasse(turmaSelecionada);
      Alert.alert("Sucesso", "Turma excluída com sucesso!");
      setTurmaSelecionada(undefined); // Limpa a seleção
      carregarTurmas(); // Atualiza a lista de turmas
    } catch (error) {
      Alert.alert("Erro", "Não foi possível excluir a turma.");
    } finally {
      setLoading(false);
    }
  };

  // Função para carregar as turmas
  const carregarTurmas = async () => {
    try {
      const response = await buscaTurmas();
      const turmasFormatadas = response.map((turma) => ({
        id: turma.id,
        nome: turma.nome,
      }));
      setTurmas(turmasFormatadas);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as turmas.");
    }
  };

  // Carrega as turmas quando o componente é montado
  useEffect(() => {
    carregarTurmas();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.textTitulo}>Cadastrar Nova Turma</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome da Turma"
        value={nome}
        onChangeText={setNome}
      />

      <TouchableOpacity style={styles.button} onPress={btnCadastrar} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
      </TouchableOpacity>

      <Text style={styles.textTitulo}>Excluir Turma</Text>

      <Picker
        selectedValue={turmaSelecionada}
        onValueChange={(itemValue) => setTurmaSelecionada(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione uma turma" value={undefined} />
        {turmas.map((turma) => (
          <Picker.Item key={turma.id} label={turma.nome} value={turma.id} />
        ))}
      </Picker>

      <TouchableOpacity style={styles.button} onPress={btnExcluir} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Excluir Turma</Text>}
      </TouchableOpacity>
    </View>
  );
}
