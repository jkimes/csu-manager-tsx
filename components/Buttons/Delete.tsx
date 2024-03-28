import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { firebase, firebaseConfig } from "../../config";
import { FAB } from "@rneui/themed";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default function Delete(props) {
  const [addedDocumentId, setAddedDocumentId] = useState(null);

  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleDeleteField = async (id: string, field: string) => {
    if (props.id !== undefined && props.field !== undefined) {
      // Perform the delete operation
      try {
        const collectionRef = firebase
          .firestore()
          .collection("clients")
          .doc(props.id);
        const res = await collectionRef.update({
          [props.field]: null,
        });
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    } else {
      console.warn("ID or field is undefined:", props.id, props.field);
    }
  };
  // Check if id and field are not undefined
  // useEffect(() => {
  //   if (props.id !== undefined && props.field !== undefined) {
  //     // Perform the delete operation
  //     handleDeleteField(props.id, props.field);
  //     console.log("Deleted:", props.field);
  //   } else {
  //     console.warn("ID or field is undefined:", props.id, props.field);
  //   }
  // }, [props.id, props.field]);

  return (
    <FAB
      visible={true}
      icon={{ name: "delete", color: "white" }}
      color="teal"
      size="small"
      onPress={() => handleDeleteField(props.id, props.field)}
    />
  );
}

const styles = StyleSheet.create({});
