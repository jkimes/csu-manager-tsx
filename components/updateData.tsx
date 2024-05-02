import CSVReader from "react-csv-reader";
import React, { useState } from "react";
import { Button, Text, View } from "react-native";
import {
  getFirestore,
  collection,
  addDoc,
  writeBatch,
} from "firebase/firestore";
import { firebase, firebaseConfig } from "../config";

//initalizes firebase connection
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default function UpdateData() {
  const [Data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const batch = writeBatch(firebase.firestore());

  const parseOptions = {};

  function iterate_data(sdata, fileInfo, originalFile) {}

  async function import_into_firebase() {
    setLoading(true);
    try {
      var docRef = firebase.firestore().collection("test");

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
