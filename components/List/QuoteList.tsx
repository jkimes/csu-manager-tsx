/**************************************************************************************************************/
/* Author: Jalon Kimes                                                                                        */
/* This file fetched the data from the api and displays it in a list of card elements                         */
/**************************************************************************************************************/
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
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
import { DataContext } from "../DataContext";
import { QuoteContext } from "../QuoteContext";
import DataTable from "../DataTable";
import { Quote, LineItem, Client } from "../../App";
import { QuoteStyles } from "./styles/Quote.styles";

//initalizes firebase connection
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
interface QuoteListProps {
  navigation: any; // Replace 'any' with the actual type if possible
  route: any; // Replace 'any' with the actual type if possible
  ClientNumber: number; // Specify the type of ClientNumber as number
}

const QuoteList = ({ navigation, route, ClientNumber }: QuoteListProps) => {
  const { theme, updateTheme } = useTheme();
  const data = useContext(DataContext);
  const quoteData: Quote[] = useContext(QuoteContext); // all quote data
  const [clientData, setclientData] = useState(quoteData); // filters quote data to just data associated with client
  const [visible, setVisible] = useState(false);

  const client: Client = data.find(
    (item) => item.ClientNumber === ClientNumber
  );
  // console.log(`client Name; ${client.Address_Zip} `);

  const filteredQuotes = quoteData.filter((item) => {
    // console.log(
    //   `Client Number: ${ClientNumber} Item Number: ${
    //     item.ClientNumber
    //   } evaluation: ${ClientNumber === item.ClientNumber}`
    // );
    const match = Number(item.ClientNumber) === Number(ClientNumber);
    if (match) {
      console.log("Filtered Quote:", item);
    }
    return match;
  });
  // console.log(`Filtered Quotes${filteredQuotes}`);

  useEffect(() => {
    // Filter quoteData by ClientNumber
    const filteredData = filteredQuotes;

    // Set filtered data to clientData
    setclientData(filteredData);
  }, [quoteData, ClientNumber]); // Update clientData whenever quoteData changes

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  // Renders Active or Inactive on the screen based on bool value
  function DisplayJobStatus(bool: boolean) {
    return bool ? "Active" : "Inactive";
  }

  //   console.log("Line Items for each client:", lineItemsForEachClient);

  //Renders out the list of quotes that link to the whole quote
  const renderQuoteList = (data: Quote[]) => {
    // console.log("Inside RENDER Cards", filteredData.length); // data is empty

    let totalPriceSum = 0;

    const quoteList = data.map((item) => {
      console.log(`Quote Item: ${item.ClientName}`);
      const lineItems: LineItem[] = item.lineItems;
      const lineItemContent = lineItems.map((lineItem) => {
        // Calculate the price for the current line item
        const lineItemPrice = lineItem.Price * lineItem.Quantity;
        // Add the price to the total sum
        totalPriceSum += lineItemPrice;

        return (
          <Card key={lineItem.id} containerStyle={QuoteStyles.overlayCard}>
            <View style={QuoteStyles.lineItemContainer}>
              <Text
                style={[QuoteStyles.lineItemText, QuoteStyles.lineItemTitle]}
              >
                {lineItem.Title}
              </Text>
              <Text style={QuoteStyles.lineItemText}>
                {lineItem.Description}
              </Text>
              <Text style={QuoteStyles.lineItemText}>
                {"Quantity: "}
                {lineItem.Quantity}
              </Text>

              <Text style={QuoteStyles.lineItemText}>
                Price: ${lineItem.Price * lineItem.Quantity}
              </Text>
            </View>
          </Card>
        );
      });
      //   console.log("Line Item Prices ", lineItemContent);

      return (
        <Card key={item.id} containerStyle={QuoteStyles.cardContainer}>
          <Card.FeaturedTitle style={{ color: "black" }}>
            {item.ClientName}
          </Card.FeaturedTitle>
          <Card.FeaturedSubtitle style={{ color: "black" }}>
            {" "}
            #{item.QuoteNumber}
          </Card.FeaturedSubtitle>
          <Button
            title="Open Quote"
            onPress={toggleOverlay}
            buttonStyle={QuoteStyles.button}
          />
          <Overlay
            isVisible={visible}
            onBackdropPress={toggleOverlay}
            overlayStyle={QuoteStyles.overlay}
          >
            <View style={QuoteStyles.overlayContent}>
              <ScrollView>
                <Card.Title>{item.ClientName}</Card.Title>
                <Text>Issued on: {item.IssueDate}</Text>
                <Text>Expiry Date: {item.ExpireDate}</Text>
                <Text>Quote #: {item.QuoteNumber}</Text>
                <Card.Divider />

                <Text>Contractors Services Unlimited</Text>
                <Text> Suite 101-C</Text>
                <Text>9595 Fontainbleau Boulevard</Text>
                <Text>Miami, Florida 33172-6883</Text>
                <Text>Bililng@csuflorida.com</Text>
                <Text>(305)-213-778</Text>
                <Card.Divider />

                <Card.Title> Client Details</Card.Title>
                <Text>{client.ClientName}</Text>
                <Text>{client.Address_Street}</Text>
                <Text>
                  {client.Address_City},Florida {client.Address_Zip}
                </Text>
                <Text>{client.ClientEmail}</Text>
                <Text>{client.ClientPhone}</Text>
                <Card.Divider />

                <Card.Title> Product or Service</Card.Title>
                <Text>{lineItemContent}</Text>
                <Card.Divider />

                <Text>Total Price: ${totalPriceSum}</Text>
                <Card.Title> Notes</Card.Title>
                <Text>{item.Notes}</Text>
                <Card.Title>Legal Terms</Card.Title>
                <Text>{item.LegalTerms}</Text>
                <Button title="Close" onPress={toggleOverlay} />
              </ScrollView>
            </View>
          </Overlay>
        </Card>
      );
    });
    return quoteList;
  };

  return (
    <ThemeProvider theme={theme}>
      <View>{renderQuoteList(clientData)}</View>
    </ThemeProvider>
  );
};

export default QuoteList;
