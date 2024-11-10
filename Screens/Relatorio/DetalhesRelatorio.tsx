import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { infoRelatorio, RelatorioResponse } from "../../Services/RelatorioService";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App"; 

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
  },
  label:{
    fontSize:18,
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
