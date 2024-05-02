import { StyleSheet } from "react-native";

export const searchstyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 5,
    backgroundColor: "white",
  },

  SearchBar: {
    height: 40,
    borderWidth: 0,
    fontSize: 12,
    color: "black",
    borderRadius: 6,
    // padding: 100,
    // marginBottom: 10, // Adjust the margin bottom
    width: "100%", // Make the input fill the widt
  },
  modButtons: {
    flexDirection: "row",
    padding: 10,
  },
});
