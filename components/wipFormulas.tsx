import { StyleSheet, Text, View } from "react-native";
import React from "react";

export const totalCost = (costToDate: number, costToComplete: number) => {
  const result: number = costToDate + costToComplete;
  //   console.log(`@@CTD ${costToDate} CTC: ${costToComplete} ${result}`);
  return result;
};
export const percentComplete = (costToDate: number, totalCost: number) => {
  if (costToDate === 0 || totalCost === 0) {
    return 0;
  } else {
    const percentage = costToDate / totalCost;

    const result = Number(percentage);
    // console.log(`CTD: ${costToDate} TC: ${totalCost} ${percentage}`);
    return percentage;
  }
};

export const grossProfit = (quotedPrice: number, totalCost: number) => {
  //   console.log(`Quoted: ${quotedPrice}, total cost: ${totalCost}`);
  const result: number = quotedPrice - totalCost;
  return result;
};

// result is slightly different from our records take a look at the formula
export const earnedProfit = (
  grossProfit: number,
  percentComplete: number
): number => {
  // console.log(`GrossP: ${grossProfit}, %:${percentComplete}`);
  const profit = grossProfit * percentComplete;
  return Number(profit.toFixed(2)); // Round the profit to two decimal places and convert to number
};

export const underBilled = (
  costToDate: number,
  earnedProfit: number,
  paidToDate: number
) => {
  // console.log(
  //   `CTD: ${costToDate}, Earned: ${earnedProfit}, Paid: ${paidToDate}`
  // );
  if (costToDate + earnedProfit - paidToDate >= 0) {
    const result = costToDate + earnedProfit - paidToDate;
    return parseFloat((costToDate + earnedProfit - paidToDate).toFixed(2));
  } else return 0;
};

export const overBilled = (
  paidToDate: number,
  costToDate: number,
  earnedProfit: number
) => {
  if (paidToDate - (costToDate + earnedProfit) >= 0) {
    return paidToDate - (costToDate + earnedProfit);
  } else return 0;
};

export const backlog = (
  quotedPrice: number,
  costToDate: number,
  earnedProfit: number
) => {
  return parseFloat((quotedPrice - (costToDate + earnedProfit)).toFixed(2));
};

export const futureGrossEarnings = (
  backlog: number,
  costToComplete: number
) => {
  const earnings = `${backlog - costToComplete}`;
  // console.log(`&*backlog ${backlog} CTC ${costToComplete} ${earnings}`);
  return Number(parseFloat(earnings).toFixed(2));
};

export const revenueYear = (
  revenuePriorYear: number,
  costToDate: number,
  earnedProfit: number
) => {
  const result: number = costToDate + earnedProfit - revenuePriorYear;
  return result;
};
export const costYear = (costPriorYear: number, costToDate: number) => {
  const result: number = costToDate - costPriorYear;
  return result;
};
