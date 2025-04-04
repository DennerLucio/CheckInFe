import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#6C5CE7',
    padding: 16,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  classText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 2,
  },
  presencesText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  }
});

export default styles;