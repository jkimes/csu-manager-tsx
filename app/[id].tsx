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
import { Card, Button, Tab, TabView } from "@rneui/themed";
import { DataContext, useDataContext } from "../components/DataContext";
import { setStatusBarBackgroundColor } from "expo-status-bar";
import { QuoteContext } from "../components/QuoteContext";
import { CardDivider } from "@rneui/base/dist/Card/Card.Divider";
import Delete from "../components/Buttons/Delete";
import Edit from "../components/Buttons/Edit";
// import { Stack, useLocalSearchParams, Tabs } from "expo-router";

export default function SingleClient({ route, navigation }) {
  const data = useContext(DataContext);
  const quotes = useContext(QuoteContext);
  const [activeTab, setActiveTab] = React.useState<number>(0); // State to manage the active tab
  const { ClientNumber, ClientEmail, ClientPhone, ClientName } = route.params;
  let client;

  // Log the values of the route params to the console
  console.log("ClientName:", ClientName);
  console.log("ClientEmail:", ClientEmail);

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

  // Will open the Phone app and paste the phone number in it if the number is not 0
  function makePhoneCall(number: number) {
    if (number === 0) {
      return "No number to call";
    }
    if (Platform.OS === "android") {
      Linking.openURL(`tel:${number}`);
    } else {
      Linking.openURL(`telprompt:${number}`);
    }
  }
  function sendEmail(email: string) {
    console.log(`send email to ${email}`);
    Linking.openURL(`mailto:${email}`);
  }

  // Takes the JSON Object document from firebase and convert it to a Map so i can use .get() funcition
  function convertObjectToMap(Obj) {
    return new Map(Object.entries(Obj));
  }

  // Filters Quotes by the Client number that is passed through route.params (filters quotes by client that is selected)
  const filteredQuotes = quotes.filter(
    (item) => item.ClientNumber === ClientNumber
  );

  //Converts the LineItems subcollection inside of the quote data into a Map. However it just makes the whole document the value and the key is a random code
  const quotesWithLineItemsAsMap = filteredQuotes.map((quote) => ({
    ...quote,
    lineItemsMap: new Map(quote.lineItems.map((item) => [item.id, item])),
  }));

  // console.log("Quotes with Line Items as Map:", quotesWithLineItemsAsMap);
  // quotesWithLineItemsAsMap.forEach((quote) => {
  //   console.log(
  //     "&*Line Items Map:",
  //     quote.lineItemsMap.get("xTgVN8NzqcPPxyKEx7I8").Price
  //   );
  // });

  // Renders filtered quotes with the .map() function
  const renderQuotesWithLineItems = (quotes) => {
    return (
      <View>
        <Card containerStyle={styles.cardContainer}>
          <CardDivider />
          {/* Render labels for each column */}
          <View style={styles.lineItemContainer}>
            <Text style={styles.columnLabel}>Product or Service</Text>
            <Text style={styles.columnLabel}>Price</Text>
            <Text style={styles.columnLabel}>Quantity</Text>
            <Text style={styles.columnLabel}>Line Total</Text>
          </View>
          <CardDivider />
          {/* Render line items */}
          {quotes.map((quote) => (
            <View key={quote.id}>
              {quote.lineItems.map((item) => (
                <View key={item.id} style={styles.lineItemContainer}>
                  <Text style={styles.column}>{item.Title}</Text>
                  <Text style={styles.column}>${item.Price}</Text>
                  <Text style={styles.column}>{item.Quantity}</Text>
                  <Text style={styles.column}>
                    ${item.Price * item.Quantity}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </Card>
      </View>
    );
  };

  // Grabs the matching Client Document from the Data and stores it for manipulation
  data.forEach((item) => {
    if (item.ClientNumber === ClientNumber) {
      client = item;
      // console.log("$$Found Client", client);
    }
  });
  const active = client.Active;

  // const Address = convertObjectToMap(client.Address);

  const handleActive = (bool: boolean) => {
    return bool ? "Active" : "Inactive";
  };

  const handleAddress = (street: string, city: string) => {
    if (street === null || street.trim() === '""') {
      return "No address found";
    } else {
      return `${street}, ${city}`;
    }
  };

  function formatPhoneNumber(phone) {
    const cleaned = ("" + phone).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return "(" + match[1] + ")-" + match[2] + "-" + match[3];
    }
    return "No number found";
  }

  const handlePhone = (phone: number) => {
    if (phone === null || phone === 0) {
      return "No number found";
    } else return formatPhoneNumber(phone);
  };

  const handleEmail = (email: string) => {
    if (email === null || email.trim() === '""') {
      return "No email found";
    } else return email;
  };

  const tabContent = {
    0: (
      <View style={{ flex: 1 }}>
        <ScrollView>
          <Card
            containerStyle={styles.cardContainer}
            wrapperStyle={styles.cardContentContainer}
          >
            <Card.Title style={styles.cardTitle}>Name </Card.Title>
            <View style={{ flexDirection: "row" }}>
              <Text>{ClientName}</Text>
            </View>
          </Card>
          <Card.Divider></Card.Divider>

          <Card
            containerStyle={styles.cardContainer}
            wrapperStyle={styles.cardContentContainer}
          >
            <Card.Title style={styles.cardTitle}>Client # </Card.Title>
            <Text>{ClientNumber}</Text>
          </Card>
          <Card.Divider></Card.Divider>

          <Card
            containerStyle={styles.cardContainer}
            wrapperStyle={styles.cardContentContainer}
          >
            <Card.Title style={styles.cardTitle}>Address</Card.Title>
            <Text>
              {handleAddress(client.Address_Street, client.Address_City)}
            </Text>
          </Card>
          <Card.Divider></Card.Divider>

          <Card containerStyle={styles.cardContainer}>
            <Card.Title style={styles.cardTitle}>Email</Card.Title>
            <View
              style={{ flexDirection: "row", alignContent: "space-between" }}
            >
              <TouchableOpacity
                onPress={() => sendEmail(ClientEmail.toString())}
              >
                <Text>{handleEmail(ClientEmail)}</Text>
              </TouchableOpacity>
              <Delete id={client.id} field={"ClientEmail"} />
              <Edit id={client.id} field={"ClientEmail"} />
            </View>
          </Card>
          <Card.Divider></Card.Divider>

          <Card containerStyle={styles.cardContainer}>
            <TouchableOpacity onPress={() => makePhoneCall(ClientPhone)}>
              <Card.Title style={styles.cardTitle}>Phone</Card.Title>
              <Text>{handlePhone(ClientPhone)}</Text>
            </TouchableOpacity>
          </Card>
          <Card.Divider></Card.Divider>

          <Card containerStyle={styles.cardContainer}>
            <Card.Title style={styles.cardTitle}>Job Status</Card.Title>
            <Text>{handleActive(active)}</Text>
          </Card>
          <Card.Divider></Card.Divider>

          <Card containerStyle={styles.cardContainer}>
            <TouchableOpacity>
              <Card.Title style={styles.cardTitle}>Job Site {}</Card.Title>
              <Text>{handleAddress(client.Site_Street, client.Site_City)}</Text>
            </TouchableOpacity>
          </Card>
          <Card.Divider></Card.Divider>
        </ScrollView>
      </View>
    ),
    1: (
      <View>
        <Card containerStyle={styles.cardContainer}>
          <Card.Title style={styles.cardTitle}>
            <Text>Title!</Text>
          </Card.Title>
          <CardDivider />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View>
              <Text>{client.ClientName}</Text>
              <Text>{handleEmail(client.ClientEmail)}</Text>
              <Text>{handleAddress(client.Site_Street, client.Site_City)}</Text>
              <Text>{handlePhone(client.ClientPhone)}</Text>
            </View>
            <View>
              <Text>Issue Date</Text>
              <Text>Expiry Date </Text>
            </View>
          </View>

          {renderQuotesWithLineItems(filteredQuotes)}
        </Card>

        {/* Add any additional content for Tab 2 */}
      </View>
    ),
  };

  return (
    <View>
      <Tab value={activeTab} onChange={setActiveTab} dense>
        <Tab.Item>Client info</Tab.Item>
        <Tab.Item>Quotes</Tab.Item>
      </Tab>

      {/* Container for buttons to switch tabs */}
      {/* <View style={styles.buttonContainer}>
        <Button
          title="Info"
          onPress={() => setActiveTab("Info")}
          color={activeTab === "Info" ? "blue" : "gray"} // Change button color based on active tab
        />
        <Button
          title="Invoices"
          onPress={() => setActiveTab("Invoices")}
          color={activeTab === "Invoices" ? "blue" : "gray"} // Change button color based on active tab
        />
      </View> */}

      {/* Container for tabs with custom styles */}
      <View style={styles.tabContainer}>
        {/* Tabs with custom styles */}
        {/* <Tabs
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          tabs={[
            { key: "tab1", title: "Quotes" },
            { key: "tab2", title: "Invoices" },
          ]}
        /> */}

        {/* Conditional rendering based on active tab */}
        {tabContent[activeTab]}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row", // Align buttons horizontally
    justifyContent: "space-evenly", // Space buttons evenly horizontally
    backgroundColor: "gray",
    marginTop: 1,
  },
  tabContainer: {
    backgroundColor: "white", // Set background color to black
    height: "90%",
  },
  tabText: {
    color: "black", // Set text color to white
  },
  cardContainer: {
    borderWidth: 0, // Set borderWidth to 0 to remove borders
    margin: 0,
    marginTop: 0,
    elevation: 0,
    width: "100%",
  },
  cardTitle: {
    textAlign: "left",
    marginBottom: 1,
    marginTop: 0,
  },
  tabViewItem: {
    width: "100%",
  },
  cardContentContainer: {
    marginTop: 0,
  },
  lineItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
    width: "100%",
  },
  column: {
    flex: 1,
  },
  columnLabel: {
    flex: 1,
    fontWeight: "bold",
  },
});

// export default SingleClient;

// type SearchParamType = {
//   id: number;
//   description: string;
//   age: number;
//   name: string;
// };

// const Home = () => {
//     const { id, description, age, name } = useLocalSearchParams<SearchParamType>();

//     return <></>
// }
