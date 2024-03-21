import { StyleSheet, Text, View, Modal, TextInput, Button } from "react-native";
import React, { useState, useEffect } from "react";
import { firebase, firebaseConfig } from "../../config";
import { FAB } from "@rneui/themed";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default function Delete(props) {
  const [addedDocumentId, setAddedDocumentId] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleEditField = async (id: string, field: string, value: any) => {
    try {
      const collectionRef = firebase
        .firestore()
        .collection("clients")
        .doc(props.id);
      const res = await collectionRef.update({
        [props.field]: value,
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const promptForInput = () => {
    setModalVisible(true);
  };

  const handleSubmit = () => {
    if (
      props.field === "Active" &&
      (inputValue === "true" || inputValue === "false")
    ) {
      handleEditField(props.id, props.field, inputValue === "true");
    } else {
      handleEditField(props.id, props.field, inputValue);
    }
    setModalVisible(false);
  };

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              onChangeText={setInputValue}
              value={inputValue}
              placeholder={`Enter value for ${props.field}`}
            />
            <Button title="Submit" onPress={handleSubmit} />
          </View>
        </View>
      </Modal>
      <FAB
        visible={true}
        icon={{ name: "edit", color: "white" }}
        color="teal"
        title={"Edit"}
        onPress={promptForInput}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
