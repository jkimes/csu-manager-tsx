import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { firebase, firebaseConfig } from "../config";
import { AddClientStyles } from "./styles/AddClient.styles";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default function AddClient({ route, navigation }) {
  const [addedDocumentId, setAddedDocumentId] = useState(null);
  const [formData, setFormData] = useState({
    ClientName: "",
    ClientNumber: "",
    ClientEmail: "",
    ClientPhone: "",
    Address_Street: "",
    Address_City: "",
    Address_State: "",
    Address_Zip: "",
    Site_Street: "",
    Site_City: "",
    Site_State: "",
    Site_Zip: "",
    Active: false,
  });
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleSkip = () => {
    setCurrentStep(currentStep + 1);
    if (currentStep === 3) {
      setFormData({
        ...formData,
        Site_Street: formData.Address_Street,
        Site_City: formData.Address_City,
        Site_State: formData.Address_State,
        Site_Zip: formData.Address_Zip,
      });
    }
  };

  const handleAddClient = async () => {
    try {
      const collectionRef = firebase.firestore().collection("clients");
      const res = await collectionRef.add(formData);
      setAddedDocumentId(res.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <View style={AddClientStyles.container}>
      {currentStep === 1 && (
        <View>
          <Text>Enter Client Details:</Text>
          <TextInput
            placeholder="Client Name"
            value={formData.ClientName}
            onChangeText={(value) =>
              setFormData({ ...formData, ClientName: value })
            }
          />
          <TextInput
            placeholder="Client Number"
            value={formData.ClientNumber}
            onChangeText={(value) =>
              setFormData({ ...formData, ClientNumber: value })
            }
          />
          <TextInput
            placeholder="Client Email"
            value={formData.ClientEmail}
            onChangeText={(value) =>
              setFormData({ ...formData, ClientEmail: value })
            }
          />
          <TextInput
            placeholder="Client Phone"
            value={formData.ClientPhone}
            onChangeText={(value) =>
              setFormData({ ...formData, ClientPhone: value })
            }
          />
          <Button title="Next" onPress={handleNext} />
        </View>
      )}

      {currentStep === 2 && (
        <View>
          <Text>Enter Address:</Text>
          <TextInput
            placeholder="Street"
            value={formData.Address_Street}
            onChangeText={(value) =>
              setFormData({ ...formData, Address_Street: value })
            }
          />
          <TextInput
            placeholder="City"
            value={formData.Address_City}
            onChangeText={(value) =>
              setFormData({ ...formData, Address_City: value })
            }
          />
          <TextInput
            placeholder="State"
            value={formData.Address_State}
            onChangeText={(value) =>
              setFormData({ ...formData, Address_State: value })
            }
          />
          <TextInput
            placeholder="Zip Code"
            value={formData.Address_Zip}
            onChangeText={(value) =>
              setFormData({ ...formData, Address_Zip: value })
            }
          />
          <Button title="Next" onPress={handleNext} />
        </View>
      )}

      {currentStep === 3 && (
        <View>
          <Text>Enter Site:</Text>
          <TextInput
            placeholder="Street"
            value={formData.Site_Street}
            onChangeText={(value) =>
              setFormData({ ...formData, Site_Street: value })
            }
          />
          <TextInput
            placeholder="City"
            value={formData.Site_City}
            onChangeText={(value) =>
              setFormData({ ...formData, Site_City: value })
            }
          />
          <TextInput
            placeholder="State"
            value={formData.Site_State}
            onChangeText={(value) =>
              setFormData({ ...formData, Site_State: value })
            }
          />
          <TextInput
            placeholder="Zip Code"
            value={formData.Site_Zip}
            onChangeText={(value) =>
              setFormData({ ...formData, Site_Zip: value })
            }
          />
          <Button title="Next" onPress={handleNext} />
          <Button title="Skip" onPress={handleSkip} />
        </View>
      )}

      {currentStep === 4 && (
        <View>
          <Text>Active:</Text>
          <Button
            title="True"
            onPress={() => setFormData({ ...formData, Active: true })}
          />
          <Button
            title="False"
            onPress={() => setFormData({ ...formData, Active: false })}
          />
          <Button title="Add Client" onPress={handleAddClient} />
        </View>
      )}

      {addedDocumentId && (
        <Text>Added document with ID: {addedDocumentId}</Text>
      )}
    </View>
  );
}
