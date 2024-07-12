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
import { Client } from "../../App";
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

function displayEmail(email: string) {
  console.log(` Contact Email ${email}`);
  if (email.trim() === "") {
    console.log("inside if statement");
    return " No email found";
  } else {
    return email;
  }
}

function displayCell(cell: number) {
  console.log(` Contact Cell ${cell}`);
  if (cell === 0) {
    console.log("inside if statement");
    return " To add cell press arrow on the right";
  } else {
    return cell;
  }
}

const ContactList = ({ navigation, route, ClientNumber }) => {
  const { theme, updateTheme } = useTheme();
  const data = useContext(DataContext);
  const [visible, setVisible] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const client: Client = data.find(
    (item) => item?.CustomerNum === ClientNumber
  );
  console.log(JSON.stringify(client));

  const renderContacts = () => {
    return (
      <View>
        <View>
          <ScrollView>
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
                        <Text>{client.Contact}</Text>
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
                <Edit id={client.CustomerNum} field={"name"} />
                <Delete id={client.CustomerNum} field={"Contact"} />
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
                        <Card.Title>Contact Email</Card.Title>
                      </ListItem.Title>
                      <ListItem.Subtitle>
                        <TouchableOpacity
                          onPress={() => sendEmail(client?.ContactEmail)}
                        >
                          <Text>{displayEmail(client?.ContactEmail)}</Text>
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
                <Edit id={client.CustomerNum} field={"ContactEmail"} />
                <Delete id={client.CustomerNum} field={"ContactEmail"} />
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
                          onPress={() => makePhoneCall(client?.ContactCell)}
                        >
                          <Text>{handlePhone(client?.ContactCell)}</Text>
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
                <Edit id={client.CustomerNum} field={"ContactCell"} />
                <Delete id={client.CustomerNum} field={"ContactCell"} />
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
                        <Card.Title>Phone 2</Card.Title>
                      </ListItem.Title>
                      <ListItem.Subtitle>
                        <TouchableOpacity
                          onPress={() => makePhoneCall(client?.ContactTel2)}
                        >
                          <Text>{handlePhone(client?.ContactTel2)}</Text>
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
                <Edit id={client.CustomerNum} field={"ContactTel2"} />
                <Delete id={client.CustomerNum} field={"ContactTel2"} />
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
                        <Card.Title>Billing Address</Card.Title>
                      </ListItem.Title>
                      <ListItem.Subtitle style={{ flex: 1, flexWrap: "wrap" }}>
                        <Text>{client.BillingAddress}</Text>
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
                <Edit id={client.CustomerNum} field={"BillingAddress"} />
                <Delete id={client.CustomerNum} field={"BillingAddress"} />
              </View>
            </ListItem.Accordion>
            <Card.Divider />
          </ScrollView>
        </View>
      </View>
    );
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
      <View>{renderContacts()}</View>
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
