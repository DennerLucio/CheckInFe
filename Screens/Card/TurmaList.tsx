import React from "react";
import { Text, View, FlatList, TouchableOpacity } from "react-native";
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

  const renderItem = ({ item }: { item: ContentItem }) => (
    <TouchableOpacity onPress={() => NavigateCardTurma(item.id)}>
      <View style={styles.container}>
        <Text style={styles.txtTituloTurma}>{item.nome}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContent}
      style={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
}

export default ContentTurmaList;
