import { StyleSheet } from "react-native";

export const WipStyles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: "center",
  },
  priceCard: {
    flex: 1,
    margin: 5, // Add margin to separate the cards
    width: "30%", // Adjust the width of the cards as needed
    justifyContent: "center", // Align content to the center vertically
    alignItems: "center", // Align content to the center horizontally
  },
  TitleView: {
    marginBottom: 5,
    // alignItems: "center",
  },
  pageView: {
    flex: 1,
    alignItems: "flex-start", // Align items to the start of the flex container
    justifyContent: "flex-start", // Align content to the start of the flex container
    paddingHorizontal: 10, // Add horizontal padding to space out the cards
  },
  title: {
    fontSize: 12,
  },
  digits: {
    fontSize: 11,
  },
  featuredTitle: {
    color: "black",
  },
  featuredSubtitle: {
    color: "black",
  },
});
