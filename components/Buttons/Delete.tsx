import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { firebase, firebaseConfig } from "../../config";
import { FAB } from "@rneui/themed";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default function Delete(props) {
  // console.log(`Contact* ${props.contact} | Field ${props.field}`);
  const handleDeleteField = async (
    id: string,
    field: string,
    contact: string
  ) => {
    if (field === "Contact" && id !== undefined) {
      try {
        const documentRef = firebase.firestore().collection("clients").doc(id);
        // Update the document to set the name field to null
        await documentRef.update({
          [`${field}`]: null, // Use the update the field in the db
        });
        console.log(`Name field updated successfully. ${contact}`);
      } catch (error) {
        console.error("Error updating Contact Name field: ", error);
      }
    } else if (field === "street" && id !== undefined) {
      try {
        const documentRef = firebase.firestore().collection("clients").doc(id);
        // Update the document to set the name field to null
        await documentRef.update({
          [`Contacts.${contact}.${field}`]: null, // Use the provided contact key
          [`Contacts.${contact}.city`]: null,
          [`Contacts.${contact}.zip`]: null,
        });
        console.log(`Name field updated successfully. ${contact}`);
      } catch (error) {
        console.error("Error updating name field: ", error);
      }
    } else if (id !== undefined && field !== undefined) {
      // Perform the delete operation
      try {
        const collectionRef = firebase
          .firestore()
          .collection("clients")
          .doc(id);
        const res = await collectionRef.update({
          [`Contacts.${contact}.${field}`]: null,
        });
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    } else {
      console.warn("ID or field is undefined:", props.id, props.field);
    }
  };

  return (
    <View>
      <FAB
        visible={true}
        icon={{ name: "delete", color: "white" }}
        color="teal"
        size="small"
        onPress={() => handleDeleteField(props.id, props.field, props.contact)}
      />
    </View>
  );
}
