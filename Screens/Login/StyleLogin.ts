import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
    minHeight: height,
  },
  logoContainer: {
    height: height * 0.3, // Reduzido de 0.4 para 0.3
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20, // Reduzido de 40 para 30
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10, // Reduzido de 20 para 10
  },
  title: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '300',
  },
  titleBold: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
  },
  titleSub: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  logoImage: {
    width: 150,
    height: 150,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'flex-start', // Alterado de 'flex-end' para 'flex-start'
    paddingTop: 10, // Adicionado paddingTop
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: 30,
    marginHorizontal: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333B69',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    color: '#8A94A6',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333B69',
    marginBottom: 8,
  },
  input: {
    height: 50,
    backgroundColor: '#F5F7FF',
    borderWidth: 1,
    borderColor: '#E1E5F2',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333B69',
  },
  loginButton: {
    backgroundColor: '#6C5CE7',
    height: 56,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default styles;