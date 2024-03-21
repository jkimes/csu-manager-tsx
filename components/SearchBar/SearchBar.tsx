/**************************************************************************************************************/
/* Author: Jalon Kimes                                                                                        */
/* This the Search Bar Component for filtering responses from Card List Data from Db                          */
/**************************************************************************************************************/

import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";

const SearchBar = ({ userInput, setUserInput }) => {
  const handleSearchInputChange = (text) => {
    setUserInput(text);
  };

  return (
    <View style={styles.container}>
      <Feather
        name="search"
        size={24}
        color="black"
        style={{ margin: 5, marginLeft: 2 }}
      />
      <TextInput
        style={styles.SearchBar}
        placeholder="Search Client #, ID , or Address(Street/City)"
        value={userInput}
        onChangeText={handleSearchInputChange}
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 5,
    backgroundColor: "gray",
  },

  SearchBar: {
    height: 40,
    borderWidth: 4,
    borderColor: "gray",
    borderRadius: 6,
    // padding: 100,
    // marginBottom: 10, // Adjust the margin bottom
    width: "100%", // Make the input fill the widt
  },
  modButtons: {
    flexDirection: "row",
    padding: 10,
  },
});
