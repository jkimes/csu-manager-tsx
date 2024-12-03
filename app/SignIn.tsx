import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { firebase, firebaseConfig } from '../config';
import { Button } from '@rneui/themed';
import { useAuth } from '../components/ContextGetters/AuthContext'; // Import your auth context
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const SignIn = ({ navigation }: { navigation: NativeStackNavigationProp<any> }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, googleSignIn, login, signOut } = useAuth();

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, navigate to Home screen
        navigation.navigate('Home');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignInWithEmailAndPassword = async () => {
    try {
      await signIn(email, password); // Changed to use signIn
      console.log("Sign-in successful");
      setEmail('');
      setPassword('');
      navigation.navigate('Home');
    } catch (error) {
      console.error("Sign in with E/P failed:", error);
    }
  };

  const handleSignUp = async () => {
    navigation.navigate('SignUp');
  };

  const handleSignOut = async () => {
    try {
      await firebase.auth().signOut();
      signOut(); // Explicitly update auth context
      console.log("Sign-out successful"); // Debug log
    } catch (error) {
      console.error("Sign-out failed:", error);
    }
  };

  const handleForgotPassword = async () => {
    try {
      if (!email.trim()) {
        alert('Please enter your email address');
        return;
      }
      await firebase.auth().sendPasswordResetEmail(email);
      alert('Password reset email sent! Please check your inbox.');
    } catch (error) {
      console.error("Password reset failed:", error);
      alert('Failed to send password reset email. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Password"
            onChangeText={setPassword}
            value={password}
            secureTextEntry={!showPassword}
          />
          <Button
            type="clear"
            icon={{
              name: showPassword ? 'eye-off' : 'eye',
              type: 'ionicon',
              size: 24,
              color: '#888',
            }}
            onPress={() => setShowPassword(!showPassword)}
            containerStyle={{ marginLeft: -45, marginRight: 5 }}
          />
        </View>
        <Button title="Sign In" onPress={handleSignInWithEmailAndPassword} />
        <Button
          type="clear"
          title="Forgot Password?"
          onPress={handleForgotPassword}
          titleStyle={{ color: '#888', fontSize: 14 }}
          containerStyle={{ marginTop: 5, marginBottom: 5 }}
        />
      </View>
      <View style={styles.googleButton}>
        <Button title="Sign Up" onPress={handleSignUp} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    width: '80%',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  googleButton: {
    width: '80%',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
});

export default SignIn;
