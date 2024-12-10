import { ScrollView, StyleSheet, Text, View, Alert } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import {
  ThemeProvider,
  useTheme,
  Card,
  Button,
  ListItem,
  Icon,
  BottomSheet,
  Divider,
} from "@rneui/themed";
import { getAuth } from 'firebase/auth';
import { firebase } from '../config';

// custom imports
import { WipStyles } from "./styles/Wip.styles";
import { WipContext } from "../components/ContextGetters/WipContext";
import { DisplayJobStatus, handleAddress } from "../components/Helpers/helperFunctions";
import FinanceSummary from "../components/List/BottomSheet/FinanceSummary";

function addCommasToNumber(number) {
  if (typeof number === "undefined") {
    return ""; // Or any default value you prefer
  }

  // Limit the number to 2 decimal places
  let numStr = parseFloat(number).toFixed(2);

  // Split the number into integer and decimal parts, if any
  let parts = numStr.split(".");
  let integerPart = parts[0];
  let decimalPart = parts.length > 1 ? "." + parts[1] : "";

  // Add commas to the integer part
  let integerWithCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Combine the integer and decimal parts
  return integerWithCommas + decimalPart;
}

export default function WIP() {
  const wipData = useContext(WipContext);
  const [isVisible, setIsVisible] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [userRole, setUserRole] = useState('User');

  useEffect(() => {
    const getCurrentUserRole = async () => {
      const currentUser = getAuth().currentUser;
      //console.log("Current user:", currentUser?.email); // Log current user
      if (currentUser) {
        const userRef = firebase.firestore().collection('Users').doc(currentUser.uid);
        const doc = await userRef.get();
        if (doc.exists) {
          const role = doc.data()?.role || 'User';
         // console.log("User role:", role); // Log the role
          setUserRole(role);
        }
      }
    };
    getCurrentUserRole();
  }, []);

  useEffect(() => {
    // console.log("selectedItem has changed:", selectedItem);
  }, [selectedItem]);

  const handleViewProfile = (item) => {
    // console.log(`ITEM: ${item}`);
    setIsVisible(!isVisible); // Show the bottom sheet
    setSelectedItem(item); // Set the selected item
  };
  //console.log(`Wip!: ${JSON.stringify(wipData)}`);

  const handleDelete = async (id) => {
    try {
      await firebase.firestore().collection('wip').doc(id).delete();
      // Optional: Show success message
      Alert.alert('Success', 'WIP entry deleted successfully');
    } catch (error) {
      console.error('Error deleting document:', error);
      Alert.alert('Error', 'Failed to delete WIP entry');
    }
  };

  const renderCardList = () => {
    return (
      <>
        <FinanceSummary
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          wipData={selectedItem}
        />

        <ListItem.Accordion
          content={
            <ListItem.Content>
              <ListItem.Title>WIP</ListItem.Title>
            </ListItem.Content>
          }
          isExpanded={expanded}
          onPress={() => setExpanded(!expanded)}
        >
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {wipData
              .filter(item => 
                item.clientNumber != null && 
                item.clientNumber !== undefined && 
                item.clientNumber !== 0
              )
              .map((item) => {
                //console.log("Current user role:", userRole); // Log role for each item
                //console.log("Should show delete button:", ['Admin', 'Manager'].includes(userRole)); // Log condition check
                console.log("Cost to Date:", item.costToDate);
                
                return (
                  <Card key={item.id} containerStyle={{ borderRadius: 4, padding: 10 }}>
                    {['Admin', 'Manager'].includes(userRole) && (
                      <View style={styles.deleteContainer}>
                        <Icon
                          name="delete"
                          type="material"
                          color="#FF0000"
                          size={24}
                          onPress={() => {
                            Alert.alert(
                              'Confirm Delete',
                              'Are you sure you want to delete this WIP entry?',
                              [
                                {
                                  text: 'Cancel',
                                  style: 'cancel',
                                },
                                {
                                  text: 'Delete',
                                  onPress: () => handleDelete(item.id),
                                  style: 'destructive',
                                },
                              ]
                            );
                          }}
                        />
                      </View>
                    )}

                    <View style={WipStyles.pageView}>
                      <Card.FeaturedTitle style={WipStyles.featuredTitle}>
                        {item.name}
                      </Card.FeaturedTitle>

                      <Card.FeaturedSubtitle style={WipStyles.featuredSubtitle}>
                        Client#: {item.clientNumber}
                      </Card.FeaturedSubtitle>

                      <View style={{ flexDirection: "row", alignContent: "center", marginBottom: 5 }}>
                        <Card containerStyle={WipStyles.priceCard}>
                          <View style={WipStyles.TitleView}>
                            <Card.Title style={WipStyles.title}>Quote Price</Card.Title>
                            <Card.Divider />
                          </View>
                          <Text style={WipStyles.digits}>
                            ${addCommasToNumber(Number(item.quotedPrice))}
                          </Text>
                        </Card>

                        <Card containerStyle={WipStyles.priceCard}>
                          <Card.Title style={WipStyles.title}>Cost to Date</Card.Title>
                          <Card.Divider />
                          <Text style={WipStyles.digits}>
                            ${addCommasToNumber(item.costToDate)}
                          </Text>
                        </Card>

                        <Card containerStyle={WipStyles.priceCard}>
                          <Card.Title style={WipStyles.title}>AR To Date</Card.Title>
                          <Card.Divider />
                          <Text style={WipStyles.digits}>
                            ${addCommasToNumber(item.paidToDate)}
                          </Text>
                        </Card>
                      </View>
                    </View>

                    <Button
                      title="Additional Details"
                      onPress={() => handleViewProfile(item)}
                    />
                  </Card>
                );
              })}
          </ScrollView>
        </ListItem.Accordion>
      </>
    );
  };

  return <View style={{ flex: 1 }}>{renderCardList()}</View>;
}
const styles = StyleSheet.create({
  scrollViewContent: {
    paddingBottom: 70,
  },
  deleteContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
});
