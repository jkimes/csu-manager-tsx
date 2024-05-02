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
  // console.log(`#Finance Summary Wip Data# ${wipData}`);

  const costToComplete: number = wipData?.costToComplete;
  console.log(`FINANCE Summary CTC: ${costToComplete}`);
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
    if (typeof number === "undefined") {
      return ""; // Or any default value you prefer
    }
    // Convert the number to a string
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
          <ListItem.Title>Est Total Cost:</ListItem.Title>
          <ListItem.Subtitle>{"$" + addCommasToNumber(tc)}</ListItem.Subtitle>
        </ListItem>

        <ListItem>
          <ListItem.Title>Cost to Complete:</ListItem.Title>
          <ListItem.Subtitle>
            {"$" + addCommasToNumber(costToComplete)}
          </ListItem.Subtitle>
        </ListItem>

        <ListItem>
          <ListItem.Title>% Complete:</ListItem.Title>
          <ListItem.Subtitle>{perComplete}%</ListItem.Subtitle>
        </ListItem>

        <ListItem>
          <ListItem.Title>Gross Profit:</ListItem.Title>
          <ListItem.Subtitle>${addCommasToNumber(gProfit)}</ListItem.Subtitle>
        </ListItem>

        <ListItem>
          <ListItem.Title>Future Gross Earnings:</ListItem.Title>
          <ListItem.Subtitle>
            ${addCommasToNumber(fgEarnings)}
          </ListItem.Subtitle>
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
