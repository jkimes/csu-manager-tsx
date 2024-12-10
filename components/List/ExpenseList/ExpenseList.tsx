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
  Alert,
  ScrollView,
} from "react-native";
import { COLORS, FONT, SIZES } from "../../../constants";
import { ThemeProvider, useTheme, Card, Button, ListItem } from "@rneui/themed";

/*Custom imports */
import { firebase, firebaseConfig } from "../../../config";
import {
  filterByProfessional,
  filterBySubcontractors,
  filterByMaterials,
  filterByEquipment,
  filterAllTypes,
} from "../Filters"; // Import filtering functions
import { DataContext } from "../../ContextGetters/DataContext";
import {
  handleAddress,
  DisplayJobStatus,
  handleName,
} from "../../Helpers/helperFunctions";
import DeleteClient from "../../Buttons/DeleteClient";
import { cardlistStyles } from "../styles/cardlist.styles";
import { VendorsContext } from "../../ContextGetters/VendorsContext";
import { Divider } from "@rneui/base";

//initalizes firebase connection
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const formatTimestampToDate = (timestamp) => {
    if (!timestamp || !timestamp.toDate) {
      console.error("Invalid timestamp");
      return null;
    }
  
    const date = timestamp.toDate(); // Convert the Firebase Timestamp to a JavaScript Date object
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed, so we add 1
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
  
    return `${month}/${day}/${year}`;
  };

// Utility function to format numbers with commas and decimals
const formatCurrency = (amount) => {
  return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const ExpenseList = ({ navigation, route, data, refreshData }) => {
  const { theme, updateTheme } = useTheme();
  //const data = useContext(VendorsContext);

  // Call renderCardList whenever data changes
  useEffect(() => {
    //renderCardList(navigation);
    // console.log("Card List Data context", { data });
  }, [data]);

  const handleDeleteExpense = (expenseId) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this expense?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              // Logic to delete the expense from Firestore
              await firebase.firestore().collection('customerExp').doc(expenseId).delete();
              Alert.alert('Success', 'Expense deleted successfully');
              refreshData();
            } catch (error) {
              console.error('Error deleting expense:', error);
              Alert.alert('Error', 'Failed to delete expense');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderExpenseList = (navigation) => {
    // Sort the data by the most recent date
    const sortedData = [...data].sort((a, b) => {
      const dateA = a.Date?.toDate() || new Date(a.Date);
      const dateB = b.Date?.toDate() || new Date(b.Date);
      return dateB - dateA; // Sort in descending order
    });

    return sortedData.map((item) => (
      <ListItem
        key={item.id}
        style={cardlistStyles.listItem}
      >
        <Card key={item.id} containerStyle={cardlistStyles.card}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <View style={{ flex: 1 }}>
              <Card.Title style={cardlistStyles.textStyleName}>
                {handleName(item.CustomerName)}
              </Card.Title>
              <Divider />
              <Text style={cardlistStyles.textStyle}>
                Customer #: {item.CustomerNum}
              </Text>
              <Text style={cardlistStyles.textClientNum}>
                Pmt Amount: ${formatCurrency(item.PayAmount)}
              </Text>
              <Text style={cardlistStyles.textStyle}>Date: {formatTimestampToDate(item.Date)}</Text>
            </View>
            <Button
              title="X"
              onPress={() => handleDeleteExpense(item.id)}
              buttonStyle={{ backgroundColor: 'red', padding: 2, borderRadius: 15 }}
              titleStyle={{ fontSize: 12 }}
              containerStyle={{ marginLeft: 10 }}
            />
          </View>
        </Card>
      </ListItem>
    ));
  };


  return (
    <ThemeProvider theme={theme}>
      <View>
        <ScrollView contentContainerStyle={cardlistStyles.listItemContainer}>
          {renderExpenseList(navigation)}
        </ScrollView>
      </View>
    </ThemeProvider>
  );
};

export default ExpenseList;

