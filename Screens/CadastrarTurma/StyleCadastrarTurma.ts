import { StyleSheet, Dimensions } from "react-native"

const { width, height } = Dimensions.get("window")

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FF",
    padding: 10,
  },
  header: {
    padding: 20,
    paddingTop: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333B69',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8A94A6',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
  },
  activeTab: {
    backgroundColor: "#F5F7FF",
    borderBottomWidth: 2,
    borderBottomColor: "#6C5CE7",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#8A94A6",
    marginLeft: 8,
  },
  activeTabText: {
    color: "#333B69",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333B69",
    marginLeft: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333B69",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E1E5F2",
    backgroundColor: "#F5F7FF",
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    color: "#333B69",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E1E5F2",
    backgroundColor: "#F5F7FF",
    borderRadius: 12,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#333B69",
  },
  button: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButton: {
    backgroundColor: "#6C5CE7",
  },
  dangerButton: {
    backgroundColor: "#FF6B6B",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonIcon: {
    marginRight: 8,
  },
  emptyState: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    padding: 12,
    backgroundColor: "#F5F7FF",
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#8A94A6",
    marginLeft: 8,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0EEFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#6C5CE7",
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#333B69",
    marginLeft: 10,
  },
})

export default styles

