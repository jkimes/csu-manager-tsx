import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../../constants";

export const QuoteStyles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%'
  },
  cardTitle: {
    color: "black",
    fontSize: 18,
    flex: 1,
    marginRight: 10
  },
  deleteButton: {
    padding: 5,
  },
  cardContainer: {
    width: "100%",
    marginBottom: 10,
    padding: 0,
    marginHorizontal: 5
  },
  overlayCard: {
    marginBottom: 10,
  },
  lineItemContainer: {
    width: "100%", // Take up the whole width of the card
    flexDirection: "column", // Ensure items are stacked vertically
    flexWrap: "wrap", // Allow text to wrap when it's too long
  },
  lineItemText: {
    width: "100%", // Take up the full width of the container
    marginBottom: 5, // Add some spacing between items

    fontSize: 12,
  },
  lineItemTitle: {
    fontWeight: "bold", // Optionally make the title bold
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  overlay: {
    position: "absolute",
    top: 140, // Adjust this value based on the height of your header
    left: 0,
    right: 0,
    bottom: 10,
    padding: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayContent: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 20,
    borderRadius: 10,
  },
  button: {
    padding: 10,
    backgroundColor: "#df3a0e",
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
    fontSize: 20,
  },
  textStyle: {
    fontSize: 18,
    color: "#000",
    fontWeight: "normal",
    marginVertical: 2,
  },
  linkText: {
    color: '#2089dc',
    textDecorationLine: 'underline',
    marginVertical: 5,
    fontSize: 14,
    textAlign: 'center'
  },
});
