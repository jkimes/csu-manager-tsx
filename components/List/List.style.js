import { StyleSheet } from "react-native";

import { COLORS, FONT, SIZES } from "../../constants";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    justifyContent: "center",
    paddingHorizontal: 16, // Adjust the horizontal padding as needed
    paddingTop: 0, // Adjust the top padding as needed
    paddingBottom: 100, // Add bottom padding as needed
    width: "100%",
    height: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginTop: SIZES.small,
  },
  headerTitle: {
    fontSize: SIZES.large,
    // fontFamily: FONT.medium,
    color: COLORS.primary,
  },
  headerBtn: {
    fontSize: SIZES.medium,
    // fontFamily: FONT.medium,
    color: COLORS.gray,
  },
  cardsContainer: {
    marginTop: SIZES.medium,
    gap: SIZES.small,


  },
});

export default styles;
