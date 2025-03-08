import React, { useState, useEffect } from "react";
import { View, Text, Image } from "react-native";
import { Button, Card } from "@rneui/themed";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { firebase } from "../config";
import { useAuth } from "../components/ContextGetters/AuthContext";

type RootStackParamList = {
  Home: undefined;
  WIP: undefined;
  Clients: undefined;
  Vendors: undefined;
  Settings: undefined;
  SelectDB: undefined;
};

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const userRef = firebase.firestore().collection("Users").doc(user.uid);
      userRef.get()
        .then((doc) => {
          if (doc.exists) {
            setUserRole(doc.data()?.role);
          }
        })
        .catch((error) => console.error("Error fetching user role:", error));
    }
  }, [user]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "flex-start", backgroundColor: "white" }}>
      <Text style={{ fontWeight: "bold", alignSelf: "center" }}>CSU Manager</Text>
      <Image
        style={{ alignSelf: "center", height: 100, width: 100 }}
        source={require("../assets/icons/CSU.png")}
      />
      <Card.Divider style={{ width: "100%" }} />
      <View style={{ flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "flex-start", paddingHorizontal: 20, width: "100%" }}>
        {[
          ...(userRole !== "Basic" ? [
            { title: "WIP", route: "WIP" as keyof RootStackParamList },
            { title: "Clients", route: "Clients" as keyof RootStackParamList },
            { title: "Vendors", route: "Vendors" as keyof RootStackParamList },
          ] : []),
          { title: "Settings", route: "Settings" as keyof RootStackParamList },
          ...(userRole === "Admin" || userRole === "Manager" 
            ? [{ title: "CSV Upload - Admin Only", route: "SelectDB" as keyof RootStackParamList, special: true }] 
            : [])
        ].map((btn) => (
          <Button
            key={btn.route}
            title={btn.title}
            onPress={() => navigation.navigate(btn.route)}
            buttonStyle={{
              width: 300,
              height: 50,
              marginVertical: 10,
              backgroundColor: btn.special ? "gray" : "black",
              justifyContent: "center",
              alignItems: "center",
            }}
            titleStyle={{
              alignSelf: "center",
              ...(btn.special ? { fontSize: 9 } : {}),
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default HomeScreen; 