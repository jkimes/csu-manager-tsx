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

const ExpenseList = ({ navigation, route, data  }) => {
  const { theme, updateTheme } = useTheme();
  //const data = useContext(VendorsContext);

  // Call renderCardList whenever data changes
  useEffect(() => {
    //renderCardList(navigation);
    // console.log("Card List Data context", { data });
  }, [data]);

  const renderExpenseList = (navigation) => {
    return data.map((item) => (
      <ListItem
        key={item.id}
        style={cardlistStyles.listItem}
      >
        <Card key={item.id} containerStyle={cardlistStyles.card}>
          {/* <View key={item.id} style={styles.contactBox}> */}
          <View style={{flexDirection: "row"}}>
            <View>
              <Card.Title style={cardlistStyles.textStyleName}>
                {handleName(item.CustomerName)}
              </Card.Title>
              <Divider />
              <Text style={cardlistStyles.textStyle}>
                Customer #: {item.CustomerNum}
              </Text>
              <Text style={cardlistStyles.textClientNum}>
                Pmt Amount: ${item.PayAmount}
              </Text>
              <Text style={cardlistStyles.textStyle}>Date: {formatTimestampToDate(item.Date)}</Text>
              
            </View>
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
