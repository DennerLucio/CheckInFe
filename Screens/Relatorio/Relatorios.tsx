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

    const fetchRelatorios = async (params: { classeId?: number; startDate?: string; endDate?: string } = {}) => {
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
        let startDate: string | undefined = undefined;
        let endDate: string | undefined = undefined;

        if (selectedData !== "Selecione") {
            startDate = `${selectedData}-01`;
            const [year, month] = selectedData.split("-");
            const lastDay = new Date(Number(year), Number(month), 0).getDate();
            endDate = `${selectedData}-${lastDay}`;
        }

        fetchRelatorios({ classeId: selectedTurma, startDate, endDate });
    }, [selectedTurma, selectedData]);

    const onPressRelatorio = (relatorioId: number) => {
        navigation.navigate('DetalhesRelatorio', { relatorioId });
    };
    
    const sortedRelatorios = relatorios.sort((a, b) => Number(b.relatorioId) - Number(a.relatorioId));
    
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
                    {[...Array(12)].map((_, index) => {
                        const month = (index + 1).toString().padStart(2, "0");
                        return (
                            <Picker.Item key={month} label={new Date(2024, index).toLocaleString('pt-BR', { month: 'long' })} value={`2024-${month}`} />
                        );
                    })}
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
