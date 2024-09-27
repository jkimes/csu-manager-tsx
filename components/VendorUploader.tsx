import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  ScrollView,ActivityIndicator, Alert
} from "react-native";
import { readAsStringAsync } from "expo-file-system";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { firebase } from "../config";
import { Table, Row, Rows } from "react-native-table-component";
import Papa from "papaparse";

const convertDataType = (
  value: string,
  type: "string" | "number" | "boolean"
): any => {
  //console.log(`Converting value: '${value}' to type: ${type}`);

  if (value === "") {
    switch (type) {
      case "number":
        return 0; // Default value for number type
      case "boolean":
        return false; // Default value for boolean type
      default:
        return ""; // Default value for string type
    }
  }

  switch (type) {
    case "number":
      // Remove commas for number parsing
      const num = parseFloat(value.replace(/,/g, "").trim());
      //console.log(`Parsed number: ${num}`);
      return isNaN(num) ? 0 : num;
    case "boolean":
      return value.toLowerCase().trim() === "true";
    default:
      return value.trim();
  }
};

export default function VendorUploader({ route, navigation }) {
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [tableData, setTableData] = useState<string[][]>([]);
  const [tableHead, setTableHead] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [missingHeaders, setMissingHeaders] = useState<string[]>([]);

  // Define the mapping between field names and data types
  const fieldTypes: { [key: string]: "string" | "number" | "boolean" } = {
    VendorNum: "number",
    Name: "string",
    ContactName: "string",
    Tel1: "number",
    Tel2: "number",
    Email: "string",
    WebsiteLink: "string",
    StreetAddress: "string",
    City: "string",
    Specialty: "string",
    Type: "string",
    // Add more fields here as needed
  };
  const selectFile = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync({
        type: "text/csv",
      });

      if (!file.canceled) {
        const doc = file.assets[0];
        console.log(`DOC: ${doc}`);
        const fileContents = await readAsStringAsync(doc.uri);

        if (fileContents) {
          const parsedData = Papa.parse(fileContents, {
            header: false,
            skipEmptyLines: false,
          });

          console.log("Parsed Data:", parsedData);

          let data: any[][] = parsedData.data as string[][];

          if (data.length > 0) {
            setTableHead(data[0]);
            const headers = data[0];

            // Check for missing headers
          const missing = Object.keys(fieldTypes).filter(
            (header) => !headers.includes(header)
          );
          setMissingHeaders(missing);

          if (missing.length > 0) {
            Alert.alert(
              "Missing Headers",
              `The following headers are missing: ${missing.join(", ")}`
            );
          }

            // Convert data types based on fieldTypes
            data = data.map((row, rowIndex) =>
              rowIndex === 0
                ? row
                : row.map((value, colIndex) => {
                    const header = headers[colIndex];
                    const type = fieldTypes[header] || "string";
                    console.log(
                      `Converting value for header: ${header}, value: ${value}`
                    );
                    if (header === undefined) {
                      console.error(
                        `Header is undefined for colIndex: ${colIndex}`
                      );
                    }
                    if (value === undefined) {
                      console.error(
                        `Value is undefined for header: ${header}, at row: ${rowIndex}, col: ${colIndex}`
                      );
                    }
                    return convertDataType(String(value), type);
                  })
            );

            setCsvData(data);
            setTableData(data.slice(1));
            //console.log(`Data : ${data}`);
            data.forEach((row) => console.log(`Data: ${row}`));
          }
        }
      }
    } catch (error) {
      console.error("Error picking file:", error);
    }
  };

  const handleUpload = async () => {
    if (missingHeaders.length > 0) {
      Alert.alert(
        "Upload Canceled",
        `Upload canceled due to missing headers: ${missingHeaders.join(", ")}`
      );
      return;
    }
    setLoading(true);
    try {
      // Process CSV data and update Firebase
      await updateFirebase(csvData);
      setUploadStatus("Success");
      // console.log(`Upload Status after success: ${uploadStatus}`);
    } catch (error) {
      console.error("Error uploading CSV:", error);
      setUploadStatus("Failed");
      // console.log(`Upload Status after fail: ${uploadStatus}`);
    }finally {
      setLoading(false);
    }
  };

  const updateFirebase = async (data: string[][]) => {
    if (data.length === 0) {
      console.warn("No CSV data to upload.");
      return;
    }
  
    const batchSize = 500; // Firestore's max batch size
  
    let headerRow = data[0];
    let clientsData = data.slice(1);
  
    // Remove columns where the header is empty or undefined
    headerRow = headerRow.filter((header, index) => {
      if (header == null || header === "") {
        console.warn(`Removing empty or undefined column at index ${index}`);
        // Remove corresponding column from all rows in data
        clientsData = clientsData.map((row) => row.filter((_, i) => i !== index));
        return false;
      }
      return true;
    });
  
    const db = firebase.firestore();
  
    // Function to process a batch of data with retry logic
    const processBatch = async (batchData: string[][], attempt: number = 1) => {
      const batch = db.batch();
  
      for (const client of batchData) {
        const clientNumber = String(client[0]); // Ensure client number is a string
        const docRef = db.collection("vendors").doc(clientNumber);
        const doc = await docRef.get();
  
        const cleanData = (data: { [key: string]: any }) => {
          const cleaned: { [key: string]: any } = {};
          Object.keys(data).forEach((key) => {
            if (data[key] !== undefined && data[key] !== null) {
              cleaned[key] = data[key];
            }
          });
          return cleaned;
        };
  
        const newData: { [key: string]: any } = {};
        headerRow.forEach((field, index) => {
          if (field != null && field != undefined) {
            const value = client[index];
            newData[field] = convertDataType(
              String(value),
              fieldTypes[field] || "string"
            ); // Ensure all values are strings
          }
        });
  
        if (Object.keys(newData).length > 0) {
          if (doc.exists) {
            console.log(`Document exists! Updating document for client number ${clientNumber}`);
            batch.update(docRef, cleanData(newData));
          } else {
            console.log(`Document does not exist! Creating new document for client number ${clientNumber}`);
            batch.set(docRef, cleanData(newData));
          }
        }
      }
  
      try {
        // Commit the batch
        await batch.commit();
      } catch (error) {
        if (attempt < 3) {
          console.warn(`Batch failed, retrying attempt ${attempt}...`);
          await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds before retrying
          await processBatch(batchData, attempt + 1);
        } else {
          console.error("Failed to commit batch after multiple attempts:", error);
          throw error;
        }
      }
    };
  
    try {
      // Process data in batches
      for (let i = 0; i < clientsData.length; i += batchSize) {
        const batchData = clientsData.slice(i, i + batchSize);
        await processBatch(batchData);
        console.log(`Processed batch ${Math.floor(i / batchSize) + 1}`);
      }
  
      console.log("Firebase database updated successfully!");
    } catch (error) {
      console.error("Error updating Firebase database:", error);
      throw error;
    }
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
      <Button title="Select File" onPress={selectFile} />
      <Button title="Upload CSV" onPress={handleUpload} />
      {loading ? (
  <ActivityIndicator size="large" color="#0000ff" />
) : uploadStatus === "Success" ? (
  <Text style={{ color: "green", marginTop: 10 }}>Upload successful!</Text>
) : uploadStatus === "Failed" ? (
  <Text style={{ color: "red", marginTop: 10 }}>Upload failed. Please try again.</Text>
) : null}

      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>
        CSV Data:
      </Text>
      <ScrollView horizontal>
        <ScrollView>
        <View>
          {tableHead.length > 0 && (
            <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
              <Row
                data={tableHead}
                style={styles.head}
                textStyle={styles.text}
              />
              <Rows data={tableData} textStyle={styles.text} />
            </Table>
          )}
        </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
}

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
});
