/**************************************************************************************************************/
/* Author: Jalon Kimes                                                                                        */
/* This file fetched the data from the api and displays it in a list of card elements                         */
/**************************************************************************************************************/
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  Linking,
} from "react-native";
// import { Link, Stack } from "expo-router";
// import { Dropdown } from "react-native-element-dropdown";
import { COLORS, FONT, SIZES } from "../../constants";
import { ThemeProvider, useTheme, Card, Button, Overlay } from "@rneui/themed";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

/*Custom imports */
import { firebase, firebaseConfig } from "../../config";
import { filterByShowAll, filterByActive, filterByInactive } from "./Filters"; // Import filtering functions
import { DataContext, useDataContext } from "../DataContext";
import { QuoteContext } from "../QuoteContext";
import DataTable from "../DataTable";

//initalizes firebase connection
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const QuoteList = ({ navigation, route, ClientNumber }) => {
  const { theme, updateTheme } = useTheme();
  const quoteData = useContext(QuoteContext);
  const [clientData, setclientData] = useState(quoteData);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Filter quoteData by ClientNumber
    const filteredData = quoteData.filter(
      (item) => item.ClientNumber === ClientNumber
    );
    // Set filtered data to clientData
    setclientData(filteredData);
  }, [quoteData]); // Update clientData whenever quoteData changes

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    renderQuoteList(clientData);
    console.log("Quote List Data context", { clientData });
  }, [quoteData]); // Call renderQuoteList whenever data changes

  // Renders Active or Inactive on the screen based on bool value
  function DisplayJobStatus(bool: boolean) {
    return bool ? "Active" : "Inactive";
  }

  //Formats the address based on if the value is assigned or not
  const handleAddress = (street: string, city: string) => {
    if (street?.trim() === '""') {
      return "No address found";
    } else {
      return `${street}, ${city}`;
    }
  };

  const lineItemsForEachClient = clientData.map((client) => {
    // Access line items for the current client
    const lineItems = client.lineItems;
    // You can perform operations on lineItems here if needed
    return lineItems;
  });

  console.log("Line Items for each client:", lineItemsForEachClient);

  //Renders out the list of quotes that link to the whole quote
  const renderQuoteList = (data: any) => {
    // console.log("Inside RENDER Cards", filteredData.length); // data is empty
    const quoteList = data.map((item) => {
      const lineItems = item.lineItems;
      const lineItemContent = lineItems.map((lineItem) => (
        <View key={lineItem.id}>
          <Text>Price: {lineItem.Price}</Text>
          <Text>Description: {lineItem.Description}</Text>
          <Text>Quantity: {lineItem.Quantity}</Text>
        </View>
      ));
      console.log("Line Item Prices ", lineItemContent);

      return (
        <Card key={item.id}>
          <Card.Title>Title, {item.ClientName}</Card.Title>
          <Button
            title="Open Overlay"
            onPress={toggleOverlay}
            buttonStyle={styles.button}
          />
          <Overlay
            isVisible={visible}
            onBackdropPress={toggleOverlay}
            overlayStyle={styles.overlay}
          >
            <View style={styles.overlayContent}>
              <Text>{lineItemContent}</Text>
              <Button title="Start Building" onPress={toggleOverlay} />
            </View>
          </Overlay>
        </Card>
      );
    });
    return quoteList;
  };
  //   clientData.map((item) => (
  //   <Card key={item.id}>
  //     <Card.Title>{item.ClientName}</Card.Title>

  //     <Button title="Toggle Overlay" onPress={toggleOverlay} />
  //     <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
  //       <Text> Customer, {item.ClientName}</Text>
  //       <Button title="Toggle Overlay" onPress={toggleOverlay} />
  //     </Overlay>
  //   </Card>
  // ));

  return (
    <ThemeProvider theme={theme}>
      <Text>Quote List</Text>
      <View>{renderQuoteList(clientData)}</View>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  overlay: {
    flex: 1,
    padding: 20,
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
    fontSize: 20,
  },
  textStyle: {
    fontSize: 18,
    color: "#000",
    fontWeight: "normal",
    marginVertical: 2,
  },
});

export default QuoteList;
