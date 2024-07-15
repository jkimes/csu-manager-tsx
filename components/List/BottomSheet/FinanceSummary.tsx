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

  const tc = totalCost(wipData?.CostToDate, wipData?.costToComplete);
  console.log(`Total Cost: ${tc}`);

  const perComplete: number = Number(
    (percentComplete(wipData?.CostToDate, tc) * 100).toFixed(2)
  );
  console.log(`Percentage Complete: ${perComplete}`);

  const gProfit: number = grossProfit(wipData?.quotedPrice, tc);
  console.log(`Gross Profit: ${gProfit}`);
  const eProfit: number = earnedProfit(gProfit, perComplete / 100);
  const uBilled: number = underBilled(
    wipData?.CostToDate,
    eProfit,
    wipData?.paidToDate
  );
  const oBilled: number = overBilled(
    wipData?.paidToDate,
    wipData?.CostToDate,
    eProfit
  );
  const blog: number = backlog(
    wipData?.quotedPrice,
    wipData?.CostToDate,
    eProfit
  );
  const fgEarnings: number = futureGrossEarnings(blog, wipData?.costToComplete);

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
