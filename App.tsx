// @ts-ignore
import { NavigationContainer } from '@react-navigation/native';
// @ts-ignore
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { Login } from './Screens/Login/Login';
import { Turma } from './Screens/Turma/Turma';
import { Relatorios } from './Screens/Relatorio/Relatorios';
import { CadastrarRelatorio } from './Screens/CadastrarRelatorio/CadastrarRelatorio';
import { CadastrarPessoa } from './Screens/CadastrarPessoa/CadastrarPessoa';
import { createStackNavigator } from '@react-navigation/stack';
import { setTopLevelNavigator } from './Services/NavigationServices';
import { DetalhesRelatorio } from './Screens/Relatorio/DetalhesRelatorio';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CadastrarTurma } from './Screens/CadastrarTurma/CadastrarTurma';
import { Home, Users, FileText, PlusCircle } from 'react-native-feather';

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

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

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
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Home width={size} height={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Relatorios" 
        component={Relatorios} 
        options={{
          tabBarLabel: 'Relatórios',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <FileText width={size} height={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="CadastrarPessoa" 
        component={CadastrarPessoa} 
        options={{
          tabBarLabel: 'Pessoas',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Users width={size} height={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="CadastrarTurma" 
        component={CadastrarTurma} 
        options={{
          tabBarLabel: 'Turmas',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <PlusCircle width={size} height={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider> 
      <NavigationContainer ref={(navigatorRef: any) => setTopLevelNavigator(navigatorRef)}>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="CadastrarRelatorio" component={CadastrarRelatorio} />
          <Stack.Screen name="DetalhesRelatorio" component={DetalhesRelatorio} />
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
