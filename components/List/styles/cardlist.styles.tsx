import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../../constants";

export const cardlistStyles = StyleSheet.create({
  jobStatus: {
    position: "absolute",
    top: 15,
    right: 10,
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 5,
  },
  listItemContainer: {
    flex: 1, // Ensure the container takes up all available space
    justifyContent: "center", // Center the ListItem vertically
  },
  listItem: {
    width: '100%',
    padding: 0,
  },
  card: {
    width: '100%',
    borderRadius: 10,
    marginHorizontal: 0,
    marginVertical: 5,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "white",
  },
  button: {
    padding: 2,
    // backgroundColor: COLORS.primary,
    borderRadius: 1,
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
    marginTop: 10,
    marginRight: 40,
    width: '100%',
  },
  textStyleName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    width: '90%',
  },
  textClientNum: {
    fontSize: 16,
    marginBottom: 5,
  },
  textStyle: {
    fontSize: 16,
    marginBottom: 5,
    width: '90%',
  },
  statusContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
  },
  statusText: {
    fontSize: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  cardContent: {
    position: "relative",
    width: '100%',
    minHeight: 150,
    paddingTop: 25,
  },
});
