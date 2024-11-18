import React, { useEffect, useState } from "react";
import { Text, View, FlatList, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import styles from "./StyleRelatorio";
import { CardRelatorio } from "../../components/CardRelatorio/CardRelatorio";
import { ListaRelatorioResponse, listarRelatorios } from "../../Services/RelatorioService";
import { buscaTurmas, GetTurmaResponse } from "../../Services/TurmaService";
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App'; 


export function Relatorios() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [selectedTurma, setSelectedTurma] = useState<number | undefined>(undefined);
    const [selectedData, setSelectedData] = useState("Selecione");
    const [relatorios, setRelatorios] = useState<ListaRelatorioResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [turmas, setTurmas] = useState<{ id: number; nome: string }[]>([]);

    const fetchRelatorios = async (params: { classeId?: number; data?: string } = {}) => {
        setLoading(true);
        try {
            const data = await listarRelatorios(params);
            setRelatorios(data);
        } catch (error) {
            console.error("Erro ao buscar relatórios:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTurmas = async () => {
        try {
            const response: GetTurmaResponse = await buscaTurmas();
            const formattedTurmas = response.map((turma) => ({
                id: turma.id,
                nome: turma.nome,
            }));
            setTurmas(formattedTurmas);
        } catch (error) {
            Alert.alert("Erro", "Não foi possível carregar as turmas.");
        }
    };

    useEffect(() => {
        fetchTurmas();
        fetchRelatorios();
    }, []);

    useEffect(() => {
        if (selectedTurma || selectedData !== "Selecione") {
            fetchRelatorios({
                classeId: selectedTurma,
                data: selectedData !== "Selecione" ? selectedData : undefined,
            });
        }
    }, [selectedTurma, selectedData]);

    const onPressRelatorio = (relatorioId: number) => {
        navigation.navigate('DetalhesRelatorio', { relatorioId });
    };
    
    const sortedRelatorios = relatorios.sort((a, b) => b.relatorioId - a.relatorioId);

    return (
        <View style={styles.container}>
            <View>
                <Text>Turma:</Text>
                <Picker
                    selectedValue={selectedTurma}
                    style={{ height: 50, width: 150 }}
                    onValueChange={(itemValue) => setSelectedTurma(Number(itemValue))}
                >
                    <Picker.Item label="Selecione" value={undefined} />
                    {turmas.map((turma) => (
                        <Picker.Item key={turma.id} label={turma.nome} value={turma.id} />
                    ))}
                </Picker>

                <Text>Data:</Text>
                <Picker
                    selectedValue={selectedData}
                    style={{ height: 50, width: 150 }}
                    onValueChange={(itemValue) => setSelectedData(itemValue)}
                >
                    <Picker.Item label="Selecione" value="Selecione" />
                    <Picker.Item label="Janeiro" value="2024-01-01" />
                    <Picker.Item label="Fevereiro" value="2024-02-01" />
                    <Picker.Item label="Março" value="2024-03-01" />
                    <Picker.Item label="Abril" value="2024-04-01" />
                    <Picker.Item label="Maio" value="2024-05-01" />
                    <Picker.Item label="Junho" value="2024-06-01" />
                    <Picker.Item label="Julho" value="2024-07-01" />
                    <Picker.Item label="Agosto" value="2024-08-01" />
                    <Picker.Item label="Setembro" value="2024-09-01" />
                    <Picker.Item label="Outubro" value="2024-10-01" />
                    <Picker.Item label="Novembro" value="2024-11-01" />
                    <Picker.Item label="Dezembro" value="2024-12-01" />
                    
                </Picker>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={sortedRelatorios}
                    keyExtractor={(item) => item.relatorioId.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => onPressRelatorio(item.relatorioId)}>
                            <CardRelatorio relatorio={item} />
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};
