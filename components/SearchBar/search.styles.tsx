import { StyleSheet } from "react-native";

export const searchstyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 5,
    backgroundColor: "gray",
  },

  SearchBar: {
    height: 40,
    borderWidth: 4,
    borderColor: "gray",
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
