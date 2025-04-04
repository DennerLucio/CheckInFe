import React from "react";
import { Text, View, FlatList, TouchableOpacity } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import styles from './StyleCard';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

interface ContentItem {
  id: number;
  nome: string;
}

interface ContentListProps {
  data: ContentItem[];
}

export function ContentTurmaList({ data }: ContentListProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const NavigateCardTurma = (id: number) => {
    navigation.navigate('CadastrarRelatorio', { turmaId: id });
  };

  const renderItem = ({ item, index }: { item: ContentItem, index: number }) => {
    // Definindo as cores como tuplas fixas, não como arrays
    const gradientColors = index % 2 === 0 
      ? ['#6C5CE7', '#8E74FF'] as const  // usando 'as const' para criar uma tupla readonly
      : ['#7F7FD5', '#91A1FF'] as const; // usando 'as const' para criar uma tupla readonly
      
    return (
      <TouchableOpacity 
        style={styles.cardWrapper}
        onPress={() => NavigateCardTurma(item.id)}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={gradientColors}
          style={styles.container}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>{item.nome.charAt(0)}</Text>
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.txtTituloTurma}>{item.nome}</Text>
            <Text style={styles.subtitleText}>Toque para criar relatório</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.listContainer}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

export default ContentTurmaList;