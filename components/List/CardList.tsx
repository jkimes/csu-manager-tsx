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
import { DataContext, useDataContext } from "../DataContext";

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

  useEffect(() => {
    renderCardList(navigation);
  }, [data]); // Call renderCardList whenever data changes

  useEffect(() => {
    // This effect will run whenever 'data' changes
    // console.log("Data has been Updated: ", filteredData);
    // data.forEach((item) => {
    //   console.log("Updated Data: ", item);
    // });
  }, [filteredData]);

  useEffect(() => {
    filterData(); // Update filtered data whenever filterState changes
  }, [filterState, searchText]);

  const filterData = async () => {
    let newData: any[] = []; // Initialize filteredData

    switch (filterState) {
      case "showAll":
        newData = await filterByShowAll(collectionRef);
        break;
      case "filterByActive":
        newData = await filterByActive(collectionRef);
        break;
      case "filterByInactive":
        newData = await filterByInactive(collectionRef);
        break;
      default:
        break;
    }

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

  function DisplayJobStatus(bool: boolean) {
    return bool ? "Active" : "Inactive";
  }
  const handleAddress = (street: string, city: string) => {
    if (street?.trim() === '""') {
      return "No address found";
    } else {
      return `${street}, ${city}`;
    }
  };
  const renderCardList = (navigation) => {
    // console.log("Inside RENDER Cards", filteredData.length); // data is empty
    return filteredData.map((item) => (
      <ThemeProvider key={item.id} theme={theme}>
        <Card>
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
          {/* </View> */}
        </Card>
      </ThemeProvider>
    ));
  };

  return (
    <ThemeProvider theme={theme}>
      <DataContext.Provider value={data}>
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
      </DataContext.Provider>
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
