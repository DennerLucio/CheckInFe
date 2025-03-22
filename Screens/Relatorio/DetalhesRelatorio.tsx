import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Button, Alert } from "react-native";
import { infoRelatorio, RelatorioResponse } from "../../Services/RelatorioService";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { compartilharRelatorioPlanilha, baixarRelatorioPlanilha } from "../../Services/RelatorioService"; // Importe a função de download
import { AxiosError } from 'axios';

interface DetalhesRelatorioProps {
  route: RouteProp<RootStackParamList, "DetalhesRelatorio">;
}

function formatarData(dataISO: string): string {
  const data = new Date(dataISO);
  const dia = data.getDate().toString().padStart(2, "0");
  const mes = (data.getMonth() + 1).toString().padStart(2, "0");
  const ano = data.getFullYear().toString();
  return `${dia}/${mes}/${ano}`;
}

export function DetalhesRelatorio({ route }: DetalhesRelatorioProps) {
  const { relatorioId } = route.params;
  const [relatorio, setRelatorio] = useState<RelatorioResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatorio = async () => {
      try {
        const data = await infoRelatorio(relatorioId);
        setRelatorio(data);
      } catch (error) {
        console.error("Erro ao buscar detalhes do relatório:", error);
        setError("Não foi possível carregar os detalhes do relatório.");
      } finally {
        setLoading(false);
      }
    };

    fetchRelatorio();
  }, [relatorioId]);

  const handleGerarRelatorio = async () => {
    try {
      await compartilharRelatorioPlanilha();
    } catch (error) {
      console.error('Erro ao gerar planilha:', error);
      setError('Não foi possível gerar a planilha.');
    }
  };

  const handleBaixarRelatorio = async () => {
    try {
      await baixarRelatorioPlanilha(); // Chama a função de download do relatório
      Alert.alert("Sucesso", "Relatório baixado com sucesso!", [{ text: "OK" }]);
    } catch (error: unknown) {
      console.error('Erro ao baixar planilha:', error);
      if (error instanceof AxiosError && error.response) {
        console.error('Resposta do erro:', error.response.data); // Exibe detalhes da resposta de erro
        setError('Erro ao baixar o relatório: ' + error.response.data);
      } else {
        setError('Não foi possível baixar a planilha. Tente novamente mais tarde.');
      }
      Alert.alert("Erro", error instanceof Error ? error.message : "Ocorreu um erro inesperado.", [{ text: "OK" }]);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!relatorio) {
    return <Text>Nenhum relatório encontrado.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes do Relatório</Text>
      <View style={styles.container}>
        <Text style={styles.label}>Data: {formatarData(relatorio.data)}</Text>
        <Text style={styles.label}>Quantidade de Bíblias: {relatorio.quantidadeBiblias}</Text>
        <Text style={styles.label}>Oferta: {relatorio.oferta}</Text>
        <Text style={styles.label}>Presentes: {relatorio.presentes}</Text>
        <Text style={styles.label}>Observação: {relatorio.observacao}</Text>
      </View>

      {/* Botão para gerar o relatório em planilha */}
      <Button title="Compartilhar Relatório em Planilha" onPress={handleGerarRelatorio} />

      {/* Botão para baixar o relatório diretamente */}
      <Button title="Baixar Relatório" onPress={handleBaixarRelatorio} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
  },
  label: {
    fontSize: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  errorContainer: {
    padding: 20,
    backgroundColor: "#f8d7da",
    borderColor: "#f5c6cb",
    borderWidth: 1,
    borderRadius: 5,
  },
  errorText: {
    color: "#721c24",
    textAlign: "center",
  },
});
