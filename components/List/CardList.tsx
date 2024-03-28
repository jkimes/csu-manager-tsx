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
} from "react-native";
// import { Link, Stack } from "expo-router";
// import { Dropdown } from "react-native-element-dropdown";
import { COLORS, FONT, SIZES } from "../../constants";
import { ThemeProvider, useTheme, Card, Button } from "@rneui/themed";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

/*Custom imports */
import { firebase, firebaseConfig } from "../../config";
import { filterByShowAll, filterByActive, filterByInactive } from "./Filters"; // Import filtering functions
import { DataContext } from "../DataContext";

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
    console.log("Filtered Data", filteredData);
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
        const clientNumber = (item.ClientNumber || "").toString().toLowerCase();
        const id = (item.ClientName || "").toString().toLowerCase();
        const city = (item.Address_City || "").toString().toLowerCase();
        const street = (item.Address_Street || "").toString().toLowerCase();

        const search = searchText.toLowerCase();
        return (
          clientNumber.includes(search) ||
          id.includes(search) ||
          city.includes(search) ||
          street.includes(search)
        );
      });
    }
    setFilteredData(newData);
  };

  // Takes the Active bool and returns string Active or Inactive if it is T or F
  function DisplayJobStatus(bool: boolean) {
    return bool ? "Active" : "Inactive";
  }

  //Checks to see if there is an address and returns a not found message or the address if found
  const handleAddress = (street: string, city: string) => {
    if (street?.trim() === '""') {
      return "No address found";
    } else {
      return `${street}, ${city}`;
    }
  };

  // renders a component for each client in filtered data that links to their profile page
  const renderCardList = (navigation) => {
    return filteredData.map((item) => (
      <Card key={item.id}>
        {/* <View key={item.id} style={styles.contactBox}> */}
        <View style={styles.contactBoxDetails}>
          <View>
            <Text style={styles.textStyleName}>{item.ClientName}</Text>
            <Text style={styles.textStyle}>
              Job Status: {DisplayJobStatus(item.Active)}
            </Text>
            <Text style={styles.textStyle}>Client#: {item.ClientNumber}</Text>

            <Text style={styles.textStyle}>
              {handleAddress(item.Address_Street, item.Address_City)}
            </Text>
          </View>
        </View>
        <Button
          title="View Profile"
          onPress={() => {
            /* 1. Navigate to the Details route with params */
            navigation.navigate("Profile", {
              ClientNumber: item.ClientNumber,
              ClientPhone: item.ClientPhone,
              ClientEmail: item.ClientEmail,
              ClientName: item.ClientName,
            });
          }}
        />
      </Card>
    ));
  };

  return (
    <ThemeProvider theme={theme}>
      <View>
        <View style={styles.buttonContainer}>
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
        <Card.Divider />
        {renderCardList(navigation)}
      </View>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  button: {
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  container: {
    backgroundColor: "black",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 100,
    width: "100%",
    height: "100%",
    marginTop: SIZES.small,
    gap: SIZES.small,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: SIZES.large,
    color: COLORS.primary,
  },
  headerBtn: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  contactBox: {
    borderWidth: 1,
    borderColor: "#d1d1d1",
    backgroundColor: "white",
    borderRadius: 5,
    width: "100%",
  },
  contactBoxDetails: {
    flexDirection: "row",
  },
  textStyleName: {
    fontSize: 20,
  },
  textStyle: {
    fontSize: 18,
    color: "#000",
    fontWeight: "normal",
    marginVertical: 2,
  },
});

export default CardList;
