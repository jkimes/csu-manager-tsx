/**************************************************************************************************************/
/* Author: Jalon Kimes                                                                                        */
/* This file fetched the data from the api and displays it in a list of card elements                         */
/**************************************************************************************************************/
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Link, Stack } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";
import { COLORS, FONT, SIZES } from "../../constants";
import { ThemeProvider, createTheme } from "@rneui/themed";

/*Custom imports */
import Card from "../Cards/Card";
import { firebase, firebaseConfig } from "../../config";
import { filterByShowAll, filterByActive, filterByInactive } from "./Filters"; // Import filtering functions

const theme = createTheme({
  lightColors: {
    primary: "red",
  },
  darkColors: {
    primary: "blue",
  },
  components: {
    Button: {
      raised: true,
    },
  },
});
//initalizes firebase connection
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

interface CardListProps {
  searchText: string;
  showComplete: boolean;
}
export interface ClientParams {
  id: string;
  ClientName: string;
  ClientNumber: number;
  ClientEmail: string;
  ClientPhone: number;
  StreetName: string;
  City: string;
  Zip: string;
  Active: boolean;
  Contacts: Map<string, Map<string, string>>; // Update this to the correct type if possible
  JobStreet: string;
  JobCity: string;
  Quotes: Map<string, Map<string, quoteTypes>>;
}
type quoteTypes = string | Map<string, lineTypes>;
type lineTypes = string | number;

const CardList: React.FC<CardListProps> = ({ searchText, showComplete }) => {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const collectionRef = firebase.firestore().collection("clients");
  const [filterState, setFilterState] = useState<string>("showAll");

  useEffect(() => {
    renderCardList();
  }, [data]); // Call renderCardList whenever data changes

  useEffect(() => {
    // This effect will run whenever 'data' changes
    console.log("Data has been Updated: ", filteredData);
    // data.forEach((item) => {
    //   console.log("Updated Data: ", item);
    // });
  }, [filteredData]);

  useEffect(() => {
    fetchData(); // Fetch initial data when component mounts
  }, []);

  useEffect(() => {
    filterData(); // Update filtered data whenever filterState changes
  }, [filterState, searchText]);

  const fetchData = async () => {
    const snapshot = await collectionRef.get();
    if (snapshot.empty) {
      console.log("No matching results!");
    } else {
      const newData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(newData); // Update state with fetched data
      setFilteredData(newData); // Initialize filteredData with fetched data
    }
  };

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
      console.log("User Input: ", searchText);
      // Filter further based on search text
      newData = newData.filter((item) => {
        const clientNumber = (item.ClientNumber || "").toString().toLowerCase();
        const id = (item.id || "").toString().toLowerCase();
        const city = (item.Address?.City || "").toString().toLowerCase();
        const street = (item.Address?.StreetName || "")
          .toString()
          .toLowerCase();

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

  const renderCardList = () => {
    console.log("Inside RENDER Cards", filteredData[0]); // data is empty
    return filteredData.map((item) => (
      <ThemeProvider theme={theme}>
        <View key={item.id} style={styles.contactBox}>
          <View style={styles.contactBoxDetails}>
            <View>
              <Text style={styles.textStyleName}>{item.ClientName}</Text>
              <Text style={styles.textStyle}>{item.ClientNumber}</Text>
              <Text style={styles.textStyle}>{item.Address?.StreetName}</Text>
              <Text> Job Status: {DisplayJobStatus(item.Active)} </Text>
            </View>
          </View>
          <Link
            href={{
              pathname: "/clients/[id]",
              params: {
                id: item.ClientName,
                ClientName: item.ClientName,
                ClientNumber: item.ClientNumber,
                ClientEmail: item.ClientEmail,
                ClientPhone: item.ClientPhone,
                StreetName: item.Address?.StreetName,
                City: item.Address?.City,
                Zip: item.Address?.Zip,
                Active: item.Active,
                Contacts: item.Contacts,
                JobStreet: item.JobSite?.StreetName,
                JobCity: item.JobSite?.City,
                Quotes: item.Quotes,
                filteredData: filteredData,
              } as ClientParams,
            }}
            asChild
          >
            <Button title={"View Contact"} />
          </Link>
        </View>
      </ThemeProvider>
    ));
  };

  return (
    <ThemeProvider theme={theme}>
      <View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setFilterState("showAll");
            }}
          >
            <Text>Show All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setFilterState("filterByActive");
            }}
          >
            <Text>InActive</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setFilterState("filterByInactive")}
          >
            <Text>Active</Text>
          </TouchableOpacity>
        </View>

        {renderCardList()}
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

//<View style={styles.container}>
//   {/* <View style={styles.cardsContainer}> */}
//   <Stack.Screen options={{ title: "Clients" }} />
//   {filteredData.map((item) => {
//     // console.log("Current data object:", data); // Log the current data object
//     return (
//       <View key={item.id} style={styles.contactBox}>
//         <View style={styles.contactBoxDetails}>
//           <View>
//             <Text style={styles.textStyleName}>{item.id}</Text>
//             <Text style={styles.textStyle}>{item.ClientNumber}</Text>
//             <Text> Job Status: {handleJobStatus(item.Complete)} </Text>
//           </View>
//         </View>
//         <Link
//           href={{
//             pathname: "/clients/[id]",
//             params: {
//               id: item.id,
//               Address: item.Address,
//               Email: item.Email,
//               PhoneNumer: item.PhoneNumber,
//               ClientNumer: item.ClientNumber,
//               Contracts: item.Contracts,
//               Quotes: item.Quotes,
//               Refferals: item.Refferals,
//               Complete: item.Complete,
//               BillAddress: item.BillingAddress,
//             },
//           }}
//           asChild
//         >
//           <Button title={"View Contact"}></Button>
//         </Link>
//       </View>
//     );
//   })}
// </View>

/*const [data, setData] = useState([]);
  const [sortBy, setSortBy] = useState("id");
  // const [showComplete, setShowComplete] = useState(false);

  // This function fetches the data from the firebase db when CardList component is and stores it to data variable
  // it only updated the data when there is a change to the firebase db
  useEffect(() => {
    const unsubscribe = firebase
      // .orderBy(sortBy) // Initially sort by ClientNumber
      .firestore()
      .collection("clients")
      // OnSnapshot listens for changes to the data and retrieves it only when there is a change which limits read calls to firebase db
      .onSnapshot((snapshot) => {
        const newData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(newData);
      });

    return () => unsubscribe();
  }, [sortBy]);

  // Handels the sorting function
  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handleToggleComplete = () => {
    setShowComplete(!showComplete);
  };

  // Filter data based on search text
  const filteredData = data.filter((item) => {
    const clientNumber = (item.ClientNumber || "").toString().toLowerCase();
    const id = (item.id || "").toString().toLowerCase();
    const city = (item.BillingAddress?.City || "").toString().toLowerCase();
    const search = searchText.toLowerCase();
    return (
      ((!showComplete || item.Complete) && clientNumber.includes(search)) ||
      id.includes(search) ||
      city.includes(search)
    );
  });

  const handleJobStatus = (bool) => {
    if (bool) {
      return "complete";
    } else {
      return "incomplete";
    }
  };*/
