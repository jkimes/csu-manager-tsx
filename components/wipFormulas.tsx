import { StyleSheet, Text, View } from "react-native";
import React from "react";

export const totalCost = (CostToDate: number, costToComplete: number) => {
  const result: number = CostToDate + costToComplete;
  console.log(
    `WIP Formulas CTD ${CostToDate} CTC: ${costToComplete} TC:${result}`
  );
  return result;
};
export const percentComplete = (CostToDate: number, totalCost: number) => {
  if (CostToDate === 0 || totalCost === 0) {
    return 0;
  } else {
    const percentage = CostToDate / totalCost;

    const result = Number(percentage);
    // console.log(`CTD: ${CostToDate} TC: ${totalCost} ${percentage}`);
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
  CostToDate: number,
  earnedProfit: number,
  paidToDate: number
) => {
  // console.log(
  //   `CTD: ${CostToDate}, Earned: ${earnedProfit}, Paid: ${paidToDate}`
  // );
  if (CostToDate + earnedProfit - paidToDate >= 0) {
    const result = CostToDate + earnedProfit - paidToDate;
    return parseFloat((CostToDate + earnedProfit - paidToDate).toFixed(2));
  } else return 0;
};

export const overBilled = (
  paidToDate: number,
  CostToDate: number,
  earnedProfit: number
) => {
  if (paidToDate - (CostToDate + earnedProfit) >= 0) {
    return paidToDate - (CostToDate + earnedProfit);
  } else return 0;
};

export const backlog = (
  quotedPrice: number,
  CostToDate: number,
  earnedProfit: number
) => {
  return parseFloat((quotedPrice - (CostToDate + earnedProfit)).toFixed(2));
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
  CostToDate: number,
  earnedProfit: number
) => {
  const result: number = CostToDate + earnedProfit - revenuePriorYear;
  return result;
};
export const costYear = (costPriorYear: number, CostToDate: number) => {
  const result: number = CostToDate - costPriorYear;
  return result;
};
