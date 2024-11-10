import React, { useState, useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  
} from "react-native";
import styles from "../Turma/StyleTurma";
import { ContentTurmaList } from '../Card/TurmaList'
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { buscaTurmas, GetTurmaResponse } from '../../Services/TurmaService';

export interface Turma {
  id: number;
  nome: string;
 
}

export function Turma() {  
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  
  const [turma, setTurma] = useState<Turma[]>([]);

  const btnRelatorios = async () => {
   
      navigation.navigate('Relatorios');
  };

  const btnPessoas = async () => {
   
    navigation.navigate('CadastrarPessoa');
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
        
    }
  };
  

  handleBuscaTurmas();
}, []);


  return (
    <View style={styles.container}>
        <ContentTurmaList data={turma} />

        <TouchableOpacity
            style={styles.button}
            onPress={() => btnRelatorios()}
          >
            <Text style={styles.buttonText}>Relatórios</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => btnPessoas()}
          >
            <Text style={styles.buttonText}>Cadastrar Pessoa</Text>
          </TouchableOpacity>
    </View>
  );
}