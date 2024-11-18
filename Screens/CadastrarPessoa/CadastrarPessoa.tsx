import React, { useState, useEffect } from "react";
import { Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from "react-native";
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
    <View style={styles.container}>
      <Text style={styles.textTitulo}>Cadastrar Aluno ou Professor:</Text>
      <TextInput
        style={styles.inputNome}
        placeholder="Nome"
        keyboardType="default"
        autoCapitalize="none"
        value={nome}
        onChangeText={setNome}
      />

      <Picker
        selectedValue={selectedTurma}
        style={styles.inputComboBoxCadastarPessoa}
        onValueChange={(itemValue) => setSelectedTurma(Number(itemValue))}
      >
        {turma.map((turma) => (
          <Picker.Item key={turma.id} label={turma.nome} value={turma.id} />
        ))}
      </Picker>

      <Picker
        selectedValue={pessoa}
        style={styles.inputComboBoxCadastarPessoa}
        onValueChange={(itemValue: string) => setPessoa(itemValue)}
      >
        <Picker.Item label="Aluno" value="Aluno" />
        <Picker.Item label="Professor" value="Professor" />
      </Picker>

      <TouchableOpacity style={styles.btnSubmit} onPress={btnCadastrar} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnSubmitText}>Enviar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
