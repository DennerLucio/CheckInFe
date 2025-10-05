import React from "react";
import { Text, View } from "react-native";
import styles from './StyleCardRelatorio';
import { ListaRelatorioResponse } from "../../Services/RelatorioService";

interface CardRelatorioProps {
  relatorio: ListaRelatorioResponse;
}

// Função para formatar data ou exibir "Relatório consolidado"
function formatarData(dataISO?: string | null): string {
  if (!dataISO) return "Relatório consolidado";

  const data = new Date(dataISO);
  if (isNaN(data.getTime())) return "Relatório Total";

  const dia = data.getDate().toString().padStart(2, "0");
  const mes = (data.getMonth() + 1).toString().padStart(2, "0");
  const ano = data.getFullYear().toString();

  return `${dia}/${mes}/${ano}`;
}

export function CardRelatorio({ relatorio }: CardRelatorioProps) {
  if (!relatorio || typeof relatorio.relatorioId === 'undefined') {
    return null;
  }

  const dataFormatada = formatarData(relatorio.data);
  const presencasText =
    relatorio.quantidadePresentes != null
      ? `${relatorio.quantidadePresentes} Presenças`
      : "Presenças não disponíveis";

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.dateText}>{dataFormatada}</Text>
        
        {relatorio.nomeClasse && (
          <Text style={styles.classText}>{relatorio.nomeClasse}</Text>
        )}
        
        {relatorio.quantidadePresentes != null && (
          <Text style={styles.presencesText}>{presencasText}</Text>
        )}
      </View>
    </View>
  );
}
