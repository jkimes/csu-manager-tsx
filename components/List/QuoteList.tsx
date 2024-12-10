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
  Alert,
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
import { DataContext } from "../ContextGetters/DataContext";
import { QuoteContext } from "../ContextGetters/QuoteContext";
import DataTable from "../DataTable";
import { Quote, LineItem, Client } from "../../App";
import { QuoteStyles } from "./styles/Quote.styles";
import { useAuth } from '../ContextGetters/AuthContext';
import { Icon } from '@rneui/themed';

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
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<string>('User');

  const client: Client = data.find((item) => item.CustomerNum === ClientNumber);
  // console.log(`client Name; ${client.Address_Zip} `);

  const filteredQuotes = quoteData.filter((item) => {
    // console.log(
    //   `Client Number: ${ClientNumber} Item Number: ${
    //     item.ClientNumber
    //   } evaluation: ${ClientNumber === item.ClientNumber}`
    // );
    const match = Number(item.ClientNumber) === Number(ClientNumber);
    if (match) {
      //console.log("Filtered Quote:", item);
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

  useEffect(() => {
    const getCurrentUserRole = async () => {
      if (user?.uid) {
        const userDoc = await firebase.firestore()
          .collection('Users')
          .doc(user.uid)
          .get();
        
        if (userDoc.exists) {
          setUserRole(userDoc.data()?.role || 'User');
        }
      }
    };
    getCurrentUserRole();
  }, [user]);

  const handleDelete = async (quoteId: string) => {
    try {
      // Get reference to quote document
      const quoteRef = firebase.firestore().collection('Quotes').doc(quoteId);
      
      // Delete all line items in subcollection first
      const lineItemsSnapshot = await quoteRef.collection('LineItems').get();
      const lineItemBatch = firebase.firestore().batch();
      lineItemsSnapshot.docs.forEach((doc) => {
        lineItemBatch.delete(doc.ref);
      });
      await lineItemBatch.commit();

      // Then delete the quote document
      await quoteRef.delete();

      // Update local state
      setclientData(prevData => prevData.filter(quote => quote.id !== quoteId));
      
      Alert.alert('Success', 'Quote deleted successfully');
    } catch (error) {
      console.error('Error deleting quote:', error);
      Alert.alert('Error', 'Failed to delete quote');
    }
  };

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
      //console.log(`Quote Item: ${item.ClientName}`);
      const lineItems: LineItem[] = item.lineItems;
      const lineItemContent = lineItems.map((lineItem) => {
        // Calculate the price for the current line item
        const lineItemPrice = lineItem.Price * lineItem.Quantity;
        // console.log(
        //   `LineItem Price: ${lineItem.Price} Quantity: ${lineItem.Quantity}`
        // );
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
          <View style={QuoteStyles.headerContainer}>
            <Card.FeaturedTitle 
              style={QuoteStyles.cardTitle}
            >
              {item.Label}
            </Card.FeaturedTitle>
            
            {['Admin', 'Manager'].includes(userRole) && (
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    'Confirm Delete',
                    'Are you sure you want to delete this quote?',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'Delete',
                        onPress: () => handleDelete(item.id),
                        style: 'destructive',
                      },
                    ]
                  );
                }}
                style={QuoteStyles.deleteButton}
              >
                <Icon
                  name="delete"
                  type="material"
                  color="#FF0000"
                  size={24}
                />
              </TouchableOpacity>
            )}
          </View>
          <Button
            title="View Link"
            onPress={async () => {
              try {
                let url = item.Link;
                // Add https:// if no protocol is specified
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                  url = 'https://' + url;
                }
                const supported = await Linking.canOpenURL(url);
                if (supported) {
                  await Linking.openURL(url);
                } else {
                  console.log("Cannot open URL: " + url);
                  Alert.alert("Error", "Cannot open this URL");
                }
              } catch (error) {
                console.error("Error opening link:", error);
                Alert.alert("Error", "Failed to open link");
              }
            }}
            buttonStyle={QuoteStyles.button}
          />
          {/* <Overlay
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
                <Text>{client.JobSiteStreet + " " + client.JobSiteCity}</Text>
                <Text>{client.ClientEmail}</Text>
                <Text>{client.ClientPhone}</Text>
                <Card.Divider />

                <Card.Title> Product or Service</Card.Title>
                {lineItemContent}
                <Card.Divider />

                <Text>Total Price: ${totalPriceSum}</Text>
                <Card.Title> Notes</Card.Title>
                <Text>{item.Notes}</Text>
                <Card.Title>Legal Terms</Card.Title>
                <Text>{item.LegalTerms}</Text>
                <Button title="Close" onPress={toggleOverlay} />
              </ScrollView>
            </View>
          </Overlay> */}
        </Card>
      );
    });
    //console.log("Quote List JSX:", quoteList); // Log the generated JSX for quote list
    return quoteList;
  };

  return (
    <ThemeProvider theme={theme}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
          {renderQuoteList(clientData)}
        </ScrollView>
      </View>
    </ThemeProvider>
  );
};

export default QuoteList;
