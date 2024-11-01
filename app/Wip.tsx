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
import { WipContext } from "../components/ContextGetters/WipContext";
import { DisplayJobStatus, handleAddress } from "../components/Helpers/helperFunctions";
import FinanceSummary from "../components/List/BottomSheet/FinanceSummary";

function addCommasToNumber(number) {
  if (typeof number === "undefined") {
    return ""; // Or any default value you prefer
  }

  // Limit the number to 2 decimal places
  let numStr = parseFloat(number).toFixed(2);

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
  console.log(`Wip!: ${JSON.stringify(wipData)}`);

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
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
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
                            Quote Price
                          </Card.Title>
                          <Card.Divider />
                        </View>

                        <Text style={WipStyles.digits}>
                          ${addCommasToNumber(Number(item.quotedPrice))}
                        </Text>
                      </Card>

                      {/* <Divider orientation="vertical" /> */}
                      <Card containerStyle={WipStyles.priceCard}>
                        <Card.Title style={WipStyles.title}>
                          {" "}
                          Cost to Date
                        </Card.Title>
                        <Card.Divider />

                        <Text style={WipStyles.digits}>
                          {"$"}
                          {addCommasToNumber(item.CostToDate)}
                          {/* {console.log(`Cost To Date: ${item.CostToDate}`)} */}
                        </Text>
                      </Card>

                      {/* <Divider orientation="vertical" /> */}
                      <Card containerStyle={WipStyles.priceCard}>
                        <Card.Title style={WipStyles.title}>
                          AR To Date
                        </Card.Title>
                        <Card.Divider />
                        <Text style={WipStyles.digits}>
                          {"$"}
                          {addCommasToNumber(item.paidToDate)}
                          {/*  */}
                        </Text>
                      </Card>
                    </View>
                  </View>
                </View>

                <Button
                  title="Additional Details"
                  onPress={() => handleViewProfile(item)}
                />
              </Card>
            ))}
          </ScrollView>
        </ListItem.Accordion>
      </>
    );
  };

  return <View style={{ flex: 1 }}>{renderCardList()}</View>;
}
const styles = StyleSheet.create({
  scrollViewContent: {
    paddingBottom: 70,
  },
  // Add any other styles you need here
});
