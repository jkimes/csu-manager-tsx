import React from "react";
import { ScrollView, View, Text, StyleSheet, Dimensions } from "react-native";
import { Card } from "@rneui/base";

const DataTable = ({ data }) => {
  const screenWidth = Dimensions.get("window").width; // Get the width of the screen

  return (
    <ScrollView horizontal style={styles.scrollView}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 5,
        }}
      >
        <Text style={styles.header}>Product or Service</Text>
        <Text style={styles.header}>Price</Text>
        <Text style={styles.header}>Quantity</Text>
        <Text style={styles.header}>Line Total</Text>
      </View>
      <Card
        containerStyle={[
          styles.cardContainer,
          { width: screenWidth * data.length },
        ]}
      >
        {data.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.cell}>{item.ClientName},Title</Text>
            <Text style={styles.cell}>{item.Price},Price</Text>
            <Text style={styles.cell}>{item.Quantity},Quant</Text>
            <Text style={styles.cell}>{item.Price * item.Quantity},Total</Text>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
  },
  cardContainer: {
    borderWidth: 0,
    margin: 0,
    elevation: 0,
  },
  scrollView: {
    backgroundColor: "pink",
    marginHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
  },
  header: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
  },
  cell: {
    flex: 1,
    textAlign: "center",
  },
});

export default DataTable;
