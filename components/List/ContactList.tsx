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

const ContactList = ({ navigation, route, ClientNumber }) => {
  const { theme, updateTheme } = useTheme();
  const quoteData = useContext(DataContext);
  const [clientData, setclientData] = useState(quoteData);
  const [visible, setVisible] = useState(false);

  const getclient = (ClientNumber) => {
    const client = quoteData.filter((item) => {
      const clientNumber = (item.ClientNumber || "").toString().toLowerCase();
      return clientNumber.includes(ClientNumber);
    });
    return client;
  };
  const client = getclient(ClientNumber);

  const renderContacts = (contactList) => {
    const contacts = contactList[0]?.Contacts;
    if (!contacts) return null;

    return (
      <View>
        {Object.keys(contacts).map((key, index) => {
          const contact = contacts[key];
          return (
            <View key={index}>
              <Text>
                @#@ Contact Name: {contact.name}, Email: {contact.email},
                Street: {contact.street}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  // const renderContacts = (contactList) => {
  //   return contactList.map((contact, index) => (
  //     <View key={index}>
  //       <Text>
  //         Contact Name: {contact.name}, Email: {contact.email}, Street:{" "}
  //         {contact.street}
  //       </Text>
  //     </View>
  //   ));
  //   // contactList.forEach((item) => {
  //   //   //Here i am mapping through the Array that holds "contact 1" object aka (item) in the first index [0] to access the key value pairs
  //   //   return Object.keys(item).map((key) => {
  //   //     const contact = contacts[key];
  //   //     return (
  //   //       <View key={key}>
  //   //         <Text>
  //   //           Contact Name: {contact.name}, Email: {contact.email}, Street:{" "}
  //   //           {contact.street}
  //   //         </Text>
  //   //       </View>
  //   //     );
  //   //   });
  //   // });
  // };

  console.log(`Client@: ${JSON.stringify(client)}`);
  client.forEach((item) => {
    Object.keys(item.Contacts).forEach((key) => {
      const contact = item.Contacts[key];
      console.log(
        `$#Contact Name: ${contact.name}, Email: ${contact.email}, Street: ${contact.street}`
      );
    });
    console.log(
      `&Client Contacts: ${item.Contacts} ClientNum#: ${item.ClientNumber}`
    );
  });
  const contacts = JSON.stringify(client.Contacts);
  // console.log(`Contacts@: ${JSON.stringify(contacts)}`);
  // contacts.forEach((item) => {
  //   console.log(`Contacts: ${JSON.stringify(item)}`);
  // });
  // console.log(`Contacts: ${contacts}`);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  useEffect(() => {}, [quoteData]); // Call renderQuoteList whenever data changes

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

  return (
    <ThemeProvider theme={theme}>
      <View>
        <Text> Contact List </Text>
        {client.map((item) => (
          <View key={item.id}>{renderContacts(item.Contacts)}</View>
        ))}
      </View>
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

export default ContactList;
