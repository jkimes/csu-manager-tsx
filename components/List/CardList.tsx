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

/*Custom imports */
import { firebase, firebaseConfig } from "../../config";
import { filterByShowAll, filterByActive, filterByInactive } from "./Filters"; // Import filtering functions
import { DataContext } from "../DataContext";
import { handleAddress, DisplayJobStatus } from "../helperFunctions";
import DeleteClient from "../Buttons/DeleteClient";
import { cardlistStyles } from "./styles/cardlist.styles";

//initalizes firebase connection
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const CardList = ({ navigation, route, searchText }) => {
  const { theme, updateTheme } = useTheme();
  const data = useContext(DataContext);
  const [filteredData, setFilteredData] = useState(data);
  const collectionRef = firebase.firestore().collection("clients");
  const [filterState, setFilterState] = useState<string>("showAll");

  // Call renderCardList whenever data changes
  useEffect(() => {
    renderCardList(navigation);
     console.log("Card List Data context", { data });
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
        const JobSite = (item.JobSite || "").toString().toLowerCase();
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
    return filteredData.map((item) => (
      <ListItem.Swipeable
        key={item.id}
        leftContent={(action) => (
          <View style={{ alignItems: "center" }}>
            <DeleteClient id={item.id} />
          </View>
        )}
        style={cardlistStyles.listItem}
      >
        <Card key={item.id} containerStyle={cardlistStyles.card}>
          <View style={{ position: "relative" }}>
            <View style={cardlistStyles.contactBoxDetails}>
              <View>
                <Text style={cardlistStyles.textStyleName}>
                  {item.CustomerName}
                </Text>
                <View style={{}}>
                <Text style={cardlistStyles.textClientNum}>
                  Client#: {item.CustomerNum}
                </Text>
                <Text >
                  Job Status: {item.JobStatus}
                </Text>
                </View>
                
                <Text style={cardlistStyles.textStyle}>
                  Job Site: {handleAddress(item.JobSite)}
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
