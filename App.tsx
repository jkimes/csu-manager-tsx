import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ThemeProvider, createTheme, Button, Card } from "@rneui/themed";

import Clientpage from "./app/clientpage";
import SingleClient from "./app/[id]";
import Wip from "./app/Wip";
import VendorPage from "./app/VendorPage";
import { DataContext } from "./components/DataContext";
import { QuoteContext } from "./components/QuoteContext";
import { WipContext } from "./components/WipContext";
import AddClient from "./app/AddClient";
import { firebase, firebaseConfig } from "./config";

// Define your types and interfaces
type DocumentData<T> = T & { id: string };
export interface Contact {
  email: string;
  name: string;
  street: string;
  city: string;
  zip: string;
  phone: number;
}

export interface Client {
  id: string;
  ClientName: string;
  ClientNumber: number;
  ClientEmail: string;
  ClientPhone: number;
  Active: boolean;
  Address_City: string;
  Address_Street: string;
  Address_Zip: string;
  Address_State: string;
  Contacts: {
    [key: string]: Contact;
  };
  Site_Street: string;
  Site_City: string;
  Site_State: string;
  Site_Zip: string;
  // Add more fields as needed
}

export interface LineItem {
  id: string;
  Price: number;
  Quantity: number;
  Description: string;
  Title: string;
  // Add more fields as needed
}

export interface Quote {
  id: string;
  ClientNumber: number;
  ClientName: string;
  LegalTerms: string;
  Notes: string;
  QuoteNumber: number;
  // Add more fields as needed
  lineItems: LineItem[];
  IssueDate: string;
  ExpireDate: string;
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

function HomeScreen({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        marginTop: 20,
      }}
    >
      <Text style={{ fontWeight: "bold", alignSelf: "center" }}>
        CSU Manager
      </Text>
      <Image
        style={{ alignSelf: "center", height: 100, width: 100 }}
        source={require("./assets/icons/CSU.png")}
      />
      <Card.Divider style={{ width: "100%" }} />
      {/* Ensure the divider takes full width */}
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Button
          title="WIP"
          onPress={() => navigation.navigate("Wip")}
          buttonStyle={{
            width: "100%",
            height: 50,
            margin: 10,
            justifyContent: "center",
            alignItems: "center",
          }} // Adjust height as needed
          titleStyle={{ alignSelf: "center" }}
        />

        <Button
          title="Clients"
          onPress={() => navigation.navigate("Clients")}
          buttonStyle={{
            width: "100%",
            height: 50,
            margin: 10,
            justifyContent: "center",
            alignItems: "center",
          }} // Adjust height as needed
          titleStyle={{ alignSelf: "center" }}
        />

        {/* <Button
          title="Vendors"
          onPress={() => navigation.navigate("Vendors")}
          buttonStyle={{
            width: "100%",
            height: 50,
            margin: 10,
            justifyContent: "center",
            alignItems: "center",
          }} // Adjust height as needed
          titleStyle={{ alignSelf: "center" }}
        /> */}
      </View>
    </View>
  );
}

const Stack = createNativeStackNavigator();
const theme = createTheme({
  lightColors: {
    primary: "teal",
  },
  darkColors: {
    primary: "black",
  },
  components: {
    Button: {
      raised: false,
      color: "primary",
      titleStyle: { color: "white" },
    },
    Tab: {
      variant: "default",
      titleStyle: { color: "black" },
      indicatorStyle: { backgroundColor: "blue" },
    },
    CardDivider: {
      color: "black",
      width: 1,
      style: { marginBottom: 5 },
    },
  },
});
export default function App() {
  const [data, setData] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [wip, setWip] = useState<any[]>([]);
  const collectionRef = firebase.firestore().collection("clients");
  const quotesRef = firebase.firestore().collection("Quotes");
  const wipRef = firebase.firestore().collection("wip");

  useEffect(() => {
    // Fetch initial data when component mounts
    fetchData();
    fetchQuotes();
    fetchWip();

    // Set up Firestore listener for clients collection
    const unsubscribeWip = wipRef.orderBy("name").onSnapshot((snapshot) => {
      const newData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWip(newData);
    });

    // Set up Firestore listener for clients collection
    const unsubscribeClients = collectionRef
      .orderBy("ClientName")
      .onSnapshot((snapshot) => {
        const newData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(newData);
        setFilteredData(newData);
      });

    // Set up Firestore listener for quotes collection
    const unsubscribeQuotes = quotesRef.onSnapshot((snapshot) => {
      const fetchedQuotes = [];

      snapshot.forEach(async (doc) => {
        const quoteData = doc.data();
        const lineItemsRef = quotesRef.doc(doc.id).collection("LineItems");
        const lineItemsSnapshot = await lineItemsRef.get();
        const lineItems = lineItemsSnapshot.docs.map((lineItemDoc) => ({
          id: lineItemDoc.id,
          ...lineItemDoc.data(),
        }));

        const quoteWithLineItems = {
          id: doc.id,
          ...quoteData,
          lineItems,
        };

        fetchedQuotes.push(quoteWithLineItems);
      });

      setQuotes(fetchedQuotes);
    });

    return () => {
      // Clean up listeners
      unsubscribeClients();
      unsubscribeQuotes();
      unsubscribeWip();
    };
  }, []);

  const fetchWip = async () => {
    const snapshot = await wipRef.get();
    if (snapshot.empty) {
      console.log("No matching results!");
    } else {
      const newData: DocumentData<Client>[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Client),
      }));
      setWip(newData); // Update state with fetched data
    }
  };

  const fetchQuotes = async () => {
    try {
      const quotesRef = firebase.firestore().collection("Quotes");
      const snapshot = await quotesRef.get();
      const fetchedQuotes: DocumentData<Quote>[] = [];

      snapshot.forEach(async (doc) => {
        const quoteData = doc.data() as Quote;
        const lineItemsRef = quotesRef.doc(doc.id).collection("LineItems");
        const lineItemsSnapshot = await lineItemsRef.get();
        const lineItems = lineItemsSnapshot.docs.map((lineItemDoc) => ({
          id: lineItemDoc.id,
          ...(lineItemDoc.data() as LineItem),
        }));

        const quoteWithLineItems = {
          id: doc.id,
          ...quoteData,
          lineItems,
        };

        fetchedQuotes.push(quoteWithLineItems);
      });

      setQuotes(fetchedQuotes);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    }
  };

  const fetchData = async () => {
    const snapshot = await collectionRef.orderBy("ClientName").get();
    if (snapshot.empty) {
      console.log("No matching results!");
    } else {
      const newData: DocumentData<Client>[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Client),
      }));
      setData(newData); // Update state with fetched data
      setFilteredData(newData); // Initialize filteredData with fetched data
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <DataContext.Provider value={data}>
        <QuoteContext.Provider value={quotes}>
          <WipContext.Provider value={wip}>
            <NavigationContainer>
              <Stack.Navigator
                screenOptions={({ navigation }) => ({
                  headerStyle: {
                    backgroundColor: "black", // Set header background color to black
                  },
                  headerTintColor: "white",
                  headerRight: () => (
                    <Button
                      onPress={() => navigation.navigate("Home")}
                      title="Home"
                    />
                  ),
                })}
              >
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Clients" component={Clientpage} />
                <Stack.Screen name="Profile" component={SingleClient} />
                <Stack.Screen name="AddClient" component={AddClient} />
                <Stack.Screen name="Vendors" component={VendorPage} />
                <Stack.Screen name="Wip" component={Wip} />
              </Stack.Navigator>
            </NavigationContainer>
          </WipContext.Provider>
        </QuoteContext.Provider>
      </DataContext.Provider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    height: 100,
    // alignSelf: "center",
  },
});
