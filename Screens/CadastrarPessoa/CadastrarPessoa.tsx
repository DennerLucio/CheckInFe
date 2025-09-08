import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView
} from "react-native";
import styles from "./StyleCadastrarPessoa";
import { Picker } from "@react-native-picker/picker";
import { buscaTurmas, GetTurmaResponse } from "../../Services/TurmaService";
import {
  cadastraAluno,
  cadastraProfessor,
  deletaAluno,
  deletaProfessor,
} from "../../Services/PessoaService";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from '@expo/vector-icons';

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
  const [idParaExcluir, setIdParaExcluir] = useState<string>("");
  const [activeSection, setActiveSection] = useState<'cadastrar' | 'excluir'>('cadastrar');

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
      } else {
        Alert.alert("Erro", `Não foi possível cadastrar o ${pessoa.toLowerCase()}.`);
      }
    } catch (error) {
      Alert.alert("Erro", `Não foi possível cadastrar o ${pessoa.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  };

  const btnDeletar = async () => {
    const id = parseInt(idParaExcluir);
    if (isNaN(id)) {
      Alert.alert("Atenção", "Digite um ID válido para exclusão.");
      return;
    }

    Alert.alert(
      "Confirmar exclusão",
      `Tem certeza que deseja excluir o ${pessoa.toLowerCase()} com ID ${id}? Esta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              if (pessoa === "Aluno") {
                await deletaAluno(id, selectedTurma);
              } else {
                await deletaProfessor(id);
              }
              Alert.alert("Sucesso", `${pessoa} excluído com sucesso!`);
              setIdParaExcluir("");
            } catch (error) {
              Alert.alert("Erro", `Não foi possível excluir o ${pessoa.toLowerCase()}.`);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const carregarTurmas = async () => {
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

  useFocusEffect(
    useCallback(() => {
      carregarTurmas();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gerenciar Pessoas</Text>
        <Text style={styles.headerSubtitle}>Cadastre ou exclua alunos e professores</Text>
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeSection === 'cadastrar' && styles.activeTab]}
          onPress={() => setActiveSection('cadastrar')}
        >
          <Feather 
            name="plus-circle" 
            size={18} 
            color={activeSection === 'cadastrar' ? "#6C5CE7" : "#8A94A6"} 
          />
          <Text style={[styles.tabText, activeSection === 'cadastrar' && styles.activeTabText]}>
            Cadastrar
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeSection === 'excluir' && styles.activeTab]}
          onPress={() => setActiveSection('excluir')}
        >
          <Feather 
            name="trash-2" 
            size={18} 
            color={activeSection === 'excluir' ? "#FF6B6B" : "#8A94A6"} 
          />
          <Text style={[styles.tabText, activeSection === 'excluir' && styles.activeTabText]}>
            Excluir
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeSection === 'cadastrar' ? (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Feather name={pessoa === "Aluno" ? "users" : "user"} size={22} color="#6C5CE7" />
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
                  onValueChange={(itemValue: string) => setPessoa(itemValue)}
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
              style={[styles.button, styles.primaryButton]} 
              onPress={btnCadastrar} 
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Feather name="check-circle" size={18} color="#FFFFFF" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>
                    {pessoa === "Aluno" ? "Cadastrar Aluno" : "Cadastrar Professor"}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Feather name="trash-2" size={22} color="#FF6B6B" />
              <Text style={[styles.cardTitle, {color: "#FF6B6B"}]}>
                Excluir {pessoa}
              </Text>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Tipo</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={pessoa}
                  style={styles.picker}
                  onValueChange={(itemValue: string) => setPessoa(itemValue)}
                  dropdownIconColor="#6C5CE7"
                >
                  <Picker.Item label="Aluno" value="Aluno" />
                  <Picker.Item label="Professor" value="Professor" />
                </Picker>
              </View>
            </View>
            
            {pessoa === "Aluno" && (
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
                      turma.map((turma) => (
                        <Picker.Item key={turma.id} label={turma.nome} value={turma.id} />
                      ))
                    ) : (
                      <Picker.Item label="Carregando turmas..." value={1} />
                    )}
                  </Picker>
                </View>
              </View>
            )}
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>ID para Exclusão</Text>
              <TextInput
                style={styles.input}
                placeholder={`Digite o ID do ${pessoa.toLowerCase()}`}
                placeholderTextColor="#8A94A6"
                keyboardType="numeric"
                value={idParaExcluir}
                onChangeText={setIdParaExcluir}
              />
            </View>

            <TouchableOpacity 
              style={[styles.button, styles.dangerButton]} 
              onPress={btnDeletar} 
              disabled={loading || !idParaExcluir}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Feather name="trash" size={18} color="#FFFFFF" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>
                    Excluir {pessoa}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
        
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