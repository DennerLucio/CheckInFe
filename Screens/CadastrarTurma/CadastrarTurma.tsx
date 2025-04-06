import React, { useState, useEffect } from "react";
import { 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  Alert, 
  ActivityIndicator,
  ScrollView,
  SafeAreaView
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { cadastrarClasse, excluirClasse, buscaTurmas } from "../../Services/TurmaService";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { Picker } from "@react-native-picker/picker";
import { Feather } from '@expo/vector-icons';
import styles from "./StyleCadastrarTurma";

export function CadastrarTurma() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [nome, setNome] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [turmas, setTurmas] = useState<{ id: number; nome: string }[]>([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState<number | undefined>(undefined);
  const [activeSection, setActiveSection] = useState<'cadastrar' | 'excluir'>('cadastrar');

  const btnCadastrar = async () => {
    if (!nome.trim()) {
      Alert.alert("Atenção", "O campo Nome é obrigatório.");
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
      Alert.alert("Atenção", "Selecione uma turma para excluir.");
      return;
    }

    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta turma? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive",
          onPress: async () => {
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
          }
        }
      ]
    );
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gerenciar Turmas</Text>
        <Text style={styles.headerSubtitle}>Cadastre ou Exclua uma Turma</Text>
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
        
        {activeSection === 'cadastrar' ? (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Feather name="users" size={22} color="#6C5CE7" />
              <Text style={styles.cardTitle}>Nova Turma</Text>
            </View>
            
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
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Feather name="check-circle" size={18} color="#FFFFFF" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Cadastrar Turma</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Feather name="trash-2" size={22} color="#FF6B6B" />
              <Text style={[styles.cardTitle, {color: "#FF6B6B"}]}>Excluir Turma</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Selecione a Turma</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={turmaSelecionada}
                  onValueChange={(itemValue) => setTurmaSelecionada(itemValue)}
                  style={styles.picker}
                  dropdownIconColor="#6C5CE7"
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
              disabled={loading || turmaSelecionada === undefined}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Feather name="trash" size={18} color="#FFFFFF" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Excluir Turma</Text>
                </>
              )}
            </TouchableOpacity>
            
            {turmas.length === 0 && (
              <View style={styles.emptyState}>
                <Feather name="info" size={20} color="#8A94A6" />
                <Text style={styles.emptyStateText}>Nenhuma turma disponível para exclusão</Text>
              </View>
            )}
          </View>
        )}
        
        <View style={styles.infoCard}>
          <Feather name="info" size={20} color="#6C5CE7" />
          <Text style={styles.infoText}>
            As turmas são utilizadas para organizar alunos e relatórios no sistema.
          </Text>
        </View>
    </SafeAreaView>
  );
}