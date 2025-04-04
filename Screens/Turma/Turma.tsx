import React, { useState, useCallback } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  StatusBar
} from "react-native";
import { useFocusEffect, useNavigation, NavigationProp } from '@react-navigation/native';
import styles from "../Turma/StyleTurma";
import { ContentTurmaList } from '../Card/TurmaList';
import { RootStackParamList } from '../../App';
import { buscaTurmas, GetTurmaResponse } from '../../Services/TurmaService';

export interface Turma {
  id: number;
  nome: string;
}

export function Turma() {  
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [turma, setTurma] = useState<Turma[]>([]);

  useFocusEffect(
    useCallback(() => {
      const handleBuscaTurmas = async () => {
        try {
          const response: GetTurmaResponse = await buscaTurmas();
          const formattedTurma: Turma[] = response.map((turma) => ({
            id: turma.id,
            nome: turma.nome,
          }));
          setTurma(formattedTurma);
        } catch (error) {
          console.error('Erro ao buscar turmas:', error);
        }
      };

      handleBuscaTurmas();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#F5F7FF" barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Turmas</Text>
        <Text style={styles.headerSubtitle}>Selecione uma turma para criar relatório</Text>
      </View>
      
      <View style={styles.container}>
        <ContentTurmaList data={turma} />
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.button, styles.reportButton]} 
          onPress={() => navigation.navigate('Relatorios')}
        >
          <Text style={styles.buttonText}>Relatórios</Text>
        </TouchableOpacity>

        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={() => navigation.navigate('CadastrarPessoa')}
          >
            <Text style={styles.buttonText}>Cadastrar Pessoa</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={() => navigation.navigate('CadastrarTurma')}
          >
            <Text style={styles.buttonText}>Cadastrar Turma</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
