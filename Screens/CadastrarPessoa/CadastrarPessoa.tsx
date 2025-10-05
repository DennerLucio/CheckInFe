import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from "react-native";
import styles from "./StyleCadastrarPessoa";
import { Picker } from "@react-native-picker/picker";
import { buscaTurmas, GetTurmaResponse } from "../../Services/TurmaService";
import {
  cadastraAluno,
  cadastraProfessor,
  deletaAluno,
  deletaProfessor,
  buscaAlunos,
  Aluno,
  ProfessorResponse,
  buscaProfessor,
} from "../../Services/PessoaService";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

export interface Turma {
  id: number;
  nome: string;
}

export function CadastrarPessoa() {
  const [nome, setNome] = useState<string>("");
  const [pessoa, setPessoa] = useState<"Aluno" | "Professor">("Aluno");
  const [selectedTurma, setSelectedTurma] = useState<number>(1);
  const [turma, setTurma] = useState<Turma[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Exclusão
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [professores, setProfessores] = useState<ProfessorResponse[]>([]);
  const [selectedPessoaId, setSelectedPessoaId] = useState<number | null>(null);

  const [activeSection, setActiveSection] = useState<"cadastrar" | "excluir">(
    "cadastrar"
  );

  // Carregar turmas
  const carregarTurmas = async () => {
    try {
      const response: GetTurmaResponse = await buscaTurmas();
      const formattedTurma: Turma[] = response.map((t) => ({
        id: t.id,
        nome: t.nome,
      }));
      setTurma(formattedTurma);
      if (formattedTurma.length > 0) setSelectedTurma(formattedTurma[0].id);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as turmas.");
    }
  };

  // Carregar alunos ou professores para exclusão
  const carregarPessoas = async () => {
    try {
      if (pessoa === "Aluno") {
        const response = await buscaAlunos(selectedTurma);
        setAlunos(response);
        setSelectedPessoaId(response.length > 0 ? response[0].id : null);
      } else {
        const response = await buscaProfessor();
        setProfessores(response);
        setSelectedPessoaId(response.length > 0 ? response[0].id : null);
      }
    } catch (error) {
      Alert.alert("Erro", `Não foi possível carregar ${pessoa.toLowerCase()}s.`);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarTurmas();
    }, [])
  );

  // Atualiza lista de pessoas ao mudar tipo ou turma
  useEffect(() => {
    carregarPessoas();
  }, [pessoa, selectedTurma]);

  // Cadastrar pessoa
  const btnCadastrar = async () => {
    if (!nome.trim()) {
      Alert.alert("Atenção", "O campo Nome é obrigatório.");
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
        Alert.alert("Sucesso", `${pessoa} cadastrado com sucesso!`);
        setNome("");
        carregarPessoas();
      } else {
        Alert.alert("Erro", `Não foi possível cadastrar o ${pessoa.toLowerCase()}.`);
      }
    } catch (error) {
      Alert.alert("Erro", `Não foi possível cadastrar o ${pessoa.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  };

  // Excluir pessoa
  const btnDeletar = async () => {
    if (!selectedPessoaId) {
      Alert.alert("Atenção", `Selecione um ${pessoa.toLowerCase()} para excluir.`);
      return;
    }

    Alert.alert(
      "Confirmar exclusão",
      `Tem certeza que deseja excluir o ${pessoa.toLowerCase()} selecionado? Esta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              if (pessoa === "Aluno") {
                await deletaAluno(selectedPessoaId, selectedTurma);
              } else {
                await deletaProfessor(selectedPessoaId);
              }
              Alert.alert("Sucesso", `${pessoa} excluído com sucesso!`);
              carregarPessoas();
            } catch (error) {
              Alert.alert(
                "Erro",
                `Não foi possível excluir o ${pessoa.toLowerCase()}.`
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gerenciar Pessoas</Text>
        <Text style={styles.headerSubtitle}>
          Cadastre ou exclua alunos e professores
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeSection === "cadastrar" && styles.activeTab]}
          onPress={() => setActiveSection("cadastrar")}
        >
          <Feather
            name="plus-circle"
            size={18}
            color={activeSection === "cadastrar" ? "#6C5CE7" : "#8A94A6"}
          />
          <Text
            style={[
              styles.tabText,
              activeSection === "cadastrar" && styles.activeTabText,
            ]}
          >
            Cadastrar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeSection === "excluir" && styles.activeTab]}
          onPress={() => setActiveSection("excluir")}
        >
          <Feather
            name="trash-2"
            size={18}
            color={activeSection === "excluir" ? "#FF6B6B" : "#8A94A6"}
          />
          <Text
            style={[
              styles.tabText,
              activeSection === "excluir" && styles.activeTabText,
            ]}
          >
            Excluir
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeSection === "cadastrar" ? (
          // === Cadastrar ===
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Feather
                name={pessoa === "Aluno" ? "users" : "user"}
                size={22}
                color="#6C5CE7"
              />
              <Text style={styles.cardTitle}>
                {pessoa === "Aluno" ? "Novo Aluno" : "Novo Professor"}
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nome</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite o nome completo"
                placeholderTextColor="#8A94A6"
                value={nome}
                onChangeText={setNome}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Tipo</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={pessoa}
                  style={styles.picker}
                  onValueChange={(itemValue: "Aluno" | "Professor") =>
                    setPessoa(itemValue)
                  }
                  dropdownIconColor="#6C5CE7"
                >
                  <Picker.Item label="Aluno" value="Aluno" />
                  <Picker.Item label="Professor" value="Professor" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Turma</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedTurma}
                  style={styles.picker}
                  onValueChange={(itemValue) => setSelectedTurma(Number(itemValue))}
                  dropdownIconColor="#6C5CE7"
                >
                  {turma.length > 0 ? (
                    turma.map((t) => (
                      <Picker.Item key={t.id} label={t.nome} value={t.id} />
                    ))
                  ) : (
                    <Picker.Item label="Carregando turmas..." value={1} />
                  )}
                </Picker>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={btnCadastrar}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Feather
                    name="check-circle"
                    size={18}
                    color="#FFFFFF"
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>
                    {pessoa === "Aluno" ? "Cadastrar Aluno" : "Cadastrar Professor"}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          // === Excluir ===
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Feather name="trash-2" size={22} color="#FF6B6B" />
              <Text style={[styles.cardTitle, { color: "#FF6B6B" }]}>
                Excluir {pessoa}
              </Text>
            </View>

            {/* Tipo */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Tipo</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={pessoa}
                  style={styles.picker}
                  onValueChange={(itemValue: "Aluno" | "Professor") =>
                    setPessoa(itemValue)
                  }
                  dropdownIconColor="#6C5CE7"
                >
                  <Picker.Item label="Aluno" value="Aluno" />
                  <Picker.Item label="Professor" value="Professor" />
                </Picker>
              </View>
            </View>

            {/* Turma (apenas alunos) */}
            {pessoa === "Aluno" && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Turma</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedTurma}
                    style={styles.picker}
                    onValueChange={(itemValue) =>
                      setSelectedTurma(Number(itemValue))
                    }
                    dropdownIconColor="#6C5CE7"
                  >
                    {turma.map((t) => (
                      <Picker.Item key={t.id} label={t.nome} value={t.id} />
                    ))}
                  </Picker>
                </View>
              </View>
            )}

            {/* Seleção de pessoa */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{pessoa} para Excluir</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedPessoaId}
                  style={styles.picker}
                  onValueChange={(itemValue) => setSelectedPessoaId(Number(itemValue))}
                  dropdownIconColor="#FF6B6B"
                >
                  {pessoa === "Aluno"
                    ? alunos.map((a) => (
                        <Picker.Item key={a.id} label={a.nome} value={a.id} />
                      ))
                    : professores.map((p) => (
                        <Picker.Item key={p.id} label={p.nome} value={p.id} />
                      ))}
                </Picker>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.button, styles.dangerButton]}
              onPress={btnDeletar}
              disabled={loading || !selectedPessoaId}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Feather
                    name="trash"
                    size={18}
                    color="#FFFFFF"
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>Excluir {pessoa}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Info */}
        <View style={styles.infoCard}>
          <Feather name="info" size={20} color="#6C5CE7" />
          <Text style={styles.infoText}>
            {pessoa === "Aluno"
              ? "Os alunos são associados a uma turma e podem ser marcados como presentes nos relatórios."
              : "Os professores são responsáveis por ministrar as aulas e preencher os relatórios."}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
