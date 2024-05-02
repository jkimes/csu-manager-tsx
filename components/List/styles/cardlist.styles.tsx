import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../../constants";

export const cardlistStyles = StyleSheet.create({
  listItemContainer: {
    flex: 1, // Ensure the container takes up all available space
    justifyContent: "center", // Center the ListItem vertically
  },
  listItem: {
    width: "100%", // Ensure the ListItem takes up the full width
  },
  card: {
    flex: 1,
    width: "100%", // Ensure the Card takes up the full width
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  button: {
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  container: {
    backgroundColor: "black",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 100,
    width: "100%",
    height: "100%",
    marginTop: SIZES.small,
    gap: SIZES.small,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: SIZES.large,
    color: COLORS.primary,
  },
  headerBtn: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  contactBox: {
    borderWidth: 1,
    borderColor: "#d1d1d1",
    backgroundColor: "white",
    borderRadius: 5,
    width: "100%",
  },
  contactBoxDetails: {
    flexDirection: "row",
  },
  textStyleName: {
    fontSize: 15,
  },
  textClientNum: {
    fontSize: 15,
    fontWeight: "bold",
  },
  textStyle: {
    fontSize: 15,
    fontWeight: "normal",
    marginVertical: 2,
  },
});
