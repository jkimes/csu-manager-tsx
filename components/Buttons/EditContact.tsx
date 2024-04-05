import { StyleSheet, Text, View, Modal, TextInput, Button } from "react-native";
import React, { useState } from "react";
import { firebase } from "../../config";
import { FAB } from "@rneui/themed";
import { EditStyles } from "./styles/Edit.styles";

export default function EditContact(props) {
  const [inputValue, setInputValue] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");

  const handleEditField = async (
    id: string,
    field: string, // the field inside of Contact  1
    contact: string,
    value: any
  ) => {
    // console.log(` Value@ ${contact}`);
    try {
      const collectionRef = firebase.firestore().collection("clients").doc(id);
      await collectionRef.update({
        [`Contacts.${contact}.${field}`]: value,
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
    if (props.field === "street") {
      if (step === 1) {
        setStreet(inputValue);
        setInputValue("");
        setStep(step + 1);
      } else if (step === 2) {
        setCity(inputValue);
        setInputValue("");
        setStep(step + 1);
      } else if (step === 3) {
        setZip(inputValue);
        handleEditField(props.id, "street", props.contact, street);
        handleEditField(props.id, "city", props.contact, city);
        handleEditField(props.id, "zip", props.contact, zip);
        // handleEditField(props.id, "Address_State", "Florida", props.key);
        setInputValue("");
        setModalVisible(false);
      }
    } else {
      handleEditField(props.id, props.field, props.contact, inputValue);
      setInputValue("");
      setModalVisible(false);
    }
  };

  const handleCancel = () => {
    setInputValue("");
    setModalVisible(false);
  };

  const handleSetActive = (value) => {
    handleEditField(props.id, props.field, value, props.contact);
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
            {props.field !== "Active" && (
              <>
                {step === 1 && (
                  <>
                    <TextInput
                      style={EditStyles.input}
                      onChangeText={setInputValue}
                      value={inputValue}
                      placeholderTextColor="black"
                      placeholder="Add field"
                    />
                    <Button title="Next" onPress={handleSubmit} />
                  </>
                )}
                {step === 2 && (
                  <>
                    <TextInput
                      style={EditStyles.input}
                      onChangeText={setInputValue}
                      value={inputValue}
                      placeholderTextColor="black"
                      placeholder="City"
                    />
                    <Button title="Next" onPress={handleSubmit} />
                  </>
                )}
                {step === 3 && (
                  <>
                    <TextInput
                      style={EditStyles.input}
                      onChangeText={setInputValue}
                      value={inputValue}
                      placeholderTextColor="black"
                      placeholder="Zip"
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
