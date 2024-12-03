import React, { useState, useContext, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Platform,
  Linking,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Card, Button, Tab, TabView, ListItem, Icon } from "@rneui/themed";
import { getAuth } from 'firebase/auth';
import { firebase, firebaseConfig } from '../config';
// custom imports
import Delete from "../components/Buttons/Delete";
import Edit from "../components/Buttons/Edit";
import QuoteList from "../components/List/QuoteList";
import ContactList from "../components/List/ContactList";
import { Vendor, LineItem } from "../App";

import { CardDivider } from "@rneui/base/dist/Card/Card.Divider";
import {
  //makePhoneCall,
  handlePhoneInteraction,
  sendEmail,
  DisplayJobStatus,
  handleAddress,
  handlePhone,
  handleEmail,
  handleName,
} from "../components/Helpers/helperFunctions";
import { idStyles } from "./styles/[id].styles";
import { VendorsContext } from "../components/ContextGetters/VendorsContext";
import VendorPaymentsList from "../components/List/VendorPayments/VendorPaymentsList";
import { AuthContext } from '../components/ContextGetters/AuthContext';


const handlePress = async (url: string) => {
  const supported = await Linking.canOpenURL(url);

  if (supported) {
    await Linking.openURL(url);
  } else {
    Alert.alert(`Don't know how to open this URL: ${url}`);
    console.log(`Don't know how to open this URL: ${url}`);
  }
};

function handleLink(link: string) {
  console.log("Original link:", link);
  
  if (!link || link.trim() === "") {
    console.log("Returning: No Link");
    return "No Link";
  }
  
  // Clean the link by trimming whitespace
  let cleanLink = link.trim();
  console.log("Cleaned link:", cleanLink);
  
  // Check if the link starts with http:// or https://
  if (!cleanLink.startsWith('http://') && !cleanLink.startsWith('https://')) {
    cleanLink = 'https://' + cleanLink;
    console.log("Added https:// - Final link:", cleanLink);
  } else {
    console.log("Link already has protocol - Final link:", cleanLink);
  }
  
  return cleanLink;
}

export default function VendorProfile({ route, navigation }) {
  const data = useContext(VendorsContext);
  

  const [activeTab, setActiveTab] = React.useState<number>(0); // State to manage the active tab
  const { VendorNum } = route.params;
  const vendorItem: Vendor = data.find((item) => item.VendorNum === VendorNum);
  //   console.log(`${vendorItem.id}`);
  // Log the values of the route params to the console
  // console.log("ClientName:", ClientName);
  // console.log("ClientEmail:", ClientEmail);

  // Check if any of the required params are undefined
  if (VendorNum === undefined) {
    console.error("One or more route params are missing or undefined");
    return (
      <Text>Error: One or more route params are missing or undefined</Text>
    );
  }
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { userRole } = useContext(AuthContext);

  const [index, setIndex] = React.useState(0); // for tab component
  const [expanded, setExpanded] = useState(false);
  

  const tabContent = {
    0: (
      <View style={{ flex: 1 }}>
        <ScrollView>
          {[
            { title: "Name", value: handleName(vendorItem.Name), field: "VendorName" },
            { title: "Vendor #", value: vendorItem.VendorNum, field: "VendorNum" },
            { title: "Web Link", value: vendorItem.WebsiteLink, field: "WebsiteLink", onPress: () => handlePress(handleLink(vendorItem.WebsiteLink)) },
            { title: "Specialty", value: vendorItem.Specialty, field: "Specialty" },
            { title: "Type", value: vendorItem.Type, field: "Type" }
          ].map((item, index) => (
            <React.Fragment key={index}>
              <ListItem.Accordion
                content={
                  <ListItem.Content style={idStyles.listItemContent}>
                    <View style={idStyles.accordionContainer}>
                      <ListItem.Title style={idStyles.accordionTitle}>
                        <Text style={idStyles.cardTitle}>{item.title}</Text>
                      </ListItem.Title>
                      <ListItem.Subtitle style={idStyles.accordionContent}>
                        {item.onPress ? (
                          <TouchableOpacity onPress={item.onPress}>
                            <Text>{item.value}</Text>
                          </TouchableOpacity>
                        ) : (
                          <Text>{item.value}</Text>
                        )}
                      </ListItem.Subtitle>
                    </View>
                  </ListItem.Content>
                }
                isExpanded={expandedIndex === index && ['Manager', 'Admin'].includes(userRole)}
                onPress={() => {
                  if (['Manager', 'Admin'].includes(userRole)) {
                    setExpandedIndex(expandedIndex === index ? null : index);
                  }
                }}
                expandIcon={['Manager', 'Admin'].includes(userRole) ? 
                  { 
                    name: expandedIndex === index ? 'chevron-up' : 'chevron-down', 
                    type: 'material-community' 
                  } : 
                  { 
                    name: 'chevron-down', 
                    type: 'material-community',
                    color: 'white' 
                  }
                }
              >
                {['Manager', 'Admin'].includes(userRole) && (
                  <View style={{ flexDirection: "row" }}>
                    <Edit
                      id={vendorItem.id}
                      field={item.field}
                      collection="vendors"
                    />
                    <Delete
                      id={vendorItem.id}
                      field={item.field}
                      collection="vendors"
                    />
                  </View>
                )}
              </ListItem.Accordion>
              <Card.Divider />
            </React.Fragment>
          ))}
        </ScrollView>
      </View>
    ),
    1: (
      <View style={{ flex: 1 }}>
        <ScrollView>
          {[
            { title: "Contact Name", value: handleName(vendorItem.ContactName), field: "ContactName" },
            { title: "Email", value: handleEmail(vendorItem.Email), field: "Email", onPress: () => sendEmail(vendorItem.Email.toString()) },
            { title: "Phone", value: handlePhone(vendorItem.Tel1), field: "Tel1", onPress: () => handlePhoneInteraction(vendorItem.Tel1) },
            { title: "Phone 2", value: handlePhone(vendorItem.Tel2), field: "Tel2", onPress: () => handlePhoneInteraction(vendorItem.Tel2) }
          ].map((item, index) => (
            <React.Fragment key={index}>
              <ListItem.Accordion
                content={
                  <ListItem.Content style={idStyles.listItemContent}>
                    <View style={idStyles.accordionContainer}>
                      <ListItem.Title style={idStyles.accordionTitle}>
                        <Text style={idStyles.cardTitle}>{item.title}</Text>
                      </ListItem.Title>
                      <ListItem.Subtitle style={idStyles.accordionContent}>
                        {item.onPress ? (
                          <TouchableOpacity onPress={item.onPress}>
                            <Text>{item.value}</Text>
                          </TouchableOpacity>
                        ) : (
                          <Text>{item.value}</Text>
                        )}
                      </ListItem.Subtitle>
                    </View>
                  </ListItem.Content>
                }
                isExpanded={expandedIndex === index && ['Manager', 'Admin'].includes(userRole)}
                onPress={() => {
                  console.log(`User role: ${userRole}`);
                  if (['Manager', 'Admin'].includes(userRole)) {
                    setExpandedIndex(expandedIndex === index ? null : index);
                  }
                }}
                expandIcon={['Manager', 'Admin'].includes(userRole) ? 
                  { 
                    name: expandedIndex === index ? 'chevron-up' : 'chevron-down', 
                    type: 'material-community' 
                  } : 
                  { 
                    name: 'chevron-down', 
                    type: 'material-community',
                    color: 'white' 
                  }
                }
              >
                {['Manager', 'Admin'].includes(userRole) && (
                  <View style={{ flexDirection: "row" }}>
                    <Edit
                      id={vendorItem.id}
                      field={item.field}
                      collection="vendors"
                    />
                    <Delete
                      id={vendorItem.id}
                      field={item.field}
                      collection="vendors"
                    />
                  </View>
                )}
              </ListItem.Accordion>
              <Card.Divider />
            </React.Fragment>
          ))}
        </ScrollView>
      </View>
    ),
    2: (
      <View>
        <VendorPaymentsList navigation={navigation} route={route} vendorNum={VendorNum} />
      </View>
    ),
  };

  return (
    <View>
      <Tab value={activeTab} onChange={setActiveTab} dense 
      indicatorStyle={{
        backgroundColor: '#df3a0e', // Custom highlight color
        height: 4, // Optional: adjust the thickness of the highlight
  }}>
        <Tab.Item>Vendor info</Tab.Item>
        <Tab.Item>Contact Info</Tab.Item>
        <Tab.Item>Expenses</Tab.Item>
      </Tab>


      {/* Container for tabs with custom styles */}
      <View style={idStyles.tabContainer}>
        {/* Tabs with custom styles */}
      
        {/* Conditional rendering based on active tab */}
        {tabContent[activeTab]}
      </View>
    </View>
  );
}


