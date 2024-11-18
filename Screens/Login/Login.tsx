import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import styles from "./StyleLogin";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { login } from "../../Services/AuthService";

export function Login() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const btnLogar = async () => {
    setLoading(true);
    try {
      const response = await login(email, password);

      if (response.success) {
        navigation.navigate("Turma");
      }
      else{
        Alert.alert("Erro de Login", "Usuário ou senha incorretos");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.areaTitulo}>
          <View style={styles.containerTitulo}>
            <Text style={styles.title}>CheckIn</Text>
            <Text style={styles.titleSub}>Fé</Text>
          </View>
          <View style={styles.containerImg}>
            <Image
              style={styles.imgPray}
              source={require("../../assets/pray.png")}
            />
          </View>
        </View>

        <View style={styles.areaLogin}>
          <TextInput
            style={styles.inputEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.inputSenha}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={() => btnLogar()}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
