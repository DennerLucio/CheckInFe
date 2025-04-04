import React, { useState, useEffect } from "react";
import { 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  Alert, 
  ActivityIndicator 
} from "react-native";
import { cadastrarClasse, excluirClasse, buscaTurmas } from "../../Services/TurmaService";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { Picker } from "@react-native-picker/picker";
import styles from "../CadastrarTurma/StyleCadastrarTurma";

export function CadastrarTurma() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [nome, setNome] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [turmas, setTurmas] = useState<{ id: number; nome: string }[]>([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState<number | undefined>(undefined);

  const btnCadastrar = async () => {
    if (!nome.trim()) {
      Alert.alert("Erro", "O campo Nome é obrigatório.");
      return;
    }

    setLoading(true);
    try {
      await cadastrarClasse(nome);
      Alert.alert("Sucesso", "Turma cadastrada com sucesso!");
      setNome("");
      carregarTurmas();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível cadastrar a turma.");
    } finally {
      setLoading(false);
    }
  };

  const btnExcluir = async () => {
    if (turmaSelecionada === undefined) {
      Alert.alert("Erro", "Selecione uma turma para excluir.");
      return;
    }

    setLoading(true);
    try {
      await excluirClasse(turmaSelecionada);
      Alert.alert("Sucesso", "Turma excluída com sucesso!");
      setTurmaSelecionada(undefined);
      carregarTurmas();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível excluir a turma.");
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    carregarTurmas();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.textTitulo}>Cadastrar Nova Turma</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Nome da Turma</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome da turma"
            placeholderTextColor="#8A94A6"
            value={nome}
            onChangeText={setNome}
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]} 
          onPress={btnCadastrar} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Cadastrar</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.textTitulo}>Excluir Turma</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Selecione a Turma</Text>
          <View style={styles.pickerContainer}>
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
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.button, styles.dangerButton]} 
          onPress={btnExcluir} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Excluir Turma</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}