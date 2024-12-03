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
  ScrollView,
} from "react-native";
import { COLORS, FONT, SIZES } from "../../constants";
import { ThemeProvider, useTheme, Card, Button, ListItem } from "@rneui/themed";
import { getAuth } from 'firebase/auth';

/*Custom imports */
import { firebase, firebaseConfig } from "../../config";
import { filterByShowAll, filterByActive, filterByInactive } from "./Filters"; // Import filtering functions
import { DataContext } from "../ContextGetters/DataContext";
import { handleAddress, DisplayJobStatus } from "../Helpers/helperFunctions";
import DeleteClient from "../Buttons/DeleteClient";
import { cardlistStyles } from "./styles/cardlist.styles";

//initalizes firebase connection
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const CardList = ({ navigation, route, searchText }) => {
  const { theme, updateTheme } = useTheme();
  let data = useContext(DataContext);
  data = data.sort((a, b) => {
    // Fallback to an empty string in case ClientName is undefined or null
    const nameA = a?.CustomerName?.toString() || "";
    const nameB = b?.CustomerName?.toString() || "";
    return nameA.localeCompare(nameB);
  });
  const [filteredData, setFilteredData] = useState(data);
  const collectionRef = firebase.firestore().collection("clients");
  const [filterState, setFilterState] = useState<string>("showAll");
  const [userRole, setUserRole] = useState('User');

  // Move useEffect to component level
  useEffect(() => {
    const getCurrentUserRole = async () => {
      const currentUser = getAuth().currentUser;
      if (currentUser) {
        const userRef = firebase.firestore().collection('users').doc(currentUser.uid);
        const doc = await userRef.get();
        if (doc.exists) {
          setUserRole(doc.data()?.role || 'User');
        }
      }
    };
    getCurrentUserRole();
  }, []);

  // Call renderCardList whenever data changes
  useEffect(() => {
    renderCardList(navigation);
     //console.log("Card List Data context", { data });
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
      case "showAll":
        newData = await filterByShowAll(data);
        break;
      case "filterByActive":
        newData = await filterByActive(data);
        break;
      case "filterByInactive":
        newData = await filterByInactive(data);
        break;
      default:
        break;
    }

    // if user input is not blank filter further by the input by checking if certain values in the data match the input
    if (searchText !== "") {
      // console.log("User Input: ", searchText);
      // Filter further based on search text
      newData = newData.filter((item) => {
        const clientNumber = (item.CustomerNum || "").toString().toLowerCase();
        const id = (item.CustomerName || "").toString().toLowerCase();
        const JobSite = (item.JobSiteStreet || "").toString().toLowerCase();
        // const street = (item.Address_Street || "").toString().toLowerCase();

        const search = searchText.toLowerCase();
        return (
          clientNumber.includes(search) ||
          id.includes(search) ||
          JobSite.includes(search)
          // street.includes(search)
        );
      });
    }
    setFilteredData(newData);
  };

  // renders a component for each client in filtered data that links to their profile page
  const renderCardList = (navigation) => {
    return filteredData
      .filter(item => item.CustomerNum != null && item.CustomerNum !== undefined && item.CustomerNum !== 0)
      .map((item) => (
        <ListItem.Swipeable
          key={item.id}
          leftContent={(action) => (
            ['Manager', 'Admin'].includes(userRole) ? (
              <View style={{ alignItems: "center" }}>
                <DeleteClient id={item.id} />
              </View>
            ) : null
          )}
          style={cardlistStyles.listItem}
        >
          <Card key={item.id} containerStyle={cardlistStyles.card}>
            <View style={cardlistStyles.cardContent}>
              <View style={cardlistStyles.statusContainer}>
                <Text style={[
                  cardlistStyles.statusText,
                  { 
                    color: item.Active === "I" ? "#ff3b30" : item.Active === "A" ? "#34c759" : "black",
                    fontWeight: "bold"
                  }
                ]}>
                  {item.Active === "I" ? "I" : item.Active === "A" ? "A" : item.Active}
                </Text>
              </View>

              <View style={cardlistStyles.contactBoxDetails}>
                <View>
                  <Text style={cardlistStyles.textStyleName} numberOfLines={1}>
                    {item.CustomerName}
                  </Text>
                  <Text style={cardlistStyles.textClientNum}>
                    Client#: {item.CustomerNum}
                  </Text>
                  <Text style={cardlistStyles.textStyle}>
                    Job Site: {handleAddress(item.JobSiteStreet)}
                  </Text>
                </View>
              </View>
              <Button
                title="View Profile"
                onPress={() => {
                  navigation.navigate("Profile", {
                    ClientNumber: item.CustomerNum,
                    ClientPhone: item.ClientCell,
                    ClientEmail: item.ClientEmail,
                    ClientName: item.CustomerName,
                  });
                }}
              />
            </View>
          </Card>
        </ListItem.Swipeable>
      ));
  };

  return (
    <ThemeProvider theme={theme}>
      <View style={{ backgroundColor: "white" }}>
        <View style={cardlistStyles.buttonContainer}>
          <Button
            title="Show All"
            onPress={() => {
              setFilterState("showAll");
            }}
          />

          <Button
            title="Active"
            onPress={() => {
              setFilterState("filterByActive");
            }}
          />

          <Button
            title="Inactive"
            onPress={() => setFilterState("filterByInactive")}
          />
        </View>
        {/* <Card.Divider /> */}
        <ScrollView contentContainerStyle={cardlistStyles.listItemContainer}>
          {renderCardList(navigation)}
        </ScrollView>
      </View>
    </ThemeProvider>
  );
};

export default CardList;
