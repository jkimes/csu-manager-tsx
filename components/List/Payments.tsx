/**************************************************************************************************************/
/* Author: Jalon Kimes                                                                                        */
/* This file fetched the data from the api and displays it in a list of card elements                         */
/**************************************************************************************************************/
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Alert,
  ScrollView,
} from "react-native";
import { ThemeProvider, useTheme, Card, Button } from "@rneui/themed";
import { firebase, firebaseConfig } from "../../config";
import { PaymentContext } from "../ContextGetters/PaymentContext";
import { useAuth } from "../ContextGetters/AuthContext";
import { cardlistStyles } from "./styles/cardlist.styles";

// Initializes firebase connection
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const formatTimestampToDate = (timestamp) => {
  if (!timestamp || !timestamp.toDate) {
    console.error("Invalid timestamp");
    return null;
  }

  const date = timestamp.toDate(); // Convert the Firebase Timestamp to a JavaScript Date object
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed, so we add 1
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
};

const Payments = ({ navigation, route, clientNumber }) => {
  const { theme } = useTheme();
  const data = useContext(PaymentContext);
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<string>('User');
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    const getCurrentUserRole = async () => {
      if (user?.uid) {
        const userDoc = await firebase.firestore()
          .collection('Users')
          .doc(user.uid)
          .get();
        
        if (userDoc.exists) {
          setUserRole(userDoc.data()?.role || 'User');
        }
      }
    };
    getCurrentUserRole();
  }, [user]);

  const filterAndSortData = (data, clientNumber) => {
    if (!data || data.length === 0) {
      console.log("Data is empty or undefined");
      return [];
    }

    // Filter the data to include only entries with matching clientNumber
    const filteredData = data.filter(item => String(item.CustomerNum) === String(clientNumber));

    // Sort the filtered data by the Date field (most recent first)
    const sortedData = filteredData.sort((a, b) => {
      if (a.Date && b.Date) {
        const dateA = a.Date.toDate(); // Convert Timestamp to Date
        const dateB = b.Date.toDate(); // Convert Timestamp to Date
        return dateB.getTime() - dateA.getTime(); // Most recent dates first
      }
      return 0; // If Date is missing, treat as equal
    });

    return sortedData || [];
  };

  const customerData = filterAndSortData(data, clientNumber);

  const handleDeletePayment = async (paymentId) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this payment?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              // Logic to delete the payment from Firestore
              await firebase.firestore().collection('AR').doc(paymentId).delete();
              Alert.alert('Success', 'Payment deleted successfully');
              // Optionally refresh the data after deletion
              // fetchData(); // Implement a function to refresh data if needed
            } catch (error) {
              console.error('Error deleting payment:', error);
              Alert.alert('Error', 'Failed to delete payment');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderCardList = () => {
    console.log("User Role:", userRole);
    return customerData.map((item) => (
      <Card key={item.id} containerStyle={cardlistStyles.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Text style={cardlistStyles.textStyleName}>
              Payment Date: {formatTimestampToDate(item.Date)}
            </Text>
            <Text style={cardlistStyles.textStyleName}>
              Amt: ${item.PmtAmount}
            </Text>
            <Text style={cardlistStyles.textClientNum}>
              Pmt Method: {item.PmtMethod}
            </Text>
          </View>
          {(userRole === 'Admin' || userRole === 'Manager') ? (
            <Button
              title="X"
              onPress={() => handleDeletePayment(item.id)}
              buttonStyle={{ backgroundColor: 'red', padding: 2, borderRadius: 15 }}
              titleStyle={{ fontSize: 12 }}
              containerStyle={{ marginLeft: 10 }}
            />
          ) : null}
        </View>
      </Card>
    ));
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        {renderCardList()}
      </ScrollView>
    </View>
  );
};

export default Payments;