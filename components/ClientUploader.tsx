import React, { useEffect, useState } from "react";
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
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [tableData, setTableData] = useState<string[][]>([]);
  const [tableHead, setTableHead] = useState<string[]>([]);

  // Define the mapping between field names and data types
  const fieldTypes: { [key: string]: "string" | "number" | "boolean" } = {
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
    try {
      await updateFirebase(csvData);
      setUploadStatus("Success");
    } catch (error) {
      console.error("Error uploading CSV:", error);
      setUploadStatus("Failed");
    }
  };
  const updateFirebase = async (data: string[][]) => {
    if (data.length === 0) {
      console.warn("No CSV data to upload.");
      return;
    }

    const headerRow = data[0];
    const clientsData = data.slice(1);
    console.log(`Client Uploader FileData:`, clientsData);

    const db = firebase.firestore();

    for (const client of clientsData) {
      const clientNumber = String(client[0]); // Ensure client number is a string
      console.log(`Uploading client number: ${clientNumber}`);
      const docRef = db.collection("clients").doc(clientNumber);
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
