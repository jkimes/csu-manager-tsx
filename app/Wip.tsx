import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import {
  ThemeProvider,
  useTheme,
  Card,
  Button,
  ListItem,
  Icon,
  BottomSheet,
  Divider,
} from "@rneui/themed";

// custom imports
import { WipStyles } from "./styles/Wip.styles";
import { WipContext } from "../components/WipContext";
import { DisplayJobStatus, handleAddress } from "../components/helperFunctions";
import FinanceSummary from "../components/List/BottomSheet/FinanceSummary";

function addCommasToNumber(number: number) {
  // Convert the number to a string
  console.log(`WIP add , to Num: ${number}`);
  let numStr = number.toString();

  // Split the number into integer and decimal parts, if any
  let parts = numStr.split(".");
  let integerPart = parts[0];
  let decimalPart = parts.length > 1 ? "." + parts[1] : "";

  // Add commas to the integer part
  let integerWithCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Combine the integer and decimal parts
  return integerWithCommas + decimalPart;
}

export default function WIP() {
  const wipData = useContext(WipContext);
  const [isVisible, setIsVisible] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    // console.log("selectedItem has changed:", selectedItem);
  }, [selectedItem]);

  const handleViewProfile = (item) => {
    // console.log(`ITEM: ${item}`);
    setIsVisible(!isVisible); // Show the bottom sheet
    setSelectedItem(item); // Set the selected item
  };
  // console.log(`Wip!: ${JSON.stringify(wipData)}`);

  const renderCardList = () => {
    return (
      <>
        <FinanceSummary
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          wipData={selectedItem}
        ></FinanceSummary>

        {/* <BottomSheet
          modalProps={{}}
          isVisible={isVisible}
          onBackdropPress={() => setIsVisible(!isVisible)}
        >
          <Text> Finance Summary</Text>
        </BottomSheet> */}

        <ListItem.Accordion
          content={
            <>
              {/* <Icon name="place" size={30} /> */}
              <ListItem.Content>
                <ListItem.Title>WIP</ListItem.Title>
              </ListItem.Content>
            </>
          }
          isExpanded={expanded}
          onPress={() => {
            setExpanded(!expanded);
          }}
        >
          <ScrollView>
            {/* Populates items to display on WIP Cards */}
            {wipData.map((item) => (
              <Card
                key={item.id}
                containerStyle={{ borderRadius: 4, padding: 10 }}
              >
                {/* <View key={item.id} style={styles.contactBox}> */}
                <View>
                  <View style={WipStyles.pageView}>
                    <Card.FeaturedTitle style={WipStyles.featuredTitle}>
                      {item.name}
                    </Card.FeaturedTitle>

                    <Card.FeaturedSubtitle style={WipStyles.featuredSubtitle}>
                      Client#: {item.clientNumber}
                    </Card.FeaturedSubtitle>

                    <View
                      style={{
                        flexDirection: "row",
                        alignContent: "center",
                        marginBottom: 5,
                        // justifyContent: "space-between",
                        // marginHorizontal: 0, // Adjust margin to reduce space between cards
                      }}
                    >
                      {/* <Divider orientation="vertical" /> */}
                      <Card containerStyle={WipStyles.priceCard}>
                        <View style={WipStyles.TitleView}>
                          <Card.Title style={WipStyles.title}>
                            {" "}
                            Quoted Price
                          </Card.Title>
                          <Card.Divider />
                        </View>

                        <Text style={WipStyles.digits}>
                          ${Number(item.quotedPrice)}
                        </Text>
                      </Card>

                      {/* <Divider orientation="vertical" /> */}
                      <Card containerStyle={WipStyles.priceCard}>
                        <Card.Title style={WipStyles.title}>
                          {" "}
                          Expenses
                        </Card.Title>
                        <Card.Divider />

                        <Text style={WipStyles.digits}>
                          {"$"}
                          {item.costToDate}
                        </Text>
                      </Card>

                      {/* <Divider orientation="vertical" /> */}
                      <Card containerStyle={WipStyles.priceCard}>
                        <Card.Title style={WipStyles.title}>
                          Paid To Date
                        </Card.Title>
                        <Card.Divider />
                        <Text style={WipStyles.digits}>
                          {"$"}
                          {item.paidToDate}
                          {/*  */}
                        </Text>
                      </Card>
                    </View>
                  </View>
                </View>

                <Button
                  title="View Profile"
                  onPress={() => handleViewProfile(item)}
                />
              </Card>
            ))}
          </ScrollView>
        </ListItem.Accordion>
      </>
    );
  };

  return <View>{renderCardList()}</View>;
}
