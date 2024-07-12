import { StyleSheet, Text, View, Modal, TextInput, Button } from "react-native";
import React, { useState } from "react";
import { firebase } from "../../config";
import { FAB } from "@rneui/themed";
import { EditStyles } from "./styles/Edit.styles";

export default function Edit(props) {
  const [inputValue, setInputValue] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [jobSite, setJobSite] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  console.log(`Edit ID: ${props.id}`);

  const handleEditField = async (id, field, value) => {
    try {
      const collectionRef = firebase.firestore().collection("clients").doc(id);
      await collectionRef.update({
        [field]: value,
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const promptForInput = () => {
    setInputValue(""); // Reset inputValue when opening modal
    setModalVisible(true);
    setStep(1); // Reset step to 1 when opening modal
  };

  const handleSubmit = () => {
    console.log(`field ${props.field}`);
    if (props.field === "ClientName") {
      console.log(`editing client name id: ${props.id} field: ${props.field}`);
      handleEditField(props.id, props.field, inputValue);
      setInputValue("");
      setModalVisible(false);
    }
    if (props.field === "JobSite") {
      if (step === 1) {
        setJobSite(inputValue);
        handleEditField(props.id, "JobSite", jobSite);
        setInputValue("");
        setModalVisible(false);
      }
    } else {
      console.log(`Edit any field: ${props.field} id: ${props.id}`);
      handleEditField(props.id, props.field, inputValue);
      setInputValue("");
      setModalVisible(false);
    }
  };

  const handleCancel = () => {
    setInputValue("");
    setModalVisible(false);
  };

  const handleSetActive = (value) => {
    let response = "";
    if (value) {
      response = "A";
    } else response = "I";
    handleEditField(props.id, props.field, response);
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
        <View style={EditStyles.modalContainer}>
          <View style={EditStyles.modalContent}>
            {props.field === "JobStatus" && (
              <>
                <Text style={EditStyles.label}>Is this job Active:</Text>
                <View style={EditStyles.buttonContainer}>
                  <Button title="Yes" onPress={() => handleSetActive(true)} />
                  <Button title="No" onPress={() => handleSetActive(false)} />
                </View>
              </>
            )}
            {props.field !== "JobStatus" && (
              <>
                {step === 1 && (
                  <>
                    <TextInput
                      style={EditStyles.input}
                      onChangeText={setInputValue}
                      value={inputValue}
                      placeholderTextColor="black"
                      placeholder="Enter Value"
                    />
                    <Button title="Submit" onPress={handleSubmit} />
                  </>
                )}
              </>
            )}
            <Button title="Cancel" onPress={handleCancel} />
          </View>
        </View>
      </Modal>
      <FAB
        visible={true}
        color="teal"
        title={"Edit"}
        size="small"
        onPress={promptForInput}
      />
    </View>
  );
}
