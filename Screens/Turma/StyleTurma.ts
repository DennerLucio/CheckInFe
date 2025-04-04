import { StyleSheet, Platform, StatusBar } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 7,
    paddingBottom: 16,
    backgroundColor: '#F5F7FF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333B69',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8A94A6',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F7FF',
    width: '100%',
  },
  footer: {
    padding: 20,
    backgroundColor: '#F5F7FF',
    borderTopWidth: 1,
    borderTopColor: '#E1E5F2',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reportButton: {
    backgroundColor: '#6C5CE7',
    width: '100%',
  },
  secondaryButton: {
    backgroundColor: '#7F7FD5',
    width: '48%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default styles;