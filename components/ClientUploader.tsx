import React, { useEffect, useState } from "react";
<<<<<<< HEAD
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  ScrollView,
} from "react-native";
import { readAsStringAsync } from "expo-file-system";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { firebase } from "../config";
import { Table, Row, Rows } from "react-native-table-component";
import { Header } from "@rneui/themed";
import Papa from "papaparse"; // Add this line

export default function ClientUploader({ route, navigation }) {
=======
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import { readAsStringAsync } from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { firebase } from "../config";
import { Table, Row, Rows } from "react-native-table-component";
import Papa from "papaparse"; // Add this line

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

export default function ClientUploader(route, navigation) {
>>>>>>> cfdd615 (fixed all uploaders)
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [tableData, setTableData] = useState<string[][]>([]);
  const [tableHead, setTableHead] = useState<string[]>([]);

  // Define the mapping between field names and data types
  const fieldTypes: { [key: string]: "string" | "number" | "boolean" } = {
<<<<<<< HEAD
    clientNumber: "number",
    Address_Zip: "number",
    Site_Zip: "number",
    Active: "boolean",
    ClientPhone: "number",
    // Add more fields here as needed
  };
  const selectFile = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync({
        type: "text/csv", // Specify the file type you want to pick
=======
    Address_Zip: "number",
    Active: "boolean",
    Address_City: "string",
    Address_Street: "string",
    ClientNumber: "number",
    ClientPhone: "number",
    ClientEmail: "string",
    ClientName: "string",

    // Add more fields here as needed
  };

  const selectFile = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync({
        type: "text/csv",
>>>>>>> cfdd615 (fixed all uploaders)
      });

      if (!file.canceled) {
        const doc = file.assets[0];
        console.log(`DOC: ${doc}`);
        const fileContents = await readAsStringAsync(doc.uri);

        if (fileContents) {
<<<<<<< HEAD
          // Use PapaParse to parse the CSV content
          const parsedData = Papa.parse(fileContents, {
            header: false,
            skipEmptyLines: true,
          });

          let data = parsedData.data as string[][]; // Ensure the data is in the correct format
=======
          const parsedData = Papa.parse(fileContents, {
            header: false,
            skipEmptyLines: false,
          });

          console.log("Parsed Data:", parsedData);

          let data: any[][] = parsedData.data as string[][];
>>>>>>> cfdd615 (fixed all uploaders)

          if (data.length > 0) {
            setTableHead(data[0]);
            const headers = data[0];

<<<<<<< HEAD
            // Convert data types based on fieldTypes
            data = data.map((row, rowIndex) =>
              rowIndex === 0
                ? row // Skip the header row
                : row.map((value, colIndex) => {
                    const header = headers[colIndex];
                    const type = fieldTypes[header] || "string";
                    return convertDataType(value, type);
=======
            // Check if all headers are present in fieldTypes
            headers.forEach((header) => {
              if (!fieldTypes.hasOwnProperty(header)) {
                console.error(`Header "${header}" not found in fieldTypes`);
              }
            });

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
>>>>>>> cfdd615 (fixed all uploaders)
                  })
            );

            setCsvData(data);
            setTableData(data.slice(1));
<<<<<<< HEAD
            console.log(`Data 0: ${data[0]}`);

            // setCsvData(data);
            // console.log(`Data 0: ${data[0]}`);

            // // Assuming the first row is the header
            // if (data.length > 0) {
            //   // Assuming the first row is the header
            //   setTableHead(data[0]);
            //   setTableData(data.slice(1));
=======
            //console.log(`Data : ${data}`);
            data.forEach((row) => console.log(`Data: ${row}`));
>>>>>>> cfdd615 (fixed all uploaders)
          }
        }
      }
    } catch (error) {
      console.error("Error picking file:", error);
    }
  };

  const handleUpload = async () => {
    try {
<<<<<<< HEAD
      // Process CSV data and update Firebase
      await updateFirebase(csvData);
      setUploadStatus("Success");
      // console.log(`Upload Status after success: ${uploadStatus}`);
    } catch (error) {
      console.error("Error uploading CSV:", error);
      setUploadStatus("Failed");
      // console.log(`Upload Status after fail: ${uploadStatus}`);
    }
  };

=======
      await updateFirebase(csvData);
      setUploadStatus("Success");
    } catch (error) {
      console.error("Error uploading CSV:", error);
      setUploadStatus("Failed");
    }
  };
>>>>>>> cfdd615 (fixed all uploaders)
  const updateFirebase = async (data: string[][]) => {
    if (data.length === 0) {
      console.warn("No CSV data to upload.");
      return;
    }

    const headerRow = data[0];
<<<<<<< HEAD
    const clientsData = data.slice(1); // Exclude header row
    console.log(`Vendor Uploader FileData ${clientsData}`);
=======
    const clientsData = data.slice(1);
    console.log(`Client Uploader FileData:`, clientsData);
>>>>>>> cfdd615 (fixed all uploaders)

    const db = firebase.firestore();

    for (const client of clientsData) {
<<<<<<< HEAD
      const clientNumber = client[0]; // Assuming client number is in the first column
      console.log(`firebase upload client number check: ${clientsData.length}`);
      const docRef = db.collection("test").doc(clientNumber);
=======
      const clientNumber = String(client[0]); // Ensure client number is a string
      console.log(`Uploading client number: ${clientNumber}`);
      const docRef = db.collection("clients").doc(clientNumber);
>>>>>>> cfdd615 (fixed all uploaders)
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

<<<<<<< HEAD
      if (doc.exists) {
        console.log(`Doc Exists!`);
        // Update existing document with data from CSV row
        const updateData: { [key: string]: any } = {};
        headerRow.forEach((field, index) => {
          updateData[field] = client[index];
        });
        await docRef.update(cleanData(updateData));
      } else {
        // Create new document with data from CSV row
        const newData: { [key: string]: any } = {};
        headerRow.forEach((field, index) => {
          if (field != null || field != undefined) {
            newData[field] = client[index];
            console.log(`Firebase Field: ${field} Index: ${index}`);
          }
        });
        await docRef.set(cleanData(newData));
=======
      const newData: { [key: string]: any } = {};
      headerRow.forEach((field, index) => {
        if (field != null && field != undefined) {
          const value = client[index];
          console.log(`Creating field: ${field}, value: ${value}`);
          newData[field] = convertDataType(
            String(value),
            fieldTypes[field] || "string"
          ); // Ensure all values are strings
        }
      });

      // Log the document data before uploading
      console.log(`Document data for client number ${clientNumber}:`, newData);

      try {
        if (doc.exists) {
          console.log(
            `Document exists! Updating document for client number ${clientNumber}`
          );
          await docRef.update(cleanData(newData));
        } else {
          console.log(
            `Document does not exist! Creating new document for client number ${clientNumber}`
          );
          await docRef.set(cleanData(newData));
        }
      } catch (uploadError) {
        console.error(
          `Error uploading client number ${clientNumber}:`,
          uploadError
        );
        throw uploadError;
>>>>>>> cfdd615 (fixed all uploaders)
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
      <Button title="Select File" onPress={selectFile} />
      <Button title="Upload CSV" onPress={handleUpload} />
      {uploadStatus && (
        <Text
          style={{
            color: uploadStatus === "Success" ? "green" : "red",
            marginTop: 10,
          }}
        >
          {uploadStatus === "Success"
            ? `Upload successful!`
            : `Upload failed. Please try again.`}
        </Text>
      )}
      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>
        CSV Data:
      </Text>
      <ScrollView horizontal>
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
<<<<<<< HEAD
function convertDataType(value: string, type: string): any {
  throw new Error("Function not implemented.");
}
=======
>>>>>>> cfdd615 (fixed all uploaders)
