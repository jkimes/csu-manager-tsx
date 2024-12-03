import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  ThemeProvider,
  createTheme,
  Button,
  Icon,
  Card,
  lightColors,
} from "@rneui/themed";
import { Timestamp } from "firebase/firestore";


import Clientpage from "./app/clientpage";
//import UpdateData from "./components/updateData";
import SignIn from "./app/SignIn";
import ClientUploader from "./components/Uploaders/ClientUploader";
import SingleClient from "./app/[id]";
import Wip from "./app/Wip";
import Vendors from "./app/Vendors";
import { DataContext } from "./components/ContextGetters/DataContext";
import { QuoteContext } from "./components/ContextGetters/QuoteContext";
import { WipContext } from "./components/ContextGetters/WipContext";
import { PaymentContext } from "./components/ContextGetters/PaymentContext";
import { CustomerExpContext } from "./components/ContextGetters/CustomerExpContext";
import AddClient from "./app/AddClient";
import AddQuote from "./app/AddQuote";
import { firebase, firebaseConfig } from "./config";
import { VendorsContext } from "./components/ContextGetters/VendorsContext";
import VendorProfile from "./app/[vendor]";
import selectDB from "./app/selectDB";
import VendorUploader from "./components/Uploaders/VendorUploader";
import WipUploader from "./components/Uploaders/WipUploader";
import PaymentUploader from "./components/Uploaders/PaymentUploader";
import CusExpenseUploader from "./components/Uploaders/CusExpenseUploader"


// const firestore = firebase.firestore();
// firestore.settings({
//   cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
//   persistence: false, // Ensure no offline persistence if you're working in a real-time environment
// }); 

// Define your types and interfaces
export interface Vendor {
  id: string;
  city: string;
  StreetAddress: string;
  VendorNum: number;
  Name: string;
  VendorContact: string;
  Tel1: number;
  Tel2: number;
  Email: string;
  Specialty: string;
  Type: string;
  WebsiteLink: string;
  ContactName: string;
}

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
  CustomerNum: number,
    CustomerName: string,
    Active: string,
    ClientName: string,
    ContactName: string,
    BillingStreet: string,
    BillingCity: string,
    BillingState: string,
    BillingZip: string,
    JobSiteStreet: string,
    JobSiteCity: string,
    JobSiteState: string,
    JobSiteZip: string,
    ClientEmail: string,
    ContactEmail: string,
    ClientPhone: number,
    ClientPhone2:number,
    ContactPh1: number,
    ContactPh2: number,
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
  Label: string;
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

export interface Payment {
  id: string;
  Bank: string;
  CkNumber: number;
  Customer: string;
  CustomerNum: number;
  Date: Timestamp;
  PmtAmount: number;
  PmtMethod: string;
  // Add more fields as needed
}
export interface Expense {
  id: string;
  VendorNumber: number;
  Vendor: string;
  Date: Timestamp;
  PayAmount: number;
  PayMethod: number;
  CKNumber: number;
  CustomerNum: string;
  CustomerName: string;
  Bank: string;
  ReExpense: string;
  // Add more fields as needed
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
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
    alignItems: "center", // Ensure all buttons are centered
    justifyContent: "flex-start",
  }}
>
  <Button
    title="WIP"
    onPress={() => navigation.navigate("WIP")}
    buttonStyle={{
      width: "100%",  // Set a standard width for all buttons
      height: 50,
      margin: 10,
      justifyContent: "center",
      alignItems: "center",
    }}
    titleStyle={{ alignSelf: "center" }}
  />

  <Button
    title="Clients"
    onPress={() => navigation.navigate("Clients")}
    buttonStyle={{
      width: "100%",  // Set a standard width for all buttons
      height: 50,
      margin: 10,
      justifyContent: "center",
      alignItems: "center",
    }}
    titleStyle={{ alignSelf: "center" }}
  />

  <Button
    title="Vendors"
    onPress={() => navigation.navigate("Vendors")}
    buttonStyle={{
      width: "100%",  // Set a standard width for all buttons
      height: 50,
      margin: 10,
      justifyContent: "center",
      alignItems: "center",
    }}
    titleStyle={{ alignSelf: "center" }}
  />

  <Button
    title="CSV Upload - Admin Only"
    onPress={() => navigation.navigate("SelectDB")}
    buttonStyle={{
      backgroundColor: "gray",
      width: "90%",  // Ensure consistent width
      height: 50,
      margin: 20,
      justifyContent: "center",
      alignItems: "center",
    }}
    titleStyle={{
      alignSelf: "center",
      fontSize: 9,  // Adjusted font size for readability
    }}
  />
</View>


    </View>
  );
}

const Stack = createNativeStackNavigator();
const theme = createTheme({
  lightColors: {
    primary: "black",
    secondary: "black",
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
  const [exp, setExp] = useState<Expense[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [data, setData] = useState<Client[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredData, setFilteredData] = useState<Client[]>([]);
  const [wip, setWip] = useState<Client[]>([]);
  const collectionRef = firebase.firestore().collection("clients");
  const quotesRef = firebase.firestore().collection("Quotes");
  const vendorsRef = firebase.firestore().collection("vendors");
  const wipRef = firebase.firestore().collection("wip");
  const paymentRef = firebase.firestore().collection("AR");
  const expenseRef = firebase.firestore().collection("customerExp");
  

  useEffect(() => {
    // Fetch initial data when component mounts
    fetchData();
    fetchQuotes();
    fetchWip();
    fetchPayments();
    console.log("App.tsx Expenses Data: " + JSON.stringify(exp));
    

    // Set up Firestore listener for vendors collection
    const unsubscribeExpenses = expenseRef
    .orderBy("VendorNumber")
    //.orderBy("CustomerNum")

    .onSnapshot((snapshot) => {
     const newData = snapshot.docs.map((doc) => ({
       id: doc.id,
       ...doc.data(),
     }));
     setExp(newData);
   });
   

    // Set up Firestore listener for clients collection
    const unsubscribeWip = wipRef.orderBy("name").onSnapshot((snapshot) => {
      const newData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWip(newData);
    });

    // Set up Firestore listener for vendors collection
    const unsubscribeVendors = vendorsRef.onSnapshot((snapshot) => {
      const newData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVendors(newData);
    });
     // Set up Firestore listener for vendors collection
     const unsubscribePayments = paymentRef
     .orderBy("CustomerNum")
     .orderBy("Date", "desc")
     .onSnapshot((snapshot) => {
      const newData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPayments(newData);
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
        //console.log("App.tsx Client Data: " + JSON.stringify(newData));
      });

    // Set up Firestore listener for quotes collection
    const unsubscribeQuotes = quotesRef.onSnapshot((snapshot) => {
      const fetchedQuotes: any[] = [];

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
      unsubscribeVendors();
      unsubscribePayments();
      unsubscribeExpenses();
      console.log("App.tsx Expenses Data: " + JSON.stringify(exp));
    };
  }, []);

  const fetchPayments = async () => {
    const snapshot = await paymentRef.get();
    if (snapshot.empty) {
      console.log("No matching results!");
    } else {
      const newData: DocumentData<Payment>[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Payment),
      }));
      setPayments(newData); // Update state with fetched data
    }
  };

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
      <CustomerExpContext.Provider value={exp}> 
      <PaymentContext.Provider value={payments}>
      <VendorsContext.Provider value={vendors}>
        <DataContext.Provider value={data}>
          <QuoteContext.Provider value={quotes}>
            <WipContext.Provider value={wip}>
              <NavigationContainer>
                <Stack.Navigator
                  screenOptions={({ navigation }) => ({
                    headerStyle: {
                      backgroundColor: theme?.lightColors?.secondary, // Set header background color to black
                    },
                    headerTintColor: "white",
                    headerRight: () => (
                      <Button
                        onPress={() => navigation.navigate("Home")}
                        icon={
                          <Icon
                            name="home"  // Name of the icon
                            type="font-awesome"  // Icon type (using FontAwesome in this case)
                            size={28}  // Size of the icon
                            color="white"  // Color of the icon
                            style={{ }}  // Adds spacing between icon and text marginRight: 10, height: 75 
                          />
                        }
                        iconPosition="left"  // Icon appears to the left of the title
                      />
                    ),
                  })}
                >
                 
                  <Stack.Screen name="Home" component={HomeScreen} />
                  <Stack.Screen name="Clients" component={Clientpage} />
                  <Stack.Screen name="Profile" component={SingleClient} />
                  <Stack.Screen name="AddClient" component={AddClient} />
                  <Stack.Screen name="AddQuote" component={AddQuote} />
                  <Stack.Screen name="Vendors" component={Vendors} />
                  {/* <Stack.Screen name ="Sign In" component={SignIn}/> */}
                  <Stack.Screen
                    name="VendorProfile"
                    component={VendorProfile}
                  />
                  <Stack.Screen name="WIP" component={Wip} />
                  <Stack.Screen
                    name="Client Upload"
                    component={ClientUploader}
                  />
                  <Stack.Screen
                    name="Vendor Upload"
                    component={VendorUploader}
                  />
                  <Stack.Screen name="Wip Upload" component={WipUploader} />
                  <Stack.Screen name="Payment Upload" component={PaymentUploader} />
                  <Stack.Screen name="Expense Upload" component={CusExpenseUploader} />
                  <Stack.Screen name="SelectDB" component={selectDB} />
                </Stack.Navigator>
              </NavigationContainer>
            </WipContext.Provider>
          </QuoteContext.Provider>
        </DataContext.Provider>
      </VendorsContext.Provider>
      </PaymentContext.Provider>
      </CustomerExpContext.Provider>
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