import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen'; // Import your HomeScreen component
import SignIn from './SignIn';
import SignUp from './SignUp';
import  Settings  from './Settings';
import ClientUploader from '../components/Uploaders/ClientUploader';
import CusExpenseUploader from '../components/Uploaders/CusExpenseUploader';
import PaymentUploader from '../components/Uploaders/PaymentUploader';
import VendorUploader from '../components/Uploaders/VendorUploader';
import WipUploader from '../components/Uploaders/WipUploader';
import SingleClient from './[id]';
import VendorProfile from './[vendor]';
import AddClient from './AddClient';
import AddQuote from './AddQuote';
import Clientpage from './clientpage';
import selectDB from './selectDB';
import Vendors from './Vendors';
import Wip from './Wip';
import { ParamListBase } from '@react-navigation/native';
import { Button, createTheme, Icon } from '@rneui/themed';
import { useAuth } from '../components/ContextGetters/AuthContext';

// Add type definition for route params
type RootStackParamList = ParamListBase & {
  Profile: {
    params: {
      ClientNumber: string;
      ClientEmail: string;
      ClientPhone: string;
      ClientName: string;
    };
  };
};

// Update SingleClient component type
type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const SingleClient: React.FC<ProfileScreenProps> = ({ route, navigation }) => {
  // ... component code
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const theme = createTheme({
    lightColors: {
      primary: "black",
      secondary: "black",
    },
    darkColors: {
      primary: "black",
    },
    components: {
      Button: {
        raised: false,
        color: "primary",
        titleStyle: { color: "white" },
      },
      Tab: {
        variant: "default",
        titleStyle: { color: "black" },
        indicatorStyle: { backgroundColor: "blue" },
      },
      CardDivider: {
        color: "black",
        width: 1,
        style: { marginBottom: 5 },
      },
    },
  });
  // Create a separate component for the header right button
  const HeaderRight = ({ route, navigation }: { route: any; navigation: any }) => {
    const { user } = useAuth();
    const isAuthScreen = route.name === 'SignIn' || route.name === 'SignUp';
  
    if (isAuthScreen || !user) {
      return null;
    }
  
    return (
      <Button
        onPress={() => navigation.navigate("Home")}
        icon={
          <Icon
            name="home"
            type="font-awesome"
            size={28}
            color="white"
          />
        }
        iconPosition="left"
      />
    );
  };

const Navigation = () => {
  return (
    <NavigationContainer>
                      <Stack.Navigator
                        screenOptions={({ route, navigation }) => ({
                          headerStyle: {
                            backgroundColor: theme?.lightColors?.secondary,
                          },
                          headerTintColor: "white",
                          headerRight: () => {
                            if (route.name === 'SignIn' || route.name === 'SignUp') {
                              return null;
                            }
                            return <HeaderRight route={route} navigation={navigation} />;
                          },
                        })}
                      >
                        {/* Auth Screens */}
                        <Stack.Screen 
                          name="SignIn" 
                          component={SignIn}
                          options={{ headerShown: true, title: "Sign In" }}
                        />
                        <Stack.Screen 
                          name="SignUp" 
                          component={SignUp}
                          options={{ headerShown: true, title: "Sign Up" }}
                        />
                        
                        {/* Protected Screens */}
                        <Stack.Screen 
                          name="Home" 
                          component={HomeScreen}
                        />
                        
                        <Stack.Screen name="Clients" component={Clientpage} />
                        <Stack.Screen name="Profile" component={SingleClient} />
                        <Stack.Screen name="AddClient" component={AddClient} />
                        <Stack.Screen name="AddQuote" component={AddQuote} />
                        <Stack.Screen name="Vendors" component={Vendors} />
                        <Stack.Screen name="VendorProfile" component={VendorProfile} />
                        <Stack.Screen name="WIP" component={Wip} />
                        <Stack.Screen name="Client Upload" component={ClientUploader} />
                        <Stack.Screen name="Vendor Upload" component={VendorUploader} />
                        <Stack.Screen name="Wip Upload" component={WipUploader} />
                        <Stack.Screen name="Payment Upload" component={PaymentUploader} />
                        <Stack.Screen name="Expense Upload" component={CusExpenseUploader} />
                        <Stack.Screen name="SelectDB" component={selectDB} />
                        <Stack.Screen name="Settings" component={Settings} />
                      </Stack.Navigator>
                    </NavigationContainer>
  );
};

export default Navigation;
