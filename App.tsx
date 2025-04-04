import { StyleSheet } from 'react-native';
import { Login } from './Screens/Login/Login';
import { Turma } from './Screens/Turma/Turma';
import { Relatorios } from './Screens/Relatorio/Relatorios';
import { CadastrarRelatorio } from './Screens/CadastrarRelatorio/CadastrarRelatorio';
import { CadastrarPessoa } from './Screens/CadastrarPessoa/CadastrarPessoa';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { setTopLevelNavigator } from './Services/NavigationServices';
import { DetalhesRelatorio } from './Screens/Relatorio/DetalhesRelatorio';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CadastrarTurma } from './Screens/CadastrarTurma/CadastrarTurma';
import { Home, Users, FileText, PlusCircle } from 'react-native-feather';

// Definição dos tipos para navegação
export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  CadastrarRelatorio: { turmaId: number };
  DetalhesRelatorio: { relatorioId: number };
};

export type MainTabParamList = {
  Turma: undefined;
  Relatorios: undefined;
  CadastrarPessoa: undefined;
  CadastrarTurma: undefined;
};

// Criação dos navegadores
const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Componente de navegação em abas
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#6C5CE7',
        tabBarInactiveTintColor: '#8A94A6',
        tabBarLabelStyle: styles.tabLabel,
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Turma" 
        component={Turma} 
        options={{
          tabBarLabel: 'Turmas',
          tabBarIcon: ({ color, size }) => (
            <Home width={22} height={22} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Relatorios" 
        component={Relatorios} 
        options={{
          tabBarLabel: 'Relatórios',
          tabBarIcon: ({ color, size }) => (
            <FileText width={22} height={22} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="CadastrarPessoa" 
        component={CadastrarPessoa} 
        options={{
          tabBarLabel: 'Pessoas',
          tabBarIcon: ({ color, size }) => (
            <Users width={22} height={22} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="CadastrarTurma" 
        component={CadastrarTurma} 
        options={{
          tabBarLabel: 'Cadastrar',
          tabBarIcon: ({ color, size }) => (
            <PlusCircle width={22} height={22} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Componente principal do App
export default function App() {
  return (
    <SafeAreaProvider> 
      <NavigationContainer ref={(navigatorRef) => setTopLevelNavigator(navigatorRef)}>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen
            name="Login"
            component={Login}
          />
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
          />
          <Stack.Screen
            name="CadastrarRelatorio"
            component={CadastrarRelatorio}
          />
          <Stack.Screen
            name="DetalhesRelatorio"
            component={DetalhesRelatorio}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider> 
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E1E5F2',
    height: 60,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
});