import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { BottomSheet, Card, Divider, ListItem } from "@rneui/themed";
import {
  backlog,
  earnedProfit,
  futureGrossEarnings,
  grossProfit,
  overBilled,
  percentComplete,
  totalCost,
  underBilled,
} from "../../wipFormulas";

export default function FinanceSummary({ wipData, isVisible, setIsVisible }) {
  console.log(`#Wip Data# ${wipData}`);

  const tc = totalCost(wipData?.costToDate, wipData?.costToComplete);
  const perComplete: number = Number(
    (percentComplete(wipData?.costToDate, tc) * 100).toFixed(2)
  );
  const gProfit: number = grossProfit(wipData?.quotedPrice, tc);
  const eProfit: number = earnedProfit(gProfit, perComplete / 100);
  const uBilled: number = underBilled(
    wipData?.costToDate,
    eProfit,
    wipData?.paidToDate
  );
  const oBilled: number = overBilled(
    wipData?.paidToDate,
    wipData?.costToDate,
    eProfit
  );
  const blog: number = backlog(
    wipData?.quotedPrice,
    wipData?.costToDate,
    eProfit
  );
  const fgEarnings: number = futureGrossEarnings(blog, wipData?.costToComplete);
  function addCommasToNumber(number) {
    // Convert the number to a string
    let numStr = number.toString();

    // Split the number into integer and decimal parts, if any
    let parts = numStr.split(".");
    let integerPart = parts[0];

    // Parse the integer part to a number and keep the decimal part
    let integerNumber = parseInt(integerPart, 10);
    let decimalPart = parts.length > 1 ? parseFloat("." + parts[1]) : 0;

    // Combine the integer and decimal parts with commas
    let formattedNumber = integerNumber.toLocaleString("en-US", {
      maximumFractionDigits: 2, // Maximum number of decimal places
      minimumFractionDigits: 0, // Minimum number of decimal places
    });

    // Combine the integer and decimal parts and return as a number
    return parseFloat(formattedNumber + decimalPart);
  }

  return (
    <BottomSheet
      isVisible={isVisible}
      onBackdropPress={() => setIsVisible(false)}
    >
      <View style={styles.bottomSheetContent}>
        <ListItem>
          <ListItem.Title>Wip Summary: </ListItem.Title>
          <ListItem.Subtitle> {wipData?.name}</ListItem.Subtitle>
        </ListItem>

        <ListItem>
          <ListItem.Title>Est Cost to Date:</ListItem.Title>
          <ListItem.Subtitle>{tc}</ListItem.Subtitle>
        </ListItem>

        <ListItem>
          <ListItem.Title>% Complete:</ListItem.Title>
          <ListItem.Subtitle>{perComplete}%</ListItem.Subtitle>
        </ListItem>

        <ListItem>
          <ListItem.Title>Gross Profit:</ListItem.Title>
          <ListItem.Subtitle>${gProfit}</ListItem.Subtitle>
        </ListItem>

        <ListItem>
          <ListItem.Title>Earned Profit:</ListItem.Title>
          <ListItem.Subtitle>${eProfit}</ListItem.Subtitle>
        </ListItem>

        <ListItem>
          <ListItem.Title>Under Billed:</ListItem.Title>
          <ListItem.Subtitle>${uBilled}</ListItem.Subtitle>
        </ListItem>

        <ListItem>
          <ListItem.Title>Over Billed:</ListItem.Title>
          <ListItem.Subtitle>${oBilled}</ListItem.Subtitle>
        </ListItem>

        <ListItem>
          <ListItem.Title>Backlog:</ListItem.Title>
          <ListItem.Subtitle>${blog}</ListItem.Subtitle>
        </ListItem>

        <ListItem>
          <ListItem.Title>Future Gross Earnings:</ListItem.Title>
          <ListItem.Subtitle>${fgEarnings}</ListItem.Subtitle>
        </ListItem>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  bottomSheetContent: {
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
  },
});
