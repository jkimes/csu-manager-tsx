import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Redirect } from 'expo-router';

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