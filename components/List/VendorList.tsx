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
  filterByProffessional,
  filterBySubcontractors,
  filterByMaterials,
  filterByEquipment,
  filterAllTypes,
} from "./Filters"; // Import filtering functions
import { DataContext } from "../DataContext";
import { handleAddress, DisplayJobStatus } from "../helperFunctions";
import DeleteClient from "../Buttons/DeleteClient";
import { cardlistStyles } from "./styles/cardlist.styles";
import { VendorsContext } from "../VendorsContext";

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
  // console.log(`Link: ${link}`);
  if (link === "") {
    return "No Link";
  } else return link;
}

const VendorList = ({ navigation, route, searchText }) => {
  const { theme, updateTheme } = useTheme();
  const data = useContext(VendorsContext);
  const [filteredData, setFilteredData] = useState(data);
  const collectionRef = firebase.firestore().collection("vendors");
  const [filterState, setFilterState] = useState<string>("showAll");

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
      case "Proffessional":
        newData = await filterByProffessional(data);
        break;
      case "Materials":
        newData = await filterByMaterials(data);
        break;
      case "Equipment":
        newData = await filterByMaterials(data);
        break;
      case "All Types":
        newData = await filterAllTypes(data);
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

  // renders a component for each client in filtered data that links to their profile page
  const renderCardList = (navigation) => {
    return filteredData.map((item) => (
      <ListItem.Swipeable
        key={item.id}
        leftContent={(action) => (
          <View>
            <Text>{item.id}</Text>
            <DeleteClient id={item.id} />
          </View>
        )}
        style={cardlistStyles.listItem}
      >
        <Card key={item.id} containerStyle={cardlistStyles.card}>
          {/* <View key={item.id} style={styles.contactBox}> */}
          <View style={cardlistStyles.contactBoxDetails}>
            <View>
              <Text style={cardlistStyles.textStyleName}>{item.Name}</Text>
              <Text style={cardlistStyles.textStyle}>
                Vendor #: {item.VendorNum}
              </Text>
              <Text style={cardlistStyles.textClientNum}>
                Specialty: {item.Specialty}
              </Text>
              <Text style={cardlistStyles.textStyle}>Type: {item.Type}</Text>
              <TouchableOpacity onPress={() => handlePress(item.WebsiteLink)}>
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
        <View style={cardlistStyles.buttonContainer}>
          <Button
            style={cardlistStyles.button}
            title="All Types"
            onPress={() => {
              setFilterState("All Types");
            }}
          />

          <Button
            title="Subcontractors"
            onPress={() => {
              setFilterState("Subcontractors");
            }}
          />

          <Button
            title="Proffessional"
            onPress={() => {
              setFilterState("Proffessional");
            }}
          />

          <Button
            title="Materials"
            onPress={() => {
              setFilterState("Materials");
            }}
          />

          <Button
            title="Equipment"
            onPress={() => setFilterState("filterByInactive")}
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
