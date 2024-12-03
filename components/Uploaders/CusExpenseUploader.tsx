import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  ScrollView, ActivityIndicator, Alert
} from "react-native";
import { readAsStringAsync } from "expo-file-system";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { firebase } from "../../config";
import { Table, Row, Rows } from "react-native-table-component";
import Papa from "papaparse";

const convertDataType = (
    value: any,
    type: "string" | "number" | "boolean" | "Timestamp"
  ): any => {
    if (value === "") {
      switch (type) {
        case "number":
          return 0;
        case "boolean":
          return false;
        case "Timestamp":
          return null; // Return null for empty Timestamp
        default:
          return "";
      }
    }
  
    // Check if the value is already a Firebase Timestamp
    if (type === "Timestamp" && value instanceof firebase.firestore.Timestamp) {
      return value; // Return the Timestamp as is
    }
  
    switch (type) {
      case "number":
        const num = parseFloat(value.replace(/,/g, "").trim());
        return isNaN(num) ? 0 : num;
      case "boolean":
        return value.toLowerCase().trim() === "true";
      case "Timestamp":
        // Check if the value is a string and parse the date
        if (typeof value === "string") {
          console.log("Converting from string to date");
          const dateParts = value.split("/");
          if (dateParts.length === 3) {
            const month = parseInt(dateParts[0], 10) - 1; // Months are 0-indexed
            const day = parseInt(dateParts[1], 10);
            const year = parseInt(dateParts[2], 10);
  
            // Create a valid Date object
            const parsedDate = new Date(year, month, day);
            // console.log("ParseDate.getTime: " + !isNaN(parsedDate.getTime()));

            if (!isNaN(parsedDate.getTime())) {
                console.log("Date is valid")
                console.log("Firebase Formate date: "+ firebase.firestore.Timestamp.fromDate(parsedDate) )
              return firebase.firestore.Timestamp.fromDate(parsedDate); // Convert to Firebase Timestamp
            } else {
              console.error(`Invalid date1: ${value}`);
              return null; // Return null for invalid dates
            }
          } else {
            console.error(`Invalid date format2: ${value}`);
            return null;
          }
        } else {
          console.error(`Unexpected value type for Timestamp: ${typeof value}`);
          return null;
        }
      default:
        return value.trim();
    }
  };
  
  
  
  
  

export default function PaymentUploader({ route, navigation }) {
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [tableData, setTableData] = useState<string[][]>([]);
  const [tableHead, setTableHead] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [missingHeaders, setMissingHeaders] = useState<string[]>([]);

  // Define the mapping between field names and data types
  const fieldTypes: { [key: string]: "string" | "number" | "boolean"| "Timestamp" } = {
  VendorNumber: "number",
  Vendor: "string",
  Date: "Timestamp",
  PayAmount: "number",
  PayMethod: "number",
  CKNumber: "number",
  CustomerNum: "string",
  CustomerName: "string",
  Bank: "string",
  ReExpense: "string"
    
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
                    var val = convertDataType(String(value), type);
                    console.log("Converted Value: " + typeof val)
                    return val;
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
            const newData: { [key: string]: any } = {};

            headerRow.forEach((field, index) => {
                const value = client[index];
                newData[field] = value; // Directly assign the value without conversion
            });

            // Add the operation to the batch with autogenerated ID
            if (Object.keys(newData).length > 0) {
                const docRef = db.collection("customerExp").doc(); // Generate a new document reference with auto ID
                batch.set(docRef, newData); // Set data to the autogenerated ID
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

  
  
  

  const renderItem = ({ item }: { item: any[] }) => (
    <View style={styles.row}>
      {item.map((value, idx) => (
        <View key={idx} style={styles.cell}>
          <Text style={styles.cellText}>
            {
              // Check if the value is a Firebase Timestamp object
              value && value.seconds && value.nanoseconds
                ? "" // Convert Timestamp to readable date
                : String(value) // Convert all other types to string
            }
          </Text>
        </View>
      ))}
    </View>
  );
  

  return (
    <View style={styles.container}>
      <View style={styles.topContent}>
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
      </View>

      <View style={styles.tableContainer}>
        <ScrollView horizontal>
          <ScrollView>
            {tableHead.length > 0 && (
              <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
                <Row
                  data={tableHead}
                  widthArr={Array(tableHead.length).fill(150)}
                  style={styles.head}
                  textStyle={styles.text}
                />
                <Rows
                  data={tableData.map((row) =>
                    row.map((value) => {
                      if (value && value.seconds && value.nanoseconds) {
                        return "";
                      }
                      return String(value);
                    })
                  )}
                  widthArr={Array(tableHead.length).fill(150)}
                  textStyle={styles.text}
                />
              </Table>
            )}
          </ScrollView>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  topContent: {
    paddingBottom: 10,
  },
  tableContainer: {
    flex: 1,
    marginTop: 10,
    marginBottom: 20,
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
  head: {
    height: 'auto',
    backgroundColor: "#f1f8ff",
    minHeight: 40,
  },
  text: {
    margin: 6,
    textAlign: "center",
    flexWrap: "wrap",
  },
});
