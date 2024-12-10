import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { readAsStringAsync } from "expo-file-system";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { firebase } from "../config";
import { Table, Row, Rows } from "react-native-table-component";
import Papa from "papaparse";
import { Card, FAB } from "@rneui/themed";
import { QuoteStyles } from "../components/List/styles/Quote.styles";
import { Client } from "../App";
import { DataContext } from "../components/ContextGetters/DataContext";

export default function AddQuote({ route, navigation }) {
  // pass selected client data
  const data = useContext(DataContext);
  const { ClientNumber } = route.params;
  const client: Client = data.find((item) => item.CustomerNum === ClientNumber);
  //console.log(`CLIENT ID: ${client.id}`);

  const [formData, setFormData] = useState({
    IssueDate: "",
    ExpireDate: "",
    Label: "",
    LegalTerms: "",
    Notes: "",
    QuoteNumber: "",
    ClientName: client.ClientName,
    Link: "",
  });

  const [lineItems, setLineItems] = useState([
    { id: 1, Title: "", Description: "", Quantity: "", Price: "" },
  ]);

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: lineItems.length + 1,
        Title: "",
        Description: "",
        Quantity: "",
        Price: "",
      },
    ]);
  };

  const handleLineItemChange = (id, field, value) => {
    const updatedLineItems = lineItems.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setLineItems(updatedLineItems);
  };

  const deleteLineItem = (id) => {
    const updatedLineItems = lineItems.filter((item) => item.id !== id);
    setLineItems(updatedLineItems);
  };

  const saveQuoteToFirebase = async () => {
    const db = firebase.firestore();
    try {
      // Add quote data to the "Quotes" collection
      const quoteDocRef = await db.collection("Quotes").add({
        ...formData,
        ClientNumber: client.CustomerNum,
      });

      // Add each line item to the "LineItems" subcollection
      const lineItemsCollectionRef = quoteDocRef.collection("LineItems");
      for (const lineItem of lineItems) {
        await lineItemsCollectionRef.add(lineItem);
      }

      alert("Quote and line items added successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error adding quote to Firebase: ", error);
      alert("Failed to add quote. Please try again.");
    }
  };

  const renderItem = () => (
    <View style={styles.overlayContent}>
      <ScrollView>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={formData.Label}
          onChangeText={(value) => setFormData({ ...formData, Label: value })}
        />
        <TextInput
          style={styles.input}
          placeholder="Link"
          value={formData.Link}
          onChangeText={(value) => setFormData({ ...formData, Link: value })}
        />
       
        <Button title="Add" onPress={saveQuoteToFirebase} />
      </ScrollView>
    </View>
  );

  return (
    <View style={{ flex: 1, width: "100%" }}>
      <ScrollView>{renderItem()}</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  deleteButton: {
    alignItems: "center",
    backgroundColor: "red",
    padding: 10,
    marginTop: 10,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 5,
  },
  cell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    padding: 5,
  },
  cellText: {
    textAlign: "center",
    flexWrap: "wrap",
  },
  tableContainer: {
    marginTop: 20,
  },
  head: {
    height: 40,
    backgroundColor: "#f1f8ff",
  },
  text: {
    margin: 6,
  },
  fabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
    marginBottom: 5,
  },
  fab: {
    width: 56,
    height: 56,
  },
  input: {
    flexWrap: "wrap",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
    padding: 5,
    width: "100%", // Ensure the input takes up the full width
  },
  lineItemCard: {
    flex: 1,
    backgroundColor: "white",
    width: "100%", // Ensure the Card takes up the full width
    marginBottom: 10, // Adjust spacing between cards as needed
  },
  overlayContent: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 20,
    borderRadius: 10,
  },
});
