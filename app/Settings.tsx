'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ListItem, Button } from '@rneui/themed';
import SelectDropdown from 'react-native-select-dropdown';
import { Table, Row, Rows } from 'react-native-table-component';
import { firebase } from '../config'; // Assuming you have Firebase config
import { getAuth } from 'firebase/auth'; // Import Firebase Auth

import { useAuth } from '../components/ContextGetters/AuthContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'User' |'Basic';
}

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  SignIn: undefined;
  // Add other screens here
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function Settings() {
  const navigation = useNavigation<NavigationProp>();
  const { user, signOut, deleteUser } = useAuth();
  const [userRole, setUserRole] = useState<string | undefined>(undefined);
  const [users, setUsers] = useState<User[]>([]);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [signUpRequests, setSignUpRequests] = useState<any[]>([]); // State for sign-up requests

  console.log('Auth context:', { user, signOut });
  console.log('Is user authenticated?:', !!user);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user?.uid) {
        try {
          const userDoc = await firebase.firestore()
            .collection('Users')
            .doc(user.uid)
            .get();
          
          if (userDoc.exists) {
            const userData = userDoc.data();
            console.log('User document data:', userData);
            setUserRole(userData?.role);
          } else {
            console.warn('No user document found');
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }
    };

    fetchUserRole();
  }, [user?.uid]);

  useEffect(() => {
    fetchUsers();
    fetchSignUpRequests(); // Fetch sign-up requests
  }, []);

  const fetchUsers = async () => {
    try {
      const snapshot = await firebase.firestore().collection('Users').get();
      const userData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      console.log('Fetched users:', userData);
      setUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'Failed to fetch users');
    }
  };

  const fetchSignUpRequests = async () => {
    try {
      const snapshot = await firebase.firestore().collection('SignUpRequests').where('status', '==', 'pending').get();
      const requestsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSignUpRequests(requestsData);
    } catch (error) {
      console.error('Error fetching sign-up requests:', error);
      Alert.alert('Error', 'Failed to fetch sign-up requests');
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'Admin' | 'Manager' | 'User' | 'Basic') => {
    try {
      // Count number of admin users
      const adminCount = users.filter(user => user.role === 'Admin').length;
      
      // Check if trying to change the last admin
      const isLastAdmin = adminCount === 1 && 
                         users.find(u => u.id === userId)?.role === 'Admin' && 
                         newRole !== 'Admin';
      
      if (isLastAdmin) {
        Alert.alert(
          'Error',
          'Cannot change the last admin role. Please assign another admin first.'
        );
        // Force refresh of users to reset the dropdown
        setUsers(prevUsers => [...prevUsers]);
        return;
      }

      // Only proceed with update if not the last admin
      await firebase.firestore().collection('Users').doc(userId).update({
        role: newRole
      });
      
      // Only update local state if the update was successful and not the last admin
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

    } catch (error) {
      console.error('Error updating user role:', error);
      Alert.alert('Error', 'Failed to update user role');
      // Force refresh of users to reset the dropdown on error
      setUsers(prevUsers => [...prevUsers]);
    }
  };

  // Commented out the delete user function
  /*
  const handleDeleteUser = async (userId: string) => {
    const userToDelete = users.find(u => u.id === userId);
    const currentUser = firebase.auth().currentUser; // Get the currently signed-in user

    if (userToDelete) {
      // Check if the user to delete is the currently signed-in user
      if (userToDelete.id === currentUser?.uid) {
        Alert.alert(
          'Error',
          'You cannot delete your own account. Please contact another admin for assistance.',
          [{ text: 'OK' }]
        );
        return; // Exit the function if trying to delete self
      }

      Alert.alert(
        'Confirm Delete',
        `Are you sure you want to delete ${userToDelete.email}? This action cannot be undone.`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: async () => {
              try {
                // Check if the current user is an admin
                const currentUserDoc = await firebase.firestore().collection('Users').doc(currentUser?.uid).get();
                if (currentUserDoc.exists && currentUserDoc.data()?.role === 'Admin') {
                  // Delete the user document from Firestore
                  await firebase.firestore().collection('Users').doc(userId).delete();
                  Alert.alert('Success', 'User document deleted successfully.');
                } else {
                  Alert.alert('Error', 'You do not have permission to delete users.');
                }
              } catch (error) {
                console.error('Error deleting user document:', error);
                Alert.alert('Error', 'Failed to delete user document');
              }
            },
          },
        ],
        { cancelable: false }
      );
    }
  };
  */

  // Commented out the sign-up request features
  /*
  const handleSignUpRequest = async (requestData) => {
    try {
      // Your sign-up request logic here
      console.log('Sign-up request data:', requestData);
      // You can add Firestore logic to save the request
    } catch (error) {
      console.error('Error handling sign-up request:', error);
      Alert.alert('Error', 'Failed to handle sign-up request');
    }
  };
  */

  const toggleAccordion = (section: string) => {
    setExpanded(expanded === section ? false : section);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigation.navigate('Home');
      // The navigation should be handled in the AuthContext
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  const handleApproveRequest = async (requestId: string, email: string) => {
    try {
      // Create the user in Firebase Authentication
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, 'defaultPassword'); // Use a default password or generate one
      const user = userCredential.user;

      // Store additional user data in Firestore
      await firebase.firestore().collection('Users').doc(user.uid).set({
        uid: user.uid,
        email: user.email,
        role: 'User' // Default role is 'User'
      });

      // Update the request status to approved
      await firebase.firestore().collection('SignUpRequests').doc(requestId).update({ status: 'approved' });

      Alert.alert('Success', 'User approved successfully.');
      fetchSignUpRequests(); // Refresh requests
    } catch (error) {
      console.error('Error approving request:', error);
      Alert.alert('Error', 'Failed to approve user request');
    }
  };

  const handleDenyRequest = async (requestId: string) => {
    try {
      // Update the request status to denied
      await firebase.firestore().collection('SignUpRequests').doc(requestId).update({ status: 'denied' });

      Alert.alert('Success', 'User request denied successfully.');
      fetchSignUpRequests(); // Refresh requests
    } catch (error) {
      console.error('Error denying request:', error);
      Alert.alert('Error', 'Failed to deny user request');
    }
  };

  console.log('Current user role:', user?.role);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      {/* User indicator with proper navigation */}
      <View style={styles.userIndicator}>
        {user ? (
          <Text style={styles.userIndicatorText}>Signed in as: {user.email}</Text>
        ) : (
          <Button
            title="Sign In"
            onPress={() => navigation.navigate('SignIn')}
            buttonStyle={styles.signInButton}
          />
        )}
      </View>

      {/* {userRole?.toLowerCase() === 'admin' && (
        <View>
          <Text style={styles.requestTitle}>Sign-Up Requests</Text>
          {signUpRequests.length > 0 ? (
            signUpRequests.map(request => (
              <View key={request.id} style={styles.requestContainer}>
                <Text>{request.email}</Text>
                <View style={styles.requestButtons}>
                  <Button title="Approve" onPress={() => handleApproveRequest(request.id, request.email)} />
                  <Button title="Deny" onPress={() => handleDenyRequest(request.id)} />
                </View>
              </View>
            ))
          ) : (
            <Text>No pending requests.</Text>
          )}
        </View>
      )} */}

      {userRole?.toLowerCase() === 'admin' && (
        <ListItem.Accordion
          content={
            <ListItem.Content>
              <ListItem.Title>Users</ListItem.Title>
            </ListItem.Content>
          }
          isExpanded={expanded === 'users'}
          onPress={() => toggleAccordion('users')}
        >
          <View style={styles.columnLabels}>
            <Text style={styles.columnLabel}>User</Text>
            <Text style={styles.columnLabel}>Role</Text>
          </View>
          {users.map(user => (
            <ListItem key={user.id} containerStyle={styles.listItemContainer}>
              <ListItem.Content>
                <View style={styles.userRow}>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.email}</Text>
                  </View>
                  <SelectDropdown
                    data={['Admin', 'Manager', 'User', 'Basic',]}
                    defaultValue={user.role}
                    value={user.role}
                    key={user.id + user.role}
                    onSelect={(selectedItem) => {
                      if (selectedItem === 'Delete User') {
                        // handleDeleteUser(user.id);
                      } else {
                        handleRoleChange(user.id, selectedItem as 'Admin' | 'Manager' | 'User' | 'Basic');
                      }
                    }}
                    renderButton={(selectedItem, isOpened) => (
                      <View style={styles.dropdownButtonContainer}>
                        <Text style={styles.dropdownButtonText}>
                          {user.role}
                        </Text>
                      </View>
                    )}
                    renderItem={(item, index, isSelected) => (
                      <View style={[styles.dropdownItem, isSelected && styles.selectedDropdownItem]}>
                        <Text style={styles.dropdownItemText}>{item}</Text>
                      </View>
                    )}
                    dropdownStyle={styles.dropdown}
                  />
                </View>
              </ListItem.Content>
            </ListItem>
          ))}
        </ListItem.Accordion>
      )}
      {user && (
        <Button 
          onPress={handleSignOut}
          title="Sign Out"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    backgroundColor: '#e0e0e0',
    borderRadius: 16,
  },
  userName: {
    marginLeft: 12,
    fontSize: 14,
  },
  dropdownButtonContainer: {
    width: 120,
    height: 30,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#333',
  },
  dropdown: {
    backgroundColor: '#fafafa',
    borderRadius: 5,
  },
  dropdownItem: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  selectedDropdownItem: {
    backgroundColor: '#e0e0e0',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333',
  },
  columnLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  columnLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textDecorationLine: 'underline', // Underline the column titles

  },
  listItemContainer: {
    backgroundColor: 'white', // Match accordion background color
  },
  signOutButton: {
    marginTop: 20,
    backgroundColor: '#ff4444',
  },
  userIndicator: {
    marginBottom: 16,
  },
  userIndicatorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  signInButton: {
    backgroundColor: 'black',
  },
  requestTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  requestContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  requestButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
