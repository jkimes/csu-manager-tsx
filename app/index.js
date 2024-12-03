import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Redirect } from 'expo-router';
// import { AppRegistry } from 'react-native';
// import App from './App';
// import { name as appName } from './app.json';

// AppRegistry.registerComponent(appName, () => App);

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