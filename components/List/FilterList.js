/**************************************************************************************************************/
/* Author: Jalon Kimes                                                                                        */
/* This file fetched the data from the api and displays it in a list of card elements                         */
/**************************************************************************************************************/
import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Image } from "react-native";
import { Link, Stack } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";
import { COLORS, FONT, SIZES } from "../../constants";

/*Custom imports */
import Card from "../Cards/Card";
import { firebase } from "../../../csu-manager-2/config";

//initalizes firebase connection
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);



    const FilterList = ({ }) => {

        const [data, setData] = useState([]);
        const [sortBy, setSortBy] = useState("id");

        // lets you retrieve one document in this case one clients information from the db
        // const clientRef = firebase.firestore().collection("clients").doc('Jalon')
        const collectionRef = firebase.firestore().collection("clients")
        const [FilteredData, setFilteredData] = useState([])

        // useEffect(() => {
        //     async function fetchData() {
        //         await filterbyComplete(); // Wait for filterbyComplete to finish
        //         await getData(); // Then fetch the data
        //         await filterbyInComplete(); // wait for filterbyIncomplete

        //     }
        //     fetchData();
        // }, []);
        // useEffect(() => {
        //     console.log("Dataset here: ", FilteredData);
        // }, [FilteredData]);

        // async function getData() {
        //     const data = await collectionRef.get()
        //     const newData = data.docs.map((doc) => ({
        //         id: doc.id,
        //         ...doc.data(),
        //     }));
        //     setFilteredData(newData);

        // }



        // async function filterbyComplete() {
        //     const snapshot = await collectionRef.where('Complete', '==', true).get()
        //     if (snapshot.empty) {
        //         console.log('No matching results!');
        //     } else {
        //         const newData = snapshot.docs.map((doc) => ({
        //             id: doc.id,
        //             ...doc.data(),
        //         }));
        //         setFilteredData(newData)
        //         // snapshot.forEach(doc => {
        //         //     // console.log(doc.id, "=>", doc.data())
        //         // })
        //     }
        // }


        // function showFilteredData(data) {
        //     if (data.empty) {
        //         console.log('No matching results!');
        //     } else {
        //         setFilteredData(data)
        //         data.forEach(doc => {
        //             console.log(doc.id, "=>", doc.data())
        //         })
        //     }
        // }
        // // showFilteredData(FilteredData)

        // async function filterbyInComplete() {
        //     const data = await collectionRef.where('Complete', '==', false).get()
        //     const newData = data.docs.map((doc) => ({
        //         id: doc.id,
        //         ...doc.data(),
        //     }));
        //     setFilteredData(newData);
        // }


        // function makeCardList(filteredData) {
        //     filteredData.map((item) => {
        //         // console.log("Current data object:", data); // Log the current data object
        //         return (
        //             <View key={item.id} style={styles.contactBox}>
        //                 <View style={styles.contactBoxDetails}>
        //                     <View>
        //                         <Text style={styles.textStyleName}>{item.id}</Text>
        //                         <Text style={styles.textStyle}>{item.ClientNumber}</Text>
        //                         <Text> Job Status: {handleJobStatus(item.Complete)} </Text>
        //                     </View>
        //                 </View>
        //                 <Link
        //                     href={{
        //                         pathname: "/clients/[id]",
        //                         params: {
        //                             id: item.id,
        //                             Address: item.Address,
        //                             Email: item.Email,
        //                             PhoneNumer: item.PhoneNumber,
        //                             ClientNumer: item.ClientNumber,
        //                             Contracts: item.Contracts,
        //                             Quotes: item.Quotes,
        //                             Refferals: item.Refferals,
        //                             Complete: item.Complete,
        //                             BillAddress: item.BillingAddress,
        //                         },
        //                     }}
        //                     asChild
        //                 >
        //                     <Button title={"View Contact"}></Button>
        //                 </Link>
        //             </View>
        //         );
        //     })
        const [filterState, setFilterState] = useState('showAll');



        useEffect(() => {
            fetchData(); // Fetch initial data when component mounts
        }, []);

        useEffect(() => {
            filterData(); // Update filtered data whenever filterState changes
        }, [filterState]);

        const fetchData = async () => {
            // Fetch data from the database and store it in state
            const snapshot = await collectionRef.get()
            if (snapshot.empty) {
                console.log('No matching results!');
            } else {
                const newData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setData(newData);
            };


            const filterData = async () => {
                switch (filterState) {
                    case 'showAll':
                        // Fetch all data
                        const allData = await collectionRef.get()
                        if (allData.empty) {
                            console.log('No matching results!');
                        } else {
                            const newData = allData.docs.map((doc) => ({
                                id: doc.id,
                                ...doc.data(),
                            }));
                            setData(newData);
                        }
                        break;
                    case 'filterByComplete':
                        // Fetch data where 'complete' is true
                        const activeData = await collectionRef.where('Complete', '==', true).get()
                        if (activeData.empty) {
                            console.log('No matching results!');
                        } else {
                            const newData = activeData.docs.map((doc) => ({
                                id: doc.id,
                                ...doc.data(),
                            }));
                            setData(newData);
                        }
                        break;
                    case 'filterByIncomplete':
                        // Fetch data where 'complete' is false
                        const incompleteData = await collectionRef.where('Complete', '==', false).get()
                        if (incompleteData.empty) {
                            console.log('No matching results!');
                        } else {
                            const newData = incompleteData.docs.map((doc) => ({
                                id: doc.id,
                                ...doc.data(),
                            }));
                            setData(newData);
                        }
                        break;
                    default:
                        break;
                }
            };

            const renderCardList = () => {
                // Map over the data and render card components
                return data.map((item) => (
                    <Card key={item.id} data={item} />
                ));
            };

            return (
                <View>
                    <View>
                        <button onClick={() => setFilterState('showAll')}>Show All</button>
                        <button onClick={() => setFilterState('filterByComplete')}>Complete</button>
                        <button onClick={() => setFilterState('filterByIncomplete')}>Incomplete</button>
                    </View>
                    {makeCardList(FilteredData)}
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
        justifyContent: "center",
        paddingHorizontal: 16, // Adjust the horizontal padding as needed
        paddingTop: 0, // Adjust the top padding as needed
        paddingBottom: 100, // Add bottom padding as needed
        width: "100%",
        height: "100%",
        marginTop: SIZES.small,
        gap: SIZES.small,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // marginTop: SIZES.small,
    },
    headerTitle: {
        fontSize: SIZES.large,
        // fontFamily: FONT.medium,
        color: COLORS.primary,
    },
    headerBtn: {
        fontSize: SIZES.medium,
        // fontFamily: FONT.medium,
        color: COLORS.gray,
    },
    contactBox: {
        borderWidth: 1,
        borderColor: "#d1d1d1",
        backgroundColor: "white",
        borderRadius: 5,
        width: "100%",

        // marginTop: 5,
        // marginBottom: 5,
        // padding: 10,
    },
    contactBoxDetails: {
        flexDirection: "row",
    },
    textStyleName: {
        fontSize: 20,
    },
    textStyle: {
        fontSize: 18,
        color: "#000",
        fontWeight: "normal",
        marginVertical: 10,
    },
});

export default FilterList;
