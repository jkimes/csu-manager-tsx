import React, { useState, useContext, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Platform,
  Linking,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Card, Button, Tab, TabView, ListItem, Icon, FAB } from "@rneui/themed";
import { getAuth } from 'firebase/auth';
import { firebase, firebaseConfig } from '../config';

// custom imports
import Delete from "../components/Buttons/Delete";
import Edit from "../components/Buttons/Edit";
import QuoteList from "../components/List/QuoteList";
import { Client, LineItem } from "../App";
import { DataContext } from "../components/ContextGetters/DataContext";
import Payments from "../components/List/Payments"
import {
  makePhoneCall,
  sendEmail,
  DisplayJobStatus,
  handleAddress,
  handlePhone,
  handleEmail,
  handleName,
  handleFullAddress,
} from "../components/Helpers/helperFunctions";
import { idStyles } from "./styles/[id].styles";

export default function SingleClient({ 
  route, 
  navigation 
}: {
  route: { 
    params: {
      ClientNumber: string;
      ClientEmail: string;
      ClientPhone: string;
      ClientName: string;
    }
  },
  navigation: any;
}): JSX.Element {
  const data = useContext(DataContext);
  // const quotes = useContext(QuoteContext);
  const [activeTab, setActiveTab] = React.useState<number>(0); // State to manage the active tab
  const { ClientNumber, ClientName } = route.params;
  const client: Client = data.find((item: Client) => item.CustomerNum === ClientNumber);
  //console.log(`CLIENT ID: ${client.id}`);
  // Log the values of the route params to the console
  // console.log("ClientName:", ClientName);
  // console.log("ClientEmail:", ClientEmail);

  // Check if any of the required params are undefined
  if (
    ClientNumber === undefined ||
    // ClientEmail === undefined ||
    // ClientPhone === undefined ||
    ClientName === undefined
  ) {
    console.error("One or more route params are missing or undefined");
    return (
      <Text>Error: One or more route params are missing or undefined</Text>
    );
  }

  const [index, setIndex] = React.useState(0); // for tab component
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [userRole, setUserRole] = useState('User');

  useEffect(() => {
    const getCurrentUserRole = async () => {
      const currentUser = getAuth().currentUser;
      if (currentUser) {
        const userRef = firebase.firestore().collection('Users').doc(currentUser.uid);
        const doc = await userRef.get();
        if (doc.exists) {
          setUserRole(doc.data()?.role || 'User');
        }
      }
    };
    getCurrentUserRole();
  }, []);

  const tabContent = {
    0: (
      <View style={{ flex: 1 }}>
        <ScrollView>
          {[
            { title: "Client Name", value: handleName(client.ClientName), field: "ClientName" },
            { title: "Customer Name", value: client.CustomerName, field: "CustomerName" },
            { title: "Job Status", value: client.Active, field: "Active" },
            { title: "Client #", value: client.CustomerNum, field: "CustomerNum" },
            { title: "Email", value: handleEmail(client.ClientEmail), field: "ClientEmail", onPress: () => sendEmail(client.ClientEmail.toString()) },
            { title: "Phone", value: handlePhone(client.ClientPhone), field: "ClientPhone", onPress: () => makePhoneCall(client.ClientPhone) },
            { title: "Phone 2", value: handlePhone(client.ClientPhone2), field: "ClientPhone2", onPress: () => makePhoneCall(client.ClientPhone2) },
            { title: "Job Site", value: handleFullAddress(client.JobSiteStreet, client.JobSiteCity, client.JobSiteState, client.JobSiteZip), field: "JobSite" },
            { title: "Contact Name", value: handleName(client.ContactName), field: "ContactName" },
            { title: "Contact Email", value: handleEmail(client.ContactEmail), field: "ContactEmail", onPress: () => sendEmail(client.ContactEmail) },
            { title: "Contact Phone", value: handlePhone(client.ContactPh1), field: "ContactPh1", onPress: () => makePhoneCall(client.ContactPh1) },
            { title: "Contact Phone 2", value: handlePhone(client.ContactPh2), field: "ContactPh2", onPress: () => makePhoneCall(client.ContactPh2) },
            { title: "Billing Address", value: handleFullAddress(client.BillingStreet, client.BillingCity, client.BillingState, client.BillingZip), field: "BillingAddress" }
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
                      id={String(client.CustomerNum)}
                      field={item.field}
                      collection="clients"
                    />
                    {item.field !== "Active" && (
                      <Delete
                        id={String(client.CustomerNum)}
                        field={item.field}
                        collection="clients"
                      />
                    )}
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
        <Card containerStyle={idStyles.cardContainer}>
          <Card.Title style={idStyles.cardTitle}>
            <Text>Document Links</Text>
          </Card.Title>
        </Card>

        <QuoteList
          navigation={navigation}
          route={route}
          ClientNumber={client.CustomerNum}
        ></QuoteList>

        <FAB
          visible={true}
          icon={{ name: "add", color: "white" }}
          color="#df3a0e"
          title={"Add"}
          onPress={() =>
            navigation.navigate("AddQuote", {
              ClientNumber: client.CustomerNum,
            })
          }
        />

        {/* Add any additional content for Tab 2 */}
      </View>
    ),
    2: (
      <View>
         <Card.Title style={idStyles.cardTitle}>
          </Card.Title>
          <Payments navigation={navigation} route={route} clientNumber={client.CustomerNum}/> 

          
        
      </View>
    ),
  };

  return (
    <View>
      <Tab value={activeTab} onChange={
        setActiveTab} dense
        indicatorStyle={{
        backgroundColor: '#df3a0e', // Custom highlight color
        height: 4, // Optional: adjust the thickness of the highlight
  }}>
        <Tab.Item>Client info</Tab.Item>
        <Tab.Item>Quote/Docs</Tab.Item>
        <Tab.Item>Last payment</Tab.Item>
      </Tab>

      {/* Container for tabs with custom styles */}
      <View style={idStyles.tabContainer}>
        {/* Tabs with custom styles */}
        {/* Conditional rendering based on active tab */}
        {tabContent[activeTab as keyof typeof tabContent]}
      </View>
    </View>
  );
}
