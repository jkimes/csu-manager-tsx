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
import { PaymentContext } from "../ContextGetters/PaymentContext";
import { handleAddress, DisplayJobStatus } from "../Helpers/helperFunctions";
import DeleteClient from "../Buttons/DeleteClient";
import { cardlistStyles } from "./styles/cardlist.styles";

//initalizes firebase connection
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const filterAndSortData = (data: any[] | undefined, clientNumber: number) => {
    if (!data || data.length === 0) {
      console.log("Data is empty or undefined");
      return [];
    }
  
    console.log("ClientNumber to filter: ", clientNumber);
  
    // Filter the data to include only entries with matching clientNumber
    const filteredData = data?.filter(item => {
      //console.log("Checking item: ", item.CustomerNum); // Log each CustomerNum
      // Check if item.CustomerNum exists and compare with clientNumber
      return String(item.CustomerNum) === String(clientNumber); // Type-safe comparison
    });
  
    //console.log("Filtered Data: ", JSON.stringify(filteredData));
  
    // Sort the filtered data by the Date field (most recent first)
    const sortedData = filteredData?.sort((a, b) => {
      if (a.Date && b.Date) {
        const dateA = a.Date.toDate(); // Convert Timestamp to Date
        const dateB = b.Date.toDate(); // Convert Timestamp to Date
        return dateB.getTime() - dateA.getTime(); // Most recent dates first
      }
      return 0; // If Date is missing, treat as equal
    });
    //console.log("Sorted Data" + sortedData);
    return sortedData || [];
  };
  


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
    console.log("Payment Client Num " + clientNumber );
  const { theme, updateTheme } = useTheme();
  const data = useContext(PaymentContext);
  //console.log("MY PAYMENT Data context" + JSON.stringify(data ));
  const [filteredData, setFilteredData] = useState(data);
  const collectionRef = firebase.firestore().collection("AR");
  const [filterState, setFilterState] = useState<string>("showAll");


  var customerData = filterAndSortData(data,clientNumber);
  //console.log("Customer Data: " + JSON.stringify(customerData))

  useEffect(() => {
    console.log("Customer Data to Render: ", customerData);
  }, [customerData]);


  
  // Call renderCardList whenever data changes
  useEffect(() => {
    //renderCardList(navigation);
  }, [data]);

  // This effect will run whenever 'data' changes
//   useEffect(() => {
//     // console.log("Filtered Data", filteredData);
//   }, [filteredData]);

  // Update filtered data whenever filterState changes
//   useEffect(() => {
//     filterData();
//   }, [filterState, searchText]);

  // executes a helper method to filter data based on the state of "filterState" then optionally
  // if the user types text into the search bar it will filter by the input after the first filter has been applied
  
    // if user input is not blank filter further by the input by checking if certain values in the data match the input
//     if (searchText !== "") {
//       // console.log("User Input: ", searchText);
//       // Filter further based on search text
//       newData = newData.filter((item) => {
//         const clientNumber = (item.CustomerNum || "").toString().toLowerCase();
//         const id = (item.CustomerName || "").toString().toLowerCase();
//         const JobSite = (item.JobSite || "").toString().toLowerCase();
//         // const street = (item.Address_Street || "").toString().toLowerCase();

//         const search = searchText.toLowerCase();
//         return (
//           clientNumber.includes(search) ||
//           id.includes(search) ||
//           JobSite.includes(search)
//           // street.includes(search)
//         );
//       });
//     }
//     setFilteredData(newData);
//   };

  // renders a component for each client in filtered data that links to their profile page
  const renderCardList = () => {
    return customerData?.map((item) => (
        <Card key={item.id} containerStyle={cardlistStyles.card}>
          <View style={{ flexDirection: 'column', alignItems: 'flex-start'  }}>
            <Text style={cardlistStyles.textStyleName}>
              Payment Date: {formatTimestampToDate(item.Date)}
            </Text>
            <Text style={cardlistStyles.textStyleName}>
                Amt: ${item.PmtAmount}
            </Text>
            <Text style={cardlistStyles.textClientNum}>
                Pmt Method: {item.PmtMethod}
            </Text>
            {/* <Text style={cardlistStyles.textStyle}>
                check#: {item.CkNumber}
                </Text> */}
            </View>
        </Card>
      
    ));
  };

  return (
    // <ThemeProvider theme={theme}>
      <View >
        <ScrollView >
          {renderCardList()}
        </ScrollView>
      </View>
    // </ThemeProvider>
  );
};

export default Payments;