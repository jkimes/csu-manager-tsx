import { StyleSheet } from "react-native";

export const clientpageStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingTop: 0,
  },
  listContainer: {
    backgroundColor: "white",
    flex: 1,
    padding: 5,
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
  buttonContainer:{
    margin: 10,
    
  }
});
