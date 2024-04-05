import { StyleSheet } from "react-native";

export const clientpageStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingTop: 0,
  },
  listContainer: {
    flex: 1,
    paddingTop: 5,
  },
  SearchBar: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    width: "100%",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
});
