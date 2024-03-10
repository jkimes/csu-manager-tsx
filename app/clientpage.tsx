import React, { useState } from "react";
import { View, Text, StyleSheet, Platform, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Button, lightColors, createTheme, ThemeProvider } from "@rneui/themed";
import { Feather } from "@expo/vector-icons";

// Custom imports I made
import CardList from "../components/List/CardList";
import SearchBar from "../components/SearchBar/SearchBar";

/*This is the theme provider that controls the styles of the whole app hopefully */
const theme = createTheme({
  // lightColors: {
  //   ...Platform.select({
  //     default: lightColors.platform.android,
  //     ios: lightColors.platform.ios,
  //   }),
  // },
  components: {
    Button: {
      titleStyle: {
        color: "orange",
      },
    },
  },
});

export default function clientpage() {
  const [userInput, setUserInput] = useState("");
  const [showComplete, setShowComplete] = useState(false);

  //sets showComplete value to bool value that is being passed by the button in modContainer comp passes true incomp passes false
  const handleFilter = (bool: boolean) => {
    setShowComplete(bool);
  };

  return (
    <ThemeProvider theme={theme}>
      <Button size="lg" color="secondary" />
      <View style={styles.container}>
        <SearchBar userInput={userInput} setUserInput={setUserInput} />
        <View style={styles.listContainer}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <CardList searchText={userInput} showComplete={showComplete} />
          </ScrollView>
        </View>
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingTop: 10,
  },
  listContainer: {
    flex: 1,
    paddingTop: 10,
  },
  SearchBar: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    width: "100%",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
});
