import React, { useState, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  Platform,
  Linking,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Card, Button, Tab, TabView, ListItem, Icon } from "@rneui/themed";

// custom imports
import Delete from "../components/Buttons/Delete";
import Edit from "../components/Buttons/Edit";
import QuoteList from "../components/List/QuoteList";
import ContactList from "../components/List/ContactList";
import { Vendor, LineItem } from "../App";

import { CardDivider } from "@rneui/base/dist/Card/Card.Divider";
import {
  //makePhoneCall,
  handlePhoneInteraction,
  sendEmail,
  DisplayJobStatus,
  handleAddress,
  handlePhone,
  handleEmail,
} from "../components/helperFunctions";
import { idStyles } from "./styles/[id].styles";
import { VendorsContext } from "../components/VendorsContext";

function displayEmail(email: string) {
  console.log(` Contact Email ${email}`);
  if (email.trim() === "") {
    console.log("inside if statement");
    return " No email found";
  } else {
    return email;
  }
}

const handlePress = async (url: string) => {
  const supported = await Linking.canOpenURL(url);

  if (supported) {
    await Linking.openURL(url);
  } else {
    Alert.alert(`Don't know how to open this URL: ${url}`);
  }
};

function handleLink(link: string) {
  // console.log(`Link: ${link}`);
  if (link === "") {
    return "No Link";
  } else return link;
}

export default function VendorProfile({ route, navigation }) {
  const data = useContext(VendorsContext);

  const [activeTab, setActiveTab] = React.useState<number>(0); // State to manage the active tab
  const { VendorNum } = route.params;
  const vendorItem: Vendor = data.find((item) => item.VendorNum === VendorNum);
  //   console.log(`${vendorItem.id}`);
  // Log the values of the route params to the console
  // console.log("ClientName:", ClientName);
  // console.log("ClientEmail:", ClientEmail);

  // Check if any of the required params are undefined
  if (VendorNum === undefined) {
    console.error("One or more route params are missing or undefined");
    return (
      <Text>Error: One or more route params are missing or undefined</Text>
    );
  }
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const [index, setIndex] = React.useState(0); // for tab component
  const [expanded, setExpanded] = useState(false);
  const tabContent = {
    0: (
      <View style={{ flex: 1 }}>
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
                    <ListItem.Title
                      style={[idStyles.cardTitle, { marginRight: 10 }]}
                    >
                      <Card.Title>Name</Card.Title>
                    </ListItem.Title>
                    <ListItem.Subtitle>
                      <Text>{vendorItem.Name}</Text>
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
              <Edit
                id={vendorItem.id}
                field={"VendorName"}
                collection="vendors"
              />
              <Delete
                id={vendorItem.id}
                field={"VendorName"}
                collection="vendors"
              />
            </View>
          </ListItem.Accordion>

          <Card.Divider></Card.Divider>

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
                    <ListItem.Title
                      style={[idStyles.cardTitle, { marginRight: 10 }]}
                    >
                      <Card.Title style={idStyles.cardTitle}>
                        {"Vendor #"}
                      </Card.Title>
                    </ListItem.Title>

                    <View
                      style={{
                        flexDirection: "row",
                        alignContent: "space-between",
                      }}
                    >
                      <Text>{vendorItem.VendorNum}</Text>
                    </View>
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
                id={vendorItem.id}
                field={"VendorNum"}
                collection="vendors"
              />
              <Delete
                id={vendorItem.id}
                field={"VendorNum"}
                collection="vendors"
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
                    <ListItem.Title
                      style={[idStyles.cardTitle, { marginRight: 10 }]}
                    >
                      <Card.Title style={idStyles.cardTitle}>
                        Web Link
                      </Card.Title>
                    </ListItem.Title>
                    <TouchableOpacity
                      onPress={() => handlePress(vendorItem.WebsiteLink)}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignContent: "space-between",
                        }}
                      >
                        <Text> {handleLink(vendorItem.WebsiteLink)}</Text>
                      </View>
                    </TouchableOpacity>
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
                id={vendorItem.id}
                field={"Address_Street"}
                collection="vendors"
              />
              <Delete
                id={vendorItem.id}
                field={"Address_Street"}
                collection="vendors"
              />
            </View>
          </ListItem.Accordion>

          <Card.Divider></Card.Divider>

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
                    <ListItem.Title
                      style={[idStyles.cardTitle, { marginRight: 10 }]}
                    >
                      <Card.Title style={idStyles.cardTitle}>
                        Specialty
                      </Card.Title>
                    </ListItem.Title>
                    <View
                      style={{
                        flexDirection: "row",
                        alignContent: "space-between",
                      }}
                    >
                      <Text>{vendorItem.Specialty}</Text>
                    </View>
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
              <Edit id={vendorItem.id} field={"Specialty"} />
            </View>
          </ListItem.Accordion>

          <Card.Divider></Card.Divider>

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
                    <ListItem.Title
                      style={[idStyles.cardTitle, { marginRight: 10 }]}
                    >
                      <Card.Title style={idStyles.cardTitle}>Type</Card.Title>
                    </ListItem.Title>
                    <View
                      style={{
                        flexDirection: "row",
                        alignContent: "space-between",
                      }}
                    >
                      <TouchableOpacity>
                        <Text>{vendorItem.Type}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ListItem.Content>
              </>
            }
            isExpanded={expandedIndex === 4}
            onPress={() => {
              setExpandedIndex(expandedIndex === 4 ? null : 4);
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Edit id={vendorItem.id} field={"Type"} collection="vendors" />
              <Delete id={vendorItem.id} field={"Type"} collection="vendors" />
            </View>
          </ListItem.Accordion>

          <Card.Divider></Card.Divider>
        </ScrollView>
      </View>
    ),

    1: (
      <View style={{ flex: 1 }}>
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
                    <ListItem.Title
                      style={[idStyles.cardTitle, { marginRight: 10 }]}
                    >
                      <Card.Title style={idStyles.cardTitle}>
                        Contact Name
                      </Card.Title>
                    </ListItem.Title>
                    <View
                      style={{
                        flexDirection: "row",
                        alignContent: "space-between",
                      }}
                    >
                      <Text>{vendorItem.ContactName}</Text>
                    </View>
                  </View>
                </ListItem.Content>
              </>
            }
            isExpanded={expandedIndex === 5}
            onPress={() => {
              setExpandedIndex(expandedIndex === 5 ? null : 5);
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Edit
                id={vendorItem.id}
                field={"ContactName"}
                collection="vendors"
              />
              <Delete
                id={vendorItem.id}
                field={"ContactName"}
                collection="vendors"
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
                    <ListItem.Title
                      style={[idStyles.cardTitle, { marginRight: 10 }]}
                    >
                      <Card.Title style={idStyles.cardTitle}>Email</Card.Title>
                    </ListItem.Title>
                    <View
                      style={{
                        flexDirection: "row",
                        alignContent: "space-between",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => sendEmail(vendorItem.Email.toString())}
                      >
                        <Text>{handleEmail(vendorItem.Email)}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ListItem.Content>
              </>
            }
            isExpanded={expandedIndex === 6}
            onPress={() => {
              setExpandedIndex(expandedIndex === 6 ? null : 6);
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Edit id={vendorItem.id} field={"Email"} collection="vendors" />
              <Delete id={vendorItem.id} field={"Email"} collection="vendors" />
            </View>
          </ListItem.Accordion>

          <Card.Divider></Card.Divider>

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
                    <ListItem.Title
                      style={[idStyles.cardTitle, { marginRight: 10 }]}
                    >
                      <Card.Title style={idStyles.cardTitle}>Phone</Card.Title>
                    </ListItem.Title>
                    <View
                      style={{
                        flexDirection: "row",
                        alignContent: "space-between",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => handlePhoneInteraction(vendorItem.Tel1)}
                      >
                        <Text>{handlePhone(vendorItem.Tel1)}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ListItem.Content>
              </>
            }
            isExpanded={expandedIndex === 7}
            onPress={() => {
              setExpandedIndex(expandedIndex === 7 ? null : 7);
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Edit id={vendorItem.id} field={"Tel1"} collection="vendors" />
              <Delete id={vendorItem.id} field={"Tel1"} collection="vendors" />
            </View>
          </ListItem.Accordion>

          <Card.Divider></Card.Divider>

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
                    <ListItem.Title
                      style={[idStyles.cardTitle, { marginRight: 10 }]}
                    >
                      <Card.Title style={idStyles.cardTitle}>
                        Phone 2
                      </Card.Title>
                    </ListItem.Title>
                    <View
                      style={{
                        flexDirection: "row",
                        alignContent: "space-between",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => handlePhoneInteraction(vendorItem.Tel1)}
                      >
                        <Text>{handlePhone(vendorItem.Tel2)}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ListItem.Content>
              </>
            }
            isExpanded={expandedIndex === 8}
            onPress={() => {
              setExpandedIndex(expandedIndex === 8 ? null : 8);
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Edit id={vendorItem.id} field={"Tel2"} collection="vendors" />
              <Delete id={vendorItem.id} field={"Tel2"} collection="vendors" />
            </View>
          </ListItem.Accordion>

          <Card.Divider></Card.Divider>
        </ScrollView>
      </View>
    ),
  };

  return (
    <View>
      <Tab value={activeTab} onChange={setActiveTab} dense>
        <Tab.Item>Vendor info</Tab.Item>
        <Tab.Item>Contact Info</Tab.Item>
      </Tab>

      {/* Container for tabs with custom styles */}
      <View style={idStyles.tabContainer}>
        {/* Tabs with custom styles */}

        {/* Conditional rendering based on active tab */}
        {tabContent[activeTab]}
      </View>
    </View>
  );
}


