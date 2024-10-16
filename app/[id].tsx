import React, { useState, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  Platform,
  Linking,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Card, Button, Tab, TabView, ListItem, Icon, FAB } from "@rneui/themed";

// custom imports
import Delete from "../components/Buttons/Delete";
import Edit from "../components/Buttons/Edit";
import QuoteList from "../components/List/QuoteList";
import { Client, LineItem } from "../App";
import { DataContext } from "../components/DataContext";
import Payments from "../components/List/Payments"
import {
  makePhoneCall,
  sendEmail,
  DisplayJobStatus,
  handleAddress,
  handlePhone,
  handleEmail,
  handleName,
} from "../components/helperFunctions";
import { idStyles } from "./styles/[id].styles";

export default function SingleClient({ route, navigation }) {
  const data = useContext(DataContext);
  // const quotes = useContext(QuoteContext);
  const [activeTab, setActiveTab] = React.useState<number>(0); // State to manage the active tab
  const { ClientNumber, ClientEmail, ClientPhone, ClientName } = route.params;
  const client: Client = data.find((item) => item.CustomerNum === ClientNumber);
  console.log(`CLIENT ID: ${client.id}`);
  // Log the values of the route params to the console
  // console.log("ClientName:", ClientName);
  // console.log("ClientEmail:", ClientEmail);

  // Check if any of the required params are undefined
  if (
    ClientNumber === undefined ||
    ClientEmail === undefined ||
    ClientPhone === undefined ||
    ClientName === undefined
  ) {
    console.error("One or more route params are missing or undefined");
    return (
      <Text>Error: One or more route params are missing or undefined</Text>
    );
  }

  const [index, setIndex] = React.useState(0); // for tab component
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const tabContent = {
    0: (
      <View style={{ flex: 1 }}>
        <ScrollView>
          <ListItem.Accordion
            content={
              <>
                {/* <Icon name="place" size={30} /> */}
                <ListItem.Content>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <ListItem.Title
                      style={[idStyles.cardTitle, { marginRight: 10 }]}
                    >
                      <Card.Title>Client Name</Card.Title>
                    </ListItem.Title>
                    <ListItem.Subtitle>
                      <Text>{handleName(client.ClientName)}</Text>
                    </ListItem.Subtitle>
                  </View>
                </ListItem.Content>
              </>
            }
            isExpanded={expandedIndex === 0}
            onPress={() => {
              setExpandedIndex(expandedIndex === 0 ? null : 0);
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Edit
                id={String(client.CustomerNum)}
                field={"ClientName"}
                collection="clients"
              />
              <Delete
                id={String(client.CustomerNum)}
                field={"ClientName"}
                collection="clients"
              />
            </View>
          </ListItem.Accordion>

          <Card.Divider></Card.Divider>

          <ListItem.Accordion
            content={
              <>
                {/* <Icon name="place" size={30} /> */}
                <ListItem.Content>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <ListItem.Title
                      style={[idStyles.cardTitle, { marginRight: 10 }]}
                    >
                      <Card.Title>Customer Name</Card.Title>
                    </ListItem.Title>
                    <ListItem.Subtitle>
                      <Text>{client.CustomerName}</Text>
                    </ListItem.Subtitle>
                  </View>
                </ListItem.Content>
              </>
            }
            isExpanded={expandedIndex === 1}
            onPress={() => {
              setExpandedIndex(expandedIndex === 1 ? null : 1);
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Edit
                id={String(client.CustomerNum)}
                field={"CustomerName"}
                collection="clients"
              />
              <Delete
                id={String(client.CustomerNum)}
                field={"CustomerName"}
                collection="clients"
              />
            </View>
          </ListItem.Accordion>

          <Card.Divider></Card.Divider>
          <ListItem.Accordion
            content={
              <>
                {/* <Icon name="place" size={30} /> */}
                <ListItem.Content>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <ListItem.Title
                      style={[idStyles.cardTitle, { marginRight: 10 }]}
                    >
                      <Card.Title style={idStyles.cardTitle}>
                        Job Status
                      </Card.Title>
                    </ListItem.Title>
                    <View
                      style={{
                        flexDirection: "row",
                        alignContent: "space-between",
                      }}
                    >
                      <Text>{client.JobStatus}</Text>
                    </View>
                  </View>
                </ListItem.Content>
              </>
            }
            isExpanded={expandedIndex === 3}
            onPress={() => {
              setExpandedIndex(expandedIndex === 3 ? null : 3);
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Edit id={String(client.CustomerNum)} field={"JobStatus"} />
            </View>
          </ListItem.Accordion>

          <Card.Divider></Card.Divider>

          <ListItem.Accordion
            content={
              <>
                {/* <Icon name="place" size={30} /> */}
                <ListItem.Content>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <ListItem.Title
                      style={[idStyles.cardTitle, { marginRight: 10 }]}
                    >
                      <Card.Title style={idStyles.cardTitle}>
                        Client #{" "}
                      </Card.Title>
                    </ListItem.Title>

                    <View
                      style={{
                        flexDirection: "row",
                        alignContent: "space-between",
                      }}
                    >
                      <Text>{client.CustomerNum}</Text>
                    </View>
                  </View>
                </ListItem.Content>
              </>
            }
            isExpanded={expandedIndex === 4}
            onPress={() => {
              setExpandedIndex(expandedIndex === 4 ? null : 4);
            }}
          >
            <View style={{ flexDirection: "row" }}>
              {/* <Edit
                id={String(client.id)}
                field={"CustomerNum"}
                collection="clients"
              />
              <Delete
                id={String(client.id)}
                field={"CustomerNum"}
                collection="clients"
              /> */}
            </View>
          </ListItem.Accordion>

          <Card.Divider />

          <ListItem.Accordion
            content={
              <>
                {/* <Icon name="place" size={30} /> */}
                <ListItem.Content>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <ListItem.Title
                      style={[idStyles.cardTitle, { marginRight: 10 }]}
                    >
                      <Card.Title style={idStyles.cardTitle}>Email</Card.Title>
                    </ListItem.Title>
                    <View
                      style={{
                        flexDirection: "row",
                        alignContent: "space-between",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => sendEmail(client.ClientEmail.toString())}
                      >
                        <Text>{handleEmail(client.ClientEmail)}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ListItem.Content>
              </>
            }
            isExpanded={expandedIndex === 5}
            onPress={() => {
              setExpandedIndex(expandedIndex === 5 ? null : 5);
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Edit
                id={String(client.CustomerNum)}
                field={"ClientEmail"}
                collection="clients"
              />
              <Delete
                id={String(client.CustomerNum)}
                field={"ClientEmail"}
                collection="clients"
              />
            </View>
          </ListItem.Accordion>

          <Card.Divider></Card.Divider>

          <ListItem.Accordion
            content={
              <>
                {/* <Icon name="place" size={30} /> */}
                <ListItem.Content>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <ListItem.Title
                      style={[idStyles.cardTitle, { marginRight: 10 }]}
                    >
                      <Card.Title style={idStyles.cardTitle}>Phone</Card.Title>
                    </ListItem.Title>
                    <View
                      style={{
                        flexDirection: "row",
                        alignContent: "space-between",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => makePhoneCall(client.ClientCell)}
                      >
                        <Text>{handlePhone(client.ClientCell)}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ListItem.Content>
              </>
            }
            isExpanded={expandedIndex === 6}
            onPress={() => {
              setExpandedIndex(expandedIndex === 6 ? null : 6);
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Edit
                id={String(client.CustomerNum)}
                field={"ClientCell"}
                collection="clients"
              />
              <Delete
                id={String(client.CustomerNum)}
                field={"ClientCell"}
                collection="clients"
              />
            </View>
          </ListItem.Accordion>

          <Card.Divider></Card.Divider>
          <ListItem.Accordion
            content={
              <>
                {/* <Icon name="place" size={30} /> */}
                <ListItem.Content>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <ListItem.Title
                      style={[idStyles.cardTitle, { marginRight: 10 }]}
                    >
                      <Card.Title style={idStyles.cardTitle}>Phone 2</Card.Title>
                    </ListItem.Title>
                    <View
                      style={{
                        flexDirection: "row",
                        alignContent: "space-between",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => makePhoneCall(client.ClientTel2)}
                      >
                        <Text>{handlePhone(client.ClientTel2)}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ListItem.Content>
              </>
            }
            isExpanded={expandedIndex === 6}
            onPress={() => {
              setExpandedIndex(expandedIndex === 6 ? null : 6);
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Edit
                id={String(client.CustomerNum)}
                field={"ClientTel2"}
                collection="clients"
              />
              <Delete
                id={String(client.CustomerNum)}
                field={"ClientTel2"}
                collection="clients"
              />
            </View>
          </ListItem.Accordion>

          <Card.Divider></Card.Divider>

          <ListItem.Accordion
            content={
              <>
                {/* <Icon name="place" size={30} /> */}
                <ListItem.Content>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <ListItem.Title
                      style={[idStyles.cardTitle, { marginRight: 10 }]}
                    >
                      <Card.Title style={idStyles.cardTitle}>
                        Job Site {}
                      </Card.Title>
                    </ListItem.Title>
                    <View
                      style={{
                        flexDirection: "row",
                        alignContent: "space-between",
                      }}
                    >
                      <TouchableOpacity>
                        <Text>{handleAddress(client.JobSite)}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ListItem.Content>
              </>
            }
            isExpanded={expandedIndex === 7}
            onPress={() => {
              setExpandedIndex(expandedIndex === 7 ? null : 7);
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Edit
                id={String(client.CustomerNum)}
                field={"JobSite"}
                collection="clients"
              />
              <Delete
                id={String(client.CustomerNum)}
                field={"JobSite"}
                collection="clients"
              />
            </View>
          </ListItem.Accordion>
          <Card.Divider></Card.Divider>
          <ListItem.Accordion
              content={
                <>
                  {/* <Icon name="place" size={30} /> */}
                  <ListItem.Content>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <ListItem.Title style={[{ marginRight: 10 }]}>
                        <Card.Title>Contact Name</Card.Title>
                      </ListItem.Title>
                      <ListItem.Subtitle>
                        <Text>{handleName(client.Contact)}</Text>
                      </ListItem.Subtitle>
                    </View>
                  </ListItem.Content>
                </>
              }
              isExpanded={expandedIndex === 8}
              onPress={() => {
                setExpandedIndex(expandedIndex === 8 ? null : 8);
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Edit id={client.CustomerNum} field={"name"} />
                <Delete id={client.CustomerNum} field={"Contact"} />
              </View>
            </ListItem.Accordion>

            <Card.Divider />

            <ListItem.Accordion
              content={
                <>
                  {/* <Icon name="place" size={30} /> */}
                  <ListItem.Content>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <ListItem.Title style={[{ marginRight: 10 }]}>
                        <Card.Title>Contact Email</Card.Title>
                      </ListItem.Title>
                      <ListItem.Subtitle>
                        <TouchableOpacity
                          onPress={() => sendEmail(client?.ContactEmail)}
                        >
                          <Text>{handleEmail(client?.ContactEmail)}</Text>
                        </TouchableOpacity>
                      </ListItem.Subtitle>
                    </View>
                  </ListItem.Content>
                </>
              }
              isExpanded={expandedIndex === 9}
              onPress={() => {
                setExpandedIndex(expandedIndex === 9 ? null : 9);
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Edit id={client.CustomerNum} field={"ContactEmail"} />
                <Delete id={client.CustomerNum} field={"ContactEmail"} />
              </View>
            </ListItem.Accordion>

            <Card.Divider />

            <ListItem.Accordion
              content={
                <>
                  {/* <Icon name="place" size={30} /> */}
                  <ListItem.Content>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <ListItem.Title style={[{ marginRight: 10 }]}>
                        <Card.Title>Contact Phone</Card.Title>
                      </ListItem.Title>
                      <ListItem.Subtitle>
                        <TouchableOpacity
                          onPress={() => makePhoneCall(client?.ContactCell)}
                        >
                          <Text>{handlePhone(client?.ContactCell)}</Text>
                        </TouchableOpacity>
                      </ListItem.Subtitle>
                    </View>
                  </ListItem.Content>
                </>
              }
              isExpanded={expandedIndex === 10}
              onPress={() => {
                setExpandedIndex(expandedIndex === 10 ? null : 10);
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Edit id={client.CustomerNum} field={"ContactCell"} />
                <Delete id={client.CustomerNum} field={"ContactCell"} />
              </View>
            </ListItem.Accordion>

            <Card.Divider />
            <ListItem.Accordion
              content={
                <>
                  {/* <Icon name="place" size={30} /> */}
                  <ListItem.Content>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <ListItem.Title style={[{ marginRight: 10 }]}>
                        <Card.Title>Contact Phone 2</Card.Title>
                      </ListItem.Title>
                      <ListItem.Subtitle>
                        <TouchableOpacity
                          onPress={() => makePhoneCall(client?.ContactTel2)}
                        >
                          <Text>{handlePhone(client?.ContactTel2)}</Text>
                        </TouchableOpacity>
                      </ListItem.Subtitle>
                    </View>
                  </ListItem.Content>
                </>
              }
              isExpanded={expandedIndex === 10}
              onPress={() => {
                setExpandedIndex(expandedIndex === 10 ? null : 10);
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Edit id={client.CustomerNum} field={"ContactTel2"} />
                <Delete id={client.CustomerNum} field={"ContactTel2"} />
              </View>
            </ListItem.Accordion>

            <Card.Divider />

            <ListItem.Accordion
              content={
                <>
                  {/* <Icon name="place" size={30} /> */}
                  <ListItem.Content>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <ListItem.Title style={[{ marginRight: 10 }]}>
                        <Card.Title>Billing Address</Card.Title>
                      </ListItem.Title>
                      <ListItem.Subtitle style={{ flex: 1, flexWrap: "wrap" }}>
                        <Text>{handleAddress(client.BillingAddress)}</Text>
                      </ListItem.Subtitle>
                    </View>
                  </ListItem.Content>
                </>
              }
              isExpanded={expandedIndex === 11}
              onPress={() => {
                setExpandedIndex(expandedIndex === 11 ? null : 11);
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Edit id={client.CustomerNum} field={"BillingAddress"} />
                <Delete id={client.CustomerNum} field={"BillingAddress"} />
              </View>
            </ListItem.Accordion>
        </ScrollView>
      </View>
    ),
    1: (
      <View style={{ flex: 1 }}>
        <Card containerStyle={idStyles.cardContainer}>
          <Card.Title style={idStyles.cardTitle}>
            <Text>Quote List</Text>
          </Card.Title>
        </Card>

        <QuoteList
          navigation={navigation}
          route={route}
          ClientNumber={client.CustomerNum}
        ></QuoteList>

        <FAB
          visible={true}
          icon={{ name: "add", color: "white" }}
          color="orange"
          title={"Add"}
          onPress={() =>
            navigation.navigate("AddQuote", {
              ClientNumber: client.CustomerNum,
            })
          }
        />

        {/* Add any additional content for Tab 2 */}
      </View>
    ),
    2: (
      <View>
         <Card.Title style={idStyles.cardTitle}>
            <Text>Last Payment</Text>
          </Card.Title>
          <Payments navigation={navigation} route={route} clientNumber={client.CustomerNum}/> 

          
        
      </View>
    ),
  };

  return (
    <View>
      <Tab value={activeTab} onChange={setActiveTab} dense>
        <Tab.Item>Client info</Tab.Item>
        <Tab.Item>Quote/Docs</Tab.Item>
        <Tab.Item>Payment Info  </Tab.Item>
      </Tab>

      {/* Container for tabs with custom styles */}
      <View style={idStyles.tabContainer}>
        {/* Tabs with custom styles */}

        {/* Conditional rendering based on active tab */}
        {tabContent[activeTab]}
      </View>
    </View>
  );
}
