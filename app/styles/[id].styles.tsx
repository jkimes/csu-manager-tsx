import { StyleSheet } from "react-native";

export const idStyles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row", // Align buttons horizontally
    justifyContent: "space-evenly", // Space buttons evenly horizontally
    backgroundColor: "gray",
    marginTop: 1,
  },
  tabContainer: {
    backgroundColor: "white", // Set background color to black
    height: "90%",
  },
  tabText: {
    color: "black", // Set text color to white
  },
  cardContainer: {
    borderWidth: 0, // Set borderWidth to 0 to remove borders
    margin: 0,
    marginTop: 0,
    elevation: 0,
    width: "100%",
  },
  cardTitle: {
    textAlign: "left",
    marginBottom: 1,
    marginTop: 0,
  },
  tabViewItem: {
    width: "100%",
  },
  cardContentContainer: {
    marginTop: 0,
  },
  lineItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
    width: "100%",
  },
  column: {
    flex: 1,
  },
  columnLabel: {
    flex: 1,
    fontWeight: "bold",
  },
});
