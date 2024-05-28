import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { VendorPageStyles } from "./styles/VendorPage.styles";
import VendorList from "../components/List/VendorList";
import SearchBar from "../components/SearchBar/SearchBar";
import { ThemeProvider, useTheme, Card, Button, FAB } from "@rneui/themed";

export default function Vendors({ route, navigation }) {
  const [userInput, setUserInput] = useState<string>("");
  const { theme, updateTheme } = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <View>
        <Text>VendorPage</Text>
        <SearchBar userInput={userInput} setUserInput={setUserInput} />
        <ScrollView contentContainerStyle={VendorPageStyles.scrollViewContent}>
          <VendorList
            navigation={navigation}
            route={route}
            searchText={userInput}
          />
        </ScrollView>
      </View>
    </ThemeProvider>
  );
}
