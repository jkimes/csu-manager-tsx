/**************************************************************************************************************/
/* Author: Jalon Kimes                                                                                        */
/* This the Search Bar Component for filtering responses from Card List Data from Db                          */
/**************************************************************************************************************/

import { View, Text, TextInput, StyleSheet } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';

const SearchBar = ({ userInput, setUserInput }) => {
    const handleSearchInputChange = (text) => {
        setUserInput(text);
    };

    return (
        <View style={styles.container}>
            <Feather name="search" size={24} color="black" style={{ marginLeft: 1, marginRight: 4 }} />
            <TextInput
                style={styles.searchBar}
                placeholder="Search by client number or ID"
                value={userInput}
                onChangeText={handleSearchInputChange}
            />
        </View>
    )
}

export default SearchBar

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        padding: 10,

    },
    searchContainer: {
        borderWidth: 5,
        borderColor: 'Black',
        borderRadius: 6,
        padding: 10,
        alignItems: "center",
    },
    SearchBar: {
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 6,
        // padding: 100,
        // marginBottom: 10, // Adjust the margin bottom
        width: '100%', // Make the input fill the widt

    },
    modButtons: {
        flexDirection: "row",
        padding: 10,

    }
});
