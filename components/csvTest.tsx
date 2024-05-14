import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  ScrollView,
} from "react-native";
import { readString, jsonToCSV } from "react-native-csv";
import { readAsStringAsync } from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { firebase, firebaseConfig } from "../config";

const CSVTest: React.FC = () => {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [jsonData, setJsonData] = useState<any[]>([]);
  const [cellWidth, setCellWidth] = useState<number>(100); // Default width for cells

  // Define the types for each field
  const fieldTypes = {
    clientNumber: "number",
    Address_Zip: "numer",
    Site_Zip: "number",
    Active: "boolean",
    ClientPhone: "numer",
    // Add more fields here as needed
  };

  useEffect(() => {
    if (csvData.length > 0) {
      let maxLength = 0;

      // Calculate the maximum length of any cell in the CSV data
      csvData.forEach((row) => {
        row.forEach((cell) => {
          maxLength = Math.max(maxLength, cell.length);
        });
      });

      // Set the width for cells based on the maximum length of any cell
      setCellWidth(maxLength * 10); // Adjust the multiplier to your preference
    }
  }, [csvData]);

  const handleUpload = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync({
        type: "text/csv", // Specify the file type you want to pick
      });

      if (!file.canceled) {
        const doc = file.assets[0];

        const parseResult = await readAsStringAsync(doc.uri);
        console.log(`DOC: ${parseResult}`);
        if (parseResult) {
          // Splitting CSV content into rows
          const rows = parseResult.split("\n");
          // Parsing each row into array of values
          const data = rows.map((row) => row.split(","));
          setCsvData(data);
          console.log(`CSV DATA IS SET`);
          // Process CSV data and update Firebase
          await updateFirebase(data);
        }
        // console.log(`Data: ${parseResult.data}`);
      }
    } catch (error) {
      console.error("Error picking file:", error);
    }
  };

  const updateFirebase = async (data: string[][]) => {
    const headerRow = data[0];
    const clientsData = data.slice(1); // Exclude header row

    const db = firebase.firestore();

    for (const client of clientsData) {
      const clientNumber = client[1]; // Assuming client number is in the first column

      const docRef = db.collection("test").doc(clientNumber);
      const doc = await docRef.get();

      if (doc.exists) {
        // Update existing document with data from CSV row
        const updateData: { [key: string]: any } = {};
        headerRow.forEach((field, index) => {
          const fieldType = fieldTypes[field];
          if (fieldType) {
            updateData[field] = castToType(client[index], fieldType);
          } else {
            updateData[field] = client[index];
          }
        });
        await docRef.update(updateData);
      } else {
        // Create new document with data from CSV row
        const newData: { [key: string]: any } = {};
        headerRow.forEach((field, index) => {
          const fieldType = fieldTypes[field];
          if (fieldType) {
            newData[field] = castToType(client[index], fieldType);
          } else {
            newData[field] = client[index];
          }
        });
        await docRef.set(newData);
      }
    }

    console.log("Firebase database updated successfully!");
  };

  const convertToCSV = () => {
    // Convert JSON data back to CSV format
    const csv = jsonToCSV(jsonData);
    console.log("CSV Data:", csv);
  };

  const renderItem = ({ item }: { item: any[] }) => (
    <View style={styles.row}>
      {item.map((value, idx) => (
        <View key={idx} style={[styles.cell, { width: cellWidth }]}>
          <Text style={styles.cellText}>{value}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Upload CSV" onPress={handleUpload} />
      <Button title="Convert to CSV" onPress={convertToCSV} />
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
    minWidth: 50,
  },
  cellText: {
    textAlign: "center",
    flexWrap: "wrap",
  },
});

export default CSVTest;
