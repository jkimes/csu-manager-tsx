import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Platform, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
// import { Button, lightColors, createTheme, ThemeProvider } from "@rneui/themed";
import { Feather } from "@expo/vector-icons";

// Custom imports I made
import CardList from "../components/List/CardList";
import SearchBar from "../components/SearchBar/SearchBar";
import { DataContext } from "../components/DataContext";
import { ThemeProvider, useTheme, Card, Button, FAB } from "@rneui/themed";

/*This is the theme provider that controls the styles of the whole app hopefully */
// const theme = createTheme({
//   // lightColors: {
//   //   ...Platform.select({
//   //     default: lightColors.platform.android,
//   //     ios: lightColors.platform.ios,
//   //   }),
//   // },
//   mode: 'dark',
//   components: {
//     Button: {
//       titleStyle: {
//         color: "orange",
//       },
//     },
//   },
// });

export default function Clientpage({ route, navigation }) {
  const [userInput, setUserInput] = useState<string>("");
  const { theme, updateTheme } = useTheme();
  const [visible, setVisible] = React.useState(true);

  return (
    <ThemeProvider theme={theme}>
      <View style={styles.container}>
        {/* <Card.Divider /> */}
        <SearchBar userInput={userInput} setUserInput={setUserInput} />
        <Card.Divider />
        <View style={styles.listContainer}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <CardList
              navigation={navigation}
              route={route}
              searchText={userInput}
            />
          </ScrollView>
        </View>

        <FAB
          visible={visible}
          icon={{ name: "add", color: "white" }}
          color="teal"
          title={"Add"}
          onPress={() => navigation.navigate("AddClient")}
        />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingTop: 0,
  },
  listContainer: {
    flex: 1,
    paddingTop: 5,
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
