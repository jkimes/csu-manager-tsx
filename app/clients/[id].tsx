import React, { useState } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { Stack, useLocalSearchParams, Tabs } from "expo-router";
import { ClientParams } from "../../components/List/CardList"; // Import your interface for client parameters

const SingleClient = () => {
  const {
    id,
    ClientName,
    ClientNumber,
    ClientPhone,
    ClientEmail,
    StreetName,
    City,
    Zip,
    Active,
    Contacts,
    JobStreet,
    JobCity,
    Quotes,
    filteredData,
  } = useLocalSearchParams();

  type quoteTypes = string | Map<string, lineTypes>;
  type lineTypes = string | number;
  const [activeTab, setActiveTab] = useState<string>("tab1"); // State to manage the active tab

  const tabContent = {
    Quotes: (
      <View>
        <Text style={styles.tabText}>Content for Tab 1</Text>
        {/* Add any additional content for Tab 1 */}
      </View>
    ),
    Invoices: (
      <View>
        <Text style={styles.tabText}>Content for Tab 2</Text>
        {/* Add any additional content for Tab 2 */}
      </View>
    ),
  };

  const handleActive = (bool: boolean) => {
    return bool ? "Active" : "Inactive";
  };

  const handleJobSite = (street: string) => {
    return street ? `${JobStreet}, ${JobCity}` : "No address found";
  };

  console.log("Inside ID Quote: ", ClientName); // Ensure Quotes is logged with the expected nested map structure
  return (
    <View>
      <Stack.Screen options={{ title: `${ClientName}'s Profile` }} />
      <Text>Client - {ClientName}</Text>
      <Text>
        Address - {StreetName}, {City}
      </Text>
      <Text>Email - {ClientEmail}</Text>
      <Text>Number - {ClientPhone}</Text>
      <Text>Client # - {ClientNumber}</Text>
      <Text>Job Status - {handleActive(Active)}</Text>
      <Text>Job Site: {handleJobSite(JobStreet)}</Text>

      {/* Container for buttons to switch tabs */}
      <View style={styles.buttonContainer}>
        <Button
          title="Quotes"
          onPress={() => setActiveTab("Quotes")}
          color={activeTab === "tab1" ? "blue" : "gray"} // Change button color based on active tab
        />
        <Button
          title="Invoices"
          onPress={() => setActiveTab("Invoices")}
          color={activeTab === "tab2" ? "blue" : "gray"} // Change button color based on active tab
        />
      </View>

      {/* Container for tabs with custom styles */}
      <View style={styles.tabContainer}>
        {/* Tabs with custom styles */}
        <Tabs
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          tabs={[
            { key: "tab1", title: "Quotes" },
            { key: "tab2", title: "Invoices" },
          ]}
        />

        {/* Conditional rendering based on active tab */}
        {tabContent[activeTab]}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row", // Align buttons horizontally
    justifyContent: "space-evenly", // Space buttons evenly horizontally
    backgroundColor: "gray",
    marginTop: 10,
  },
  tabContainer: {
    backgroundColor: "black", // Set background color to black
    height: "100%",
  },
  tabText: {
    color: "white", // Set text color to white
  },
});

export default SingleClient;

// type SearchParamType = {
//   id: number;
//   description: string;
//   age: number;
//   name: string;
// };

// const Home = () => {
//     const { id, description, age, name } = useLocalSearchParams<SearchParamType>();

//     return <></>
// }
