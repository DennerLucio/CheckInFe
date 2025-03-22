import { StyleSheet, Text, View } from 'react-native';
import { Login } from './Screens/Login/Login';
import { Turma } from './Screens/Turma/Turma';
import { Relatorios } from './Screens/Relatorio/Relatorios';
import { CadastrarRelatorio } from './Screens/CadastrarRelatorio/CadastrarRelatorio';
import { CadastrarPessoa } from './Screens/CadastrarPessoa/CadastrarPessoa';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { setTopLevelNavigator } from './Services/NavigationServices';
import { DetalhesRelatorio } from './Screens/Relatorio/DetalhesRelatorio';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CadastrarTurma } from './Screens/CadastrarTurma/CadastrarTurma';


export type RootStackParamList = {
  Turma: undefined;
  Relatorios: undefined;
  Login: undefined;
  CadastrarRelatorio: { turmaId: number };
  CadastrarPessoa: undefined;
  DetalhesRelatorio: { relatorioId: number };
  CadastrarTurma: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider> 
      <NavigationContainer ref={(navigatorRef) => setTopLevelNavigator(navigatorRef)}>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: true,
            headerStyle: {
              backgroundColor: '#3B73BD',
            },
            headerTintColor: '#FFFFFF',
          }}>
          <Stack.Screen
            name="Turma"
            component={Turma}
          />
          <Stack.Screen
            name="Relatorios"
            component={Relatorios}
          />
          <Stack.Screen
            name="CadastrarRelatorio"
            component={CadastrarRelatorio}
          />
          <Stack.Screen
            name="CadastrarPessoa"
            component={CadastrarPessoa}
          />
          <Stack.Screen
            name="CadastrarTurma"
            component={CadastrarTurma}
          />
          <Stack.Screen
            name="DetalhesRelatorio"
            component={DetalhesRelatorio}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: false,
              headerStyle: {
                backgroundColor: '#B1464A',
              },
              headerTintColor: '#FFFFFF',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
