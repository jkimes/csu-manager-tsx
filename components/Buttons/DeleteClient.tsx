import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { firebase, firebaseConfig } from "../../config";
import { FAB } from "@rneui/themed";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default function Delete(props) {
  // console.log(`Contact* ${props.contact} | Field ${props.field}`);
  const handleDelete = async (id: string) => {
    try {
      const documentRef = firebase.firestore().collection("clients").doc(id);
      // Update the document to set the name field to null
      await documentRef.delete();
    } catch (error) {
      console.error("Error updating name field: ", error);
    }
  };

  return (
    <View>
      <FAB
        visible={true}
        icon={{ name: "delete", color: "white" }}
        color="teal"
        size="small"
        onPress={() => handleDelete(props.id)}
      />
    </View>
  );
}
