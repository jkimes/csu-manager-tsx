import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Redirect } from "expo-router";
import { Register } from "../components/Register/Register";

const index = () => {
  return (
    <View>
      <Text>index</Text>
      <Redirect href="/clientpage" />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
