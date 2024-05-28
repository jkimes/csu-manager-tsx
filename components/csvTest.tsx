import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  ScrollView,
} from "react-native";
import { readAsStringAsync } from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { firebase } from "../config"; // Assuming you have your Firebase config in a separate file

const CSVTest: React.FC = () => {
  const [csvData, setCsvData] = useState<string[][]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const file = await DocumentPicker.getDocumentAsync({
          type: "text/csv", // Specify the file type you want to pick
        });

        if (!file.canceled) {
          const doc = file.assets[0];
          console.log(`DOC: ${doc}`);
          const fileContents = await readAsStringAsync(doc.uri);
          if (fileContents) {
            // Splitting CSV content into rows
            const rows = fileContents.split("\n");
            // Parsing each row into array of values
            const data = rows.map((row) => row.split(","));
            setCsvData(data);
          }
        }
      } catch (error) {
        console.error("Error picking file:", error);
      }
    };

    fetchData();
  }, []);

  const handleUpload = async () => {
    try {
      // Process CSV data and update Firebase
      await updateFirebase(csvData);
    } catch (error) {
      console.error("Error uploading CSV:", error);
    }
  };

  const updateFirebase = async (data: string[][]) => {
    if (data.length === 0) {
      console.warn("No CSV data to upload.");
      return;
    }

    const headerRow = data[0];
    const clientsData = data.slice(1); // Exclude header row

    const db = firebase.firestore();

    for (const client of clientsData) {
      const clientNumber = client[0]; // Assuming client number is in the first column

      const docRef = db.collection("test").doc(clientNumber);
      const doc = await docRef.get();

      if (doc.exists) {
        // Update existing document with data from CSV row
        const updateData: { [key: string]: any } = {};
        headerRow.forEach((field, index) => {
          updateData[field] = client[index];
        });
        await docRef.update(updateData);
      } else {
        // Create new document with data from CSV row
        const newData: { [key: string]: any } = {};
        headerRow.forEach((field, index) => {
          newData[field] = client[index];
        });
        await docRef.set(newData);
      }
    }

    console.log("Firebase database updated successfully!");
  };

  const renderItem = ({ item }: { item: string[] }) => (
    <View style={styles.row}>
      {item.map((value, idx) => (
        <View key={idx} style={styles.cell}>
          <Text style={styles.cellText}>{value}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Upload CSV" onPress={handleUpload} />
      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>
        CSV Data:
      </Text>
      <ScrollView horizontal>
        <FlatList
          data={csvData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ marginTop: 10, borderWidth: 1, borderColor: "black" }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default CSVTest;
