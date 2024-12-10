import React, { createContext, useContext, useState, useEffect } from 'react';
import { firebase } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      setUser(user as User | null);
      setLoading(false);
      if (user) {
        await AsyncStorage.setItem('user', JSON.stringify(user));
      } else {
        await AsyncStorage.removeItem('user');
      }
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      console.log('Sign in was successful');
    } catch (error) {
      throw error;
    }
  };

  const signUpWithEmailAndPassword = async (email: string, password: string) => {
    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      return userCredential;
    } catch (error) {
      console.error("Error in signUpWithEmailAndPassword:", error);
      throw error;
    }
  };

  const googleSignIn = async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebase.auth().signOut();
      setUser(null);  // This ensures all user data is cleared
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const deleteUser = async (uid: string) => {
    console.log(`UID: ${uid}`);
    try {
      const functions = getFunctions();
      const deleteUserFunction = httpsCallable(functions, 'deleteUser');
      await deleteUserFunction({ uid }); // Call the cloud function to delete the user
      console.log('User deleted successfully from Firebase Authentication');
    } catch (error) {
      console.error('Error deleting user from Firebase Authentication:', error);
      throw error; // Rethrow the error to handle it in the calling function
    }
  };

  const value = {
    user, 
    loading, 
    signIn, 
    signOut,
    signUpWithEmailAndPassword,
    deleteUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
