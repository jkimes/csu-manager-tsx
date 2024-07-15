import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Platform, ScrollView } from "react-native";
import { clientpageStyles } from "./styles/clientpage.styles";

// Custom imports I made
import CardList from "../components/List/CardList";
import SearchBar from "../components/SearchBar/SearchBar";
import { ThemeProvider, useTheme, Card, Button, FAB } from "@rneui/themed";

export default function Clientpage({ route, navigation }) {
  const [userInput, setUserInput] = useState<string>("");
  const { theme, updateTheme } = useTheme();
  const [visible, setVisible] = React.useState(true);
  const placeholderText = "Search by Name, Customer #, or Address";

  return (
    <ThemeProvider theme={theme}>
      <View style={clientpageStyles.container}>
        {/* <Card.Divider /> */}
        <SearchBar
          userInput={userInput}
          setUserInput={setUserInput}
          placeholderText={placeholderText}
        />

        <View style={clientpageStyles.listContainer}>
          <ScrollView
            contentContainerStyle={clientpageStyles.scrollViewContent}
          >
            <CardList
              navigation={navigation}
              route={route}
              searchText={userInput}
            />
          </ScrollView>
        </View>
      </View>
    </ThemeProvider>
  );
}
