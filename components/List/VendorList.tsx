/**************************************************************************************************************/
/* Author: Jalon Kimes                                                                                        */
/* This file fetched the data from the api and displays it in a list of card elements                         */
/**************************************************************************************************************/
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  Linking,
  Alert,
  ScrollView,
} from "react-native";
import { COLORS, FONT, SIZES } from "../../constants";
import { ThemeProvider, useTheme, Card, Button, ListItem } from "@rneui/themed";

/*Custom imports */
import { firebase, firebaseConfig } from "../../config";
import {
  filterByProfessional,
  filterBySubcontractors,
  filterByMaterials,
  filterByEquipment,
  filterAllTypes,
  filterByGVT,
} from "./Filters"; // Import filtering functions
import { DataContext } from "../ContextGetters/DataContext";
import {
  handleAddress,
  DisplayJobStatus,
  handleName,
} from "../Helpers/helperFunctions";
import DeleteClient from "../Buttons/DeleteClient";
import { cardlistStyles } from "./styles/cardlist.styles";
import { VendorsContext } from "../ContextGetters/VendorsContext";
import { Divider } from "@rneui/base";

//initalizes firebase connection
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const handlePress = async (url: string) => {
  const supported = await Linking.canOpenURL(url);

  if (supported) {
    await Linking.openURL(url);
  } else {
    Alert.alert(`Don't know how to open this URL: ${url}`);
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

const VendorList = ({ 
  navigation, 
  route, 
  searchText 
}: {
  navigation: any;
  route: any;
  searchText: string;
}) => {
  const { theme, updateTheme } = useTheme();
  const data = useContext(VendorsContext);
  const [filteredData, setFilteredData] = useState(data);
  const collectionRef = firebase.firestore().collection("vendors");
  const [filterState, setFilterState] = useState<string>("All Groups");

  // Call renderCardList whenever data changes
  useEffect(() => {
    renderCardList(navigation);
    // console.log("Card List Data context", { data });
  }, [data]);

  // This effect will run whenever 'data' changes
  useEffect(() => {
    // console.log("Filtered Data", filteredData);
  }, [filteredData]);

  // Update filtered data whenever filterState changes
  useEffect(() => {
    filterData();
  }, [filterState, searchText]);

  // executes a helper method to filter data based on the state of "filterState" then optionally
  // if the user types text into the search bar it will filter by the input after the first filter has been applied
  const filterData = async () => {
    let newData: any[] = []; // Initialize filteredData

    switch (filterState) {
      case "Subcontractors":
        newData = await filterBySubcontractors(data);
        break;
      case "ProServ":
        newData = await filterByProfessional(data);
        break;
      case "Materials":
        newData = await filterByMaterials(data);
        
        break;
      case "Equipment":
        newData = await filterByEquipment(data);
        console.log(JSON.stringify(newData));
        break;
      case "All Groups":
        newData = await filterAllTypes(data);
        break;
      case "GVT":
        newData = await filterByGVT(data);
        break;

      default:
        break;
    }

    // Filter out invalid VendorNum entries
    newData = newData.filter(item => 
      item.VendorNum != null && 
      item.VendorNum !== undefined && 
      item.VendorNum !== 0
    );

    // if user input is not blank filter further by the input by checking if certain values in the data match the input
    if (searchText !== "") {
      // console.log("User Input: ", searchText);
      // Filter further based on search text
      newData = newData.filter((item) => {
        const VendorNum = (item.VendorNum || "").toString().toLowerCase();
        const id = (item.Name || "").toString().toLowerCase();
        const contact = (item.ContactName || "").toString().toLowerCase();
        const city = (item.City || "").toString().toLowerCase();
        const street = (item.StreetAddress || "").toString().toLowerCase();
        const email = (item.Email || "").toString().toLowerCase();
        const specialty = (item.Specialty || "").toString().toLowerCase();
        const tel1 = (item.Tel1 || 0).toString().toLowerCase();
        const tel2 = (item.Tel2 || 0).toString().toLowerCase();

        const search = searchText.toLowerCase();
        return (
          VendorNum.includes(search) ||
          id.includes(search) ||
          city.includes(search) ||
          street.includes(search) ||
          contact.includes(search) ||
          email.includes(search) ||
          specialty.includes(search) ||
          tel1.includes(search) ||
          tel2.includes(search)
        );
      });
    }

    // Sort alphabetically by Name
    newData.sort((a, b) => {
      const nameA = (a.Name || '').toLowerCase();
      const nameB = (b.Name || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });

    setFilteredData(newData);
  };
  // renders a component for each client in filtered data that links to their profile page
  const renderCardList = (navigation: any) => {
    return filteredData.map((item: any) => (
      <ListItem.Swipeable
        key={item.id}
        leftContent={(action) => (
          <View>
            <DeleteClient id={item.id} />
          </View>
        )}
        style={cardlistStyles.listItem}
      >
        <Card key={item.id} containerStyle={cardlistStyles.card}>
          {/* <View key={item.id} style={styles.contactBox}> */}
          <View style={cardlistStyles.contactBoxDetails}>
            <View>
              <Card.Title style={cardlistStyles.textStyleName}>
                {handleName(item.Name)}
              </Card.Title>
              <Divider />
              <Text style={cardlistStyles.textStyle}>
                Vendor #: {item.VendorNum}
              </Text>
              <Text style={cardlistStyles.textClientNum}>
                Specialty: {item.Specialty}
              </Text>
              <Text style={cardlistStyles.textStyle}>Group: {item.Type}</Text>
              <TouchableOpacity onPress={() => handlePress(handleLink(item.WebsiteLink))}>
                <Text style={cardlistStyles.textStyle}>
                  {" "}
                  Link: {handleLink(item.WebsiteLink)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Button
            title="View Profile"
            onPress={() => {
              /* 1. Navigate to the Details route with params */
              navigation.navigate("VendorProfile", {
                VendorNum: item.VendorNum,
              });
            }}
          />
        </Card>
      </ListItem.Swipeable>
    ));
  };

  return (
    <ThemeProvider theme={theme}>
      <View>
        <View style={[cardlistStyles.buttonContainer, { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }]}>
          <Button
            style={[cardlistStyles.button, { margin: 4, minWidth: 100 }]}
            titleStyle={{ fontSize: 12 }}
            title="All Groups"
            onPress={() => {
              setFilterState("All Groups");
            }}
          />

          <Button
            style={[cardlistStyles.button, { margin: 4, minWidth: 100 }]}
            titleStyle={{ fontSize: 12 }}
            title="Subcontractors" 
            onPress={() => {
              setFilterState("Subcontractors");
            }}
          />

          <Button
            style={[cardlistStyles.button, { margin: 4, minWidth: 100 }]}
            titleStyle={{ fontSize: 12 }}
            title="Materials"
            onPress={() => {
              setFilterState("Materials");
            }}
          />

          <Button
            style={[cardlistStyles.button, { margin: 4, minWidth: 100 }]}
            titleStyle={{ fontSize: 12 }}
            title="ProServ"
            onPress={() => {
              setFilterState("ProServ");
            }}
          />

          <Button
            style={[cardlistStyles.button, { margin: 4, minWidth: 100 }]}
            titleStyle={{ fontSize: 12 }}
            title="Equipment"
            onPress={() => setFilterState("Equipment")}
          />

          <Button
            style={[cardlistStyles.button, { margin: 4, minWidth: 100 }]}
            titleStyle={{ fontSize: 12 }}
            title="GVT"
            onPress={() => {
              setFilterState("GVT");
            }}
          />
        </View>
        <Card.Divider />
        <ScrollView contentContainerStyle={cardlistStyles.listItemContainer}>
          {renderCardList(navigation)}
        </ScrollView>
      </View>
    </ThemeProvider>
  );
};

export default VendorList;
