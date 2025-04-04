import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FF',
    width: '100%',
    paddingTop: 10,
    paddingHorizontal: 12,
  },
  header: {
    paddingVertical: 16,
    borderBottomColor: '#E1E5F2',
    borderBottomWidth: 1, 
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333B69',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8A94A6',
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterColumn: {
    width: '48%',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333B69',
    marginBottom: 6,
  },
  pickerContainer: {
    backgroundColor: '#F5F7FF',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E1E5F2',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  picker: {
    height: 40,
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333B69',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8A94A6',
    textAlign: 'center',
  },
});

export default styles;