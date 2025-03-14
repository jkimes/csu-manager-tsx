import React, { useState, useEffect, useContext } from "react";
import { View, Text, ScrollView } from "react-native";
import { ThemeProvider, useTheme, Card, ListItem } from "@rneui/themed";
import { CustomerExpContext } from "../../ContextGetters/CustomerExpContext";
import { cardlistStyles } from "../styles/cardlist.styles";
import ExpenseList from "../ExpenseList/ExpenseList";
import firebase from "firebase/app";

const VendorPaymentsList = ({ navigation, route, vendorNum }) => {
  const { theme } = useTheme();
  const data = useContext(CustomerExpContext);
  const [groupedData, setGroupedData] = useState({});
  const [hasData, setHasData] = useState(false);
  const [expandedCustomer, setExpandedCustomer] = useState(null);

  useEffect(() => {
    const filterAndGroupData = () => {
      const filtered = data.filter(item => item.VendorNumber === vendorNum);
      
      // First group the data
      const grouped = filtered.reduce((acc, item) => {
        const { CustomerNum, ReExpense, PayAmount, Date } = item;

        // Initialize the group if it doesn't exist
        if (!acc[CustomerNum]) {
          acc[CustomerNum] = { 
            expenses: [], 
            totalPayAmount: 0,
            mostRecentDate: null
          };
        }

        // Add the item to the group
        acc[CustomerNum].expenses.push(item);

        // Update most recent date
        const currentDate = Date?.toDate?.() || new Date(Date);
        if (!acc[CustomerNum].mostRecentDate || currentDate > acc[CustomerNum].mostRecentDate) {
          acc[CustomerNum].mostRecentDate = currentDate;
        }

        // Sum PayAmount as positive value if ReExpense is "N" or "n"
        if (ReExpense === "N" || ReExpense === "n") {
          acc[CustomerNum].totalPayAmount += Math.abs(PayAmount);
        }

        return acc;
      }, {});

      // Convert to array and sort by CustomerNum
      const sortedGrouped = Object.entries(grouped)
        .sort(([a], [b]) => Number(a) - Number(b))  // Sort by CustomerNum numerically
        .reduce((acc, [customerNum, data]) => {
          acc[customerNum] = data;
          return acc;
        }, {});

      setGroupedData(sortedGrouped);
      setHasData(Object.keys(sortedGrouped).length > 0);
    };

    filterAndGroupData();
  }, [data, vendorNum]);

  // Function to refresh data after deletion
  const refreshData = async () => {
    const snapshot = await firebase.firestore().collection('expenses').get();
    const expenses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Update the context or state with the new expenses
    // Assuming you have a context or state to update
  };

  // Utility function to format numbers with commas and decimals
  const formatCurrency = (amount) => {
    return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Log whenever groupedData updates to confirm it's set correctly
  useEffect(() => {
    //console.log("Updated Grouped Data: ", JSON.stringify(groupedData));
  }, [groupedData]);

  return (
    <ThemeProvider theme={theme}>
      <View style={{ backgroundColor: "white" }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
          {hasData ? (
            Object.entries(groupedData).map(([customerNum, group]) => (
              <ListItem.Accordion
                key={customerNum}
                isExpanded={expandedCustomer === customerNum}
                onPress={() =>
                  setExpandedCustomer(expandedCustomer === customerNum ? null : customerNum)
                }
                content={
                  <ListItem.Content>
                    <ListItem.Title>CustomerNum: {customerNum}</ListItem.Title>
                    <ListItem.Subtitle>
                      Total PayAmount: ${formatCurrency(group.totalPayAmount)}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                }
              >
                {expandedCustomer === customerNum && (
                  <ExpenseList 
                    navigation={navigation} 
                    route={route} 
                    data={group.expenses} 
                    refreshData={refreshData}
                  />
                )}
              </ListItem.Accordion>
            ))
          ) : (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Text style={cardlistStyles.noDataText}>No Expenses Found</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </ThemeProvider>
  );
};


export default VendorPaymentsList;
