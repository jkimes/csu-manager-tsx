import React, { useState, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  Platform,
  Linking,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Card, Button, Tab, TabView, ListItem, Icon } from "@rneui/themed";

// custom imports
import Delete from "../components/Buttons/Delete";
import Edit from "../components/Buttons/Edit";
import QuoteList from "../components/List/QuoteList";
import ContactList from "../components/List/ContactList";
import { Client, LineItem } from "../App";
import { DataContext } from "../components/DataContext";
import { QuoteContext } from "../components/QuoteContext";
import { CardDivider } from "@rneui/base/dist/Card/Card.Divider";
import {
  makePhoneCall,
  sendEmail,
  DisplayJobStatus,
  handleAddress,
  handlePhone,
  handleEmail,
} from "../components/helperFunctions";
import { idStyles } from "./styles/[id].styles";

export default function SingleClient({ route, navigation }) {
  const data = useContext(DataContext);
  const quotes = useContext(QuoteContext);
  const [activeTab, setActiveTab] = React.useState<number>(0); // State to manage the active tab
  const { ClientNumber, ClientEmail, ClientPhone, ClientName } = route.params;
  const client: Client = data.find(
    (item) => item.ClientNumber === ClientNumber
  );

  // Log the values of the route params to the console
  // console.log("ClientName:", ClientName);
  // console.log("ClientEmail:", ClientEmail);

  // Check if any of the required params are undefined
  if (
    ClientNumber === undefined ||
    ClientEmail === undefined ||
    ClientPhone === undefined ||
    ClientName === undefined
  ) {
    console.error("One or more route params are missing or undefined");
    return (
      <Text>Error: One or more route params are missing or undefined</Text>
    );
  }

  const [index, setIndex] = React.useState(0); // for tab component

  const tabContent = {
    0: (
      <View style={{ flex: 1 }}>
        <ScrollView>
          <ListItem.Swipeable
            leftContent={(action) => (
              <Delete
                id={client.id}
                field={"ClientName"}
                collection="clients"
              />
            )}
            rightContent={(action) => (
              <Edit id={client.id} field={"ClientName"} collection="clients" />
            )}
          >
            <Card.Title style={idStyles.cardTitle}> Name </Card.Title>
            <View
              style={{ flexDirection: "row", alignContent: "space-between" }}
            >
              <Text>{client.ClientName}</Text>
            </View>
          </ListItem.Swipeable>

          <Card.Divider></Card.Divider>

          <ListItem.Swipeable
            leftWidth={80}
            rightWidth={90}
            // minSlideWidth={40}
            leftContent={(action) => (
              <Delete
                id={client.id}
                field={"ClientNumber"}
                collection="clients"
              />
            )}
            rightContent={(action) => (
              <Edit
                id={client.id}
                field={"ClientNumber"}
                collection="clients"
              />
            )}
          >
            <Card.Title style={idStyles.cardTitle}>Client # </Card.Title>
            <View
              style={{ flexDirection: "row", alignContent: "space-between" }}
            >
              <Text>{client.ClientNumber}</Text>
            </View>
          </ListItem.Swipeable>

          <Card.Divider />

          <ListItem.Swipeable
            leftContent={(action) => (
              <Delete
                id={client.id}
                field={"Address_Street"}
                collection="clients"
              />
            )}
            rightContent={(action) => (
              <Edit
                id={client.id}
                field={"Address_Street"}
                collection="clients"
              />
            )}
          >
            <Card.Title style={idStyles.cardTitle}>Address</Card.Title>
            <View
              style={{ flexDirection: "row", alignContent: "space-between" }}
            >
              <Text>
                {handleAddress(client.Address_Street, client.Address_City)}
              </Text>
            </View>
          </ListItem.Swipeable>

          <Card.Divider />

          <ListItem.Swipeable
            leftContent={(action) => (
              <Delete
                id={client.id}
                field={"ClientEmail"}
                collection="clients"
              />
            )}
            rightContent={(action) => (
              <Edit id={client.id} field={"ClientEmail"} collection="clients" />
            )}
          >
            <Card.Title style={idStyles.cardTitle}>Email</Card.Title>
            <View
              style={{ flexDirection: "row", alignContent: "space-between" }}
            >
              <TouchableOpacity
                onPress={() => sendEmail(client.ClientEmail.toString())}
              >
                <Text>{handleEmail(client.ClientEmail)}</Text>
              </TouchableOpacity>
            </View>
          </ListItem.Swipeable>

          <Card.Divider></Card.Divider>

          <ListItem.Swipeable
            leftContent={(action) => (
              <Delete
                id={client.id}
                field={"ClientPhone"}
                collection="clients"
              />
            )}
            rightContent={(action) => (
              <Edit id={client.id} field={"ClientPhone"} collection="clients" />
            )}
          >
            <Card.Title style={idStyles.cardTitle}>Phone</Card.Title>
            <View
              style={{ flexDirection: "row", alignContent: "space-between" }}
            >
              <TouchableOpacity
                onPress={() => makePhoneCall(client.ClientPhone)}
              >
                <Text>{handlePhone(client.ClientPhone)}</Text>
              </TouchableOpacity>
            </View>
          </ListItem.Swipeable>

          <Card.Divider></Card.Divider>

          <ListItem.Swipeable
            rightContent={(action) => <Edit id={client.id} field={"Active"} />}
          >
            <Card.Title style={idStyles.cardTitle}>Job Status</Card.Title>
            <View
              style={{ flexDirection: "row", alignContent: "space-between" }}
            >
              <Text>{DisplayJobStatus(client.Active)}</Text>
            </View>
          </ListItem.Swipeable>

          <Card.Divider></Card.Divider>

          <ListItem.Swipeable
            leftContent={(action) => (
              <Delete
                id={client.id}
                field={"Site_Street"}
                collection="clients"
              />
            )}
            rightContent={(action) => (
              <Edit id={client.id} field={"Site_Street"} collection="clients" />
            )}
          >
            <TouchableOpacity>
              <Card.Title style={idStyles.cardTitle}>Job Site {}</Card.Title>
              <Text>{handleAddress(client.Site_Street, client.Site_City)}</Text>
            </TouchableOpacity>
          </ListItem.Swipeable>
          <Card.Divider></Card.Divider>
        </ScrollView>
      </View>
    ),
    1: (
      <View>
        <Card containerStyle={idStyles.cardContainer}>
          <Card.Title style={idStyles.cardTitle}>
            <Text>Quote List</Text>
          </Card.Title>
        </Card>

        <Text>Here </Text>
        <QuoteList
          navigation={navigation}
          route={route}
          ClientNumber={client.ClientNumber}
        ></QuoteList>

        {/* Add any additional content for Tab 2 */}
      </View>
    ),
    2: (
      <View>
        <ContactList
          ClientNumber={client.ClientNumber}
          navigation={navigation}
          route={route}
        ></ContactList>
      </View>
    ),
  };

  return (
    <View>
      <Tab value={activeTab} onChange={setActiveTab} dense>
        <Tab.Item>Client info</Tab.Item>
        <Tab.Item>Quotes</Tab.Item>
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
