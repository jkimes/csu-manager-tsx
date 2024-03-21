import React, { useState, useEffect } from "react";
// import { FlatList, Pressable, View, Text } from "react-native";
import { firebase } from "../../csu-manager-2/config";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default function ShowInfo() {
  const [data, setData] = useState([]);
  const dataRef = firebase.firestore().collection("clients");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await dataRef.get();

        const data = querySnapshot.docs.map((doc) => {
          const { Address, Email } = doc.data();
          return {
            id: doc.id,
            Address,
            Email,
          };
        });

        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Invoke the function immediately
  }, [dataRef]); // Add dataRef to dependency array if needed

  return data;
}
