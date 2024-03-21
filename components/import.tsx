import CSVReader from "react-csv-reader";
import React, { useState } from "react";
import { Button, Text, View } from "react-native";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

initializeApp();

const db = getFirestore();

export default function Import() {
  const [Data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const parseOptions = {};

  function iterate_data(sdata, fileInfo, originalFile) {}

  async function import_into_firebase() {
    setLoading(true);
    try {
      var docRef = collection(db, "clients");

      Data.map((item, index) => {
        console.log(item);
        addDoc(docRef, item);
      });

      setLoading(false);
      return docRef;
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  return (
    <View>
      <Text>CSV Importer</Text>
      <View>
        <CSVReader onFileLoaded={iterate_data} parserOptions={parseOptions} />
      </View>

      <Button onPress={() => import_into_firebase()} title="Import" />
    </View>
  );
}
