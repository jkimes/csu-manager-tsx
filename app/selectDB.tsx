import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Platform, ScrollView } from "react-native";
import { clientpageStyles } from "./styles/clientpage.styles";

// Custom imports I made
import CardList from "../components/List/CardList";
import SearchBar from "../components/SearchBar/SearchBar";
import { ThemeProvider, useTheme, Card, Button, FAB } from "@rneui/themed";

const SelectDB: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const [userInput, setUserInput] = useState<string>("");
  const { theme, updateTheme } = useTheme();
  const [visible, setVisible] = React.useState(true);

  const navigateToClientUpload = () => {
    navigation.navigate("Client Upload");
  };
  const navigateToWipUpload = () => {
    navigation.navigate("Wip Upload");
  };
  const navigateToVendorUpload = () => {
    navigation.navigate("Vendor Upload");
  };

  return (
    <ThemeProvider theme={theme}>
      <View style={clientpageStyles.container}>
        {/* <Card.Divider /> */}

        <View style={clientpageStyles.listContainer}>
          <ScrollView
            contentContainerStyle={clientpageStyles.scrollViewContent}
          >
            <Button title="Wip" onPress={navigateToWipUpload} />
            <Button title="Clients" onPress={navigateToClientUpload} />
            <Button title="Vendors" onPress={navigateToVendorUpload} />
          </ScrollView>
        </View>
      </View>
    </ThemeProvider>
  );
};

export default SelectDB;
