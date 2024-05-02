/**************************************************************************************************************/
/* Author: Jalon Kimes                                                                                        */
/* This the Search Bar Component for filtering responses from Card List Data from Db                          */
/**************************************************************************************************************/

import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { searchstyles } from "./search.styles";

const SearchBar = ({ userInput, setUserInput }) => {
  const handleSearchInputChange = (text) => {
    setUserInput(text);
  };

  return (
    <View style={searchstyles.container}>
      <Feather
        name="search"
        size={24}
        color="black"
        style={{ margin: 5, marginLeft: 2 }}
      />
      <TextInput
        style={searchstyles.SearchBar}
        placeholderTextColor="black"
        placeholder="Search Client #, Name , or Address(Street/City)"
        value={userInput}
        onChangeText={handleSearchInputChange}
      />
    </View>
  );
};

export default SearchBar;
