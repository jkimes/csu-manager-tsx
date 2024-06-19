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
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { firebase } from "../config";
import { Table, Row, Rows } from "react-native-table-component";
import { Header } from "@rneui/themed";
import Papa from "papaparse"; // Add this line

export default function WipUploader({ route, navigation }) {
  const [csvData, setCsvData] = useState<any[][]>([]);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [tableData, setTableData] = useState<any[][]>([]);
  const [tableHead, setTableHead] = useState<string[]>([]);

  // Define the mapping between field names and data types
  const fieldTypes: { [key: string]: "string" | "number" | "boolean" } = {
    AdditionalCost: "number",
    CostToDate: "number",
    ClientNumber: "number",
    CostToComplete: "number",
    initialCost: "number",
    name: "string",
    paidToDate: "number",
    quotedPrice: "number",
    // Add more fields here as needed
  };
  const selectFile = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync({
        type: "text/csv", // Specify the file type you want to pick
      });

      if (!file.canceled) {
        const doc = file.assets[0];
        console.log(`DOC: ${doc}`);
        const fileContents = await readAsStringAsync(doc.uri);

        if (fileContents) {
          // Use PapaParse to parse the CSV content
          const parsedData = Papa.parse(fileContents, {
            header: false,
            skipEmptyLines: true,
          });

          let data: any[][] = parsedData.data as string[][]; // Ensure the data is in the correct format

          if (data.length > 0) {
            setTableHead(data[0]);
            const headers = data[0];

            // Convert data types based on fieldTypes
            data = data.map((row, rowIndex) =>
              rowIndex === 0
                ? row // Skip the header row
                : row.map((value, colIndex) => {
                    const header = headers[colIndex];
                    const type = fieldTypes[header] || "string";
                    return convertDataType(value, type);
                  })
            );

            setCsvData(data);
            setTableData(data.slice(1));
            console.log(`Data 0: ${data[0]}`);
          }
        }
      }
    } catch (error) {
      console.error("Error picking file:", error);
    }
  };

  const handleUpload = async () => {
    try {
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

  const updateFirebase = async (data: string[][]) => {
    if (data.length === 0) {
      console.warn("No CSV data to upload.");
      return;
    }

    const headerRow = data[0];
    const clientsData = data.slice(1); // Exclude header row
    console.log(`Wip Uploader FileData ${clientsData}`);

    const db = firebase.firestore();

    for (const client of clientsData) {
      const clientNumber = client[0]; // Assuming client number is in the first column
      console.log(`firebase upload client number check: ${clientsData.length}`);
      const docRef = db.collection("wip").doc(clientNumber);
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
const convertDataType = (
  value: string,
  type: "string" | "number" | "boolean"
) => {
  switch (type) {
    case "number":
      return parseFloat(value);
    case "boolean":
      return value.toLowerCase() === "true";
    default:
      return value;
  }
};
