import React, { createContext, useContext, useState, useEffect } from 'react';
import { firebase } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from 'firebase/auth';

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

  const value = {
    user, 
    loading, 
    signIn, 
    signOut,
    signUpWithEmailAndPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
