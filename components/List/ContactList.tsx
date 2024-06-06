/**************************************************************************************************************/
/* Author: Jalon Kimes                                                                                        */
/* This file fetched the data from the api and displays it in a list of card elements                         */
/**************************************************************************************************************/
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { COLORS, SIZES } from "../../constants";
import {
  ThemeProvider,
  useTheme,
  ListItem,
  Card,
  Button,
  Overlay,
  Icon,
} from "@rneui/themed";

/*Custom imports */
import { firebase, firebaseConfig } from "../../config";
import { DataContext } from "../DataContext";
import DataTable from "../DataTable";
import { Client, Contact } from "../../App";
import {
  makePhoneCall,
  sendEmail,
  handleFullAddress,
  handlePhone,
  handleEmail,
} from "../helperFunctions";
import EditContact from "../Buttons/EditContact";
import Delete from "../Buttons/Delete";
import Edit from "../Buttons/Edit";

//initalizes firebase connection
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const ContactList = ({ navigation, route, ClientNumber }) => {
  const { theme, updateTheme } = useTheme();
  const data = useContext(DataContext);
  const [visible, setVisible] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const client: Client = data.find(
    (item) => item?.ClientNumber === ClientNumber
  );
  const contactList = client?.Contacts;
  console.log(`@Contact List@: ${contactList}`);
  // console.log(`${client.id}`);

  // console.log(`Pure Client: ${client.Contacts}`);
  // console.log(`Contacts@: ${JSON.stringify(client.Contacts)}`);

  const renderContacts = (contactList) => {
    if (
      contactList !== undefined &&
      contactList !== null &&
      typeof contactList === "object"
    ) {
      const keys: string[] = Object.keys(contactList);
      const contacts: Contact[] = Object.values(contactList);
      // Now you can safely use keys and contacts here
      if (!contacts.length) return null;

      return (
        <View>
          {contacts.map((contact, index) => (
            <View key={index}>
              <ScrollView>
                <Card.Divider />
                <Card.Title>{keys[index]}</Card.Title>
                <Card.Divider />
                <ListItem.Accordion
                  content={
                    <>
                      {/* <Icon name="place" size={30} /> */}
                      <ListItem.Content>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <ListItem.Title style={[{ marginRight: 10 }]}>
                            <Card.Title>Name</Card.Title>
                          </ListItem.Title>
                          <ListItem.Subtitle>
                            <Text>{contact?.name}</Text>
                          </ListItem.Subtitle>
                        </View>
                      </ListItem.Content>
                    </>
                  }
                  isExpanded={expandedIndex === 0}
                  onPress={() => {
                    setExpandedIndex(expandedIndex === 0 ? null : 0);
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Edit id={client.id} field={"name"} contact={keys[index]} />
                    <Delete
                      id={client.id}
                      field={"name"}
                      contact={keys[index]}
                    />
                  </View>
                </ListItem.Accordion>

                <Card.Divider />

                <ListItem.Accordion
                  content={
                    <>
                      {/* <Icon name="place" size={30} /> */}
                      <ListItem.Content>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <ListItem.Title style={[{ marginRight: 10 }]}>
                            <Card.Title>Email</Card.Title>
                          </ListItem.Title>
                          <ListItem.Subtitle>
                            <TouchableOpacity
                              onPress={() => sendEmail(contact?.email)}
                            >
                              <Text>
                                {contact?.email && handleEmail(contact?.email)}
                              </Text>
                            </TouchableOpacity>
                          </ListItem.Subtitle>
                        </View>
                      </ListItem.Content>
                    </>
                  }
                  isExpanded={expandedIndex === 1}
                  onPress={() => {
                    setExpandedIndex(expandedIndex === 1 ? null : 1);
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Edit
                      id={client.id}
                      field={"email"}
                      contact={keys[index]}
                    />
                    <Delete
                      id={client.id}
                      field={"email"}
                      contact={keys[index]}
                    />
                  </View>
                </ListItem.Accordion>

                <Card.Divider />

                <ListItem.Accordion
                  content={
                    <>
                      {/* <Icon name="place" size={30} /> */}
                      <ListItem.Content>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <ListItem.Title style={[{ marginRight: 10 }]}>
                            <Card.Title>Phone</Card.Title>
                          </ListItem.Title>
                          <ListItem.Subtitle>
                            <TouchableOpacity
                              onPress={() => makePhoneCall(contact?.phone)}
                            >
                              <Text>{handlePhone(contact?.phone)}</Text>
                            </TouchableOpacity>
                          </ListItem.Subtitle>
                        </View>
                      </ListItem.Content>
                    </>
                  }
                  isExpanded={expandedIndex === 2}
                  onPress={() => {
                    setExpandedIndex(expandedIndex === 2 ? null : 2);
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Edit
                      id={client.id}
                      field={"phone"}
                      contact={keys[index]}
                    />
                    <Delete
                      id={client.id}
                      field={"phone"}
                      contact={keys[index]}
                    />
                  </View>
                </ListItem.Accordion>

                <Card.Divider />

                <ListItem.Accordion
                  content={
                    <>
                      {/* <Icon name="place" size={30} /> */}
                      <ListItem.Content>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <ListItem.Title style={[{ marginRight: 10 }]}>
                            <Card.Title>Address</Card.Title>
                          </ListItem.Title>
                          <ListItem.Subtitle>
                            <Text>
                              {handleFullAddress(
                                contact?.street,
                                contact?.city,
                                contact?.zip
                              )}
                            </Text>
                          </ListItem.Subtitle>
                        </View>
                      </ListItem.Content>
                    </>
                  }
                  isExpanded={expandedIndex === 3}
                  onPress={() => {
                    setExpandedIndex(expandedIndex === 3 ? null : 3);
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Edit
                      id={client.id}
                      field={"street"}
                      contact={keys[index]}
                    />
                    <Delete
                      id={client.id}
                      field={"street"}
                      contact={keys[index]}
                    />
                  </View>
                </ListItem.Accordion>
                <Card.Divider />
              </ScrollView>
            </View>
          ))}
        </View>
      );
    } else {
      // Handle the case when contactList is undefined or not an object
      //Maybe add a function that adds the contact if it is undefined because that meant that it did not find the variable in the client document
      return (
        <View>
          <Text>No Contacts Found</Text>
        </View>
      );
      // You can choose to return early or perform some other error handling
    }
    // console.log(`Render Contacts ${keys}`);
  };

  // useEffect(() => {}, [quoteData]); // Call renderQuoteList whenever data changes

  // Renders Active or Inactive on the screen based on bool value

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
      <View>{renderContacts(contactList)}</View>
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
