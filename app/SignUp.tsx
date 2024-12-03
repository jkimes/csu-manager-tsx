import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { firebase, firebaseConfig } from '../config';
import { Button } from '@rneui/themed';
import { useAuth } from "../components/ContextGetters/AuthContext"; // Import your auth context
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

type RootStackParamList = {
  Home: undefined;
  SignIn: undefined;
  SignUp: undefined;
};

type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

const SignUp = ({ navigation }: { navigation: SignUpScreenNavigationProp }) => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const { signUpWithEmailAndPassword } = useAuth(); // Get the signup function

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        // Fetch user role from Firestore after successful sign-up
        fetchUserRole(user.uid);
      } else {
        // User is signed out
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserRole = async (uid: string) => {
    try {
      const userDoc = await firebase.firestore().collection('Users').doc(uid).get();
      if (userDoc.exists) {
        // Set the user role in state
        setUserRole(userDoc.data()?.role);
      } else {
        console.log('User not found in Firestore');
      }
    } catch (error) {
      console.log('Error fetching user role:', error);
    }
  };

  const handleSignUpWithEmailAndPassword = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
  
    try {
      const userCredential = await signUpWithEmailAndPassword(email, password);
      if (!userCredential) {
        throw new Error('Sign up failed - no user credential returned');
      }
      
      const user = userCredential.user;
      if (!user) {
        throw new Error('No user after sign up');
      }
  
      const userData = {
        uid: user.uid,
        email: user.email,
        role: 'User'
      };

      // Add console.log to debug
      console.log('Attempting to save user data:');
      
      await firebase.firestore()
        .collection('Users')
        .doc(user.uid)
        .set(userData, { merge: true });  // Added merge option
      
      console.log('User data saved successfully');
      
      // Clear the form fields after successful signup
      setEmail('');
      setPassword('');
      setConfirmPassword('');
  
      navigation.navigate('Home');
    } catch (error) {
      console.error('Sign-up error:', error);
      alert('Failed to create user: ' + error);  // Added error alert
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      const userCredential = await firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
      const user = userCredential.user;

      // Store additional user data in Firestore
      const userData = {
        uid: user?.uid,
        email: user?.email,
        role: 'User' // Default role is 'User'
      };
      if (!user?.uid) throw new Error('User ID is required');
      await firebase.firestore().collection('Users').doc(user.uid).set(userData);

      navigation.navigate('Home');
    } catch (error) {
      console.error('Google Sign-in error:', error);
    }
  };

  const SwitchtoSignIn = async () => {
    
    navigation.navigate("SignIn")
  };

  const handleSignOut = () => {
    firebase.auth().signOut();
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
            containerStyle={{ marginLeft: -45, marginRight: 5 }}
            onPress={() => setShowPassword(!showPassword)}
          />
        </View>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Confirm Password"
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <Button
            type="clear"
            icon={{
              name: showPassword ? 'eye-off' : 'eye',
              type: 'ionicon',
              size: 24,
              color: '#888',
            }}
            containerStyle={{ marginLeft: -45, marginRight: 5 }}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        </View>
        <Button title="Sign Up" onPress={handleSignUpWithEmailAndPassword} />
      </View>
      {/* <View style={styles.googleButton}>
        <Button title="Sign Up with Google" onPress={handleSignInWithGoogle} />
      </View> */}
      <View style={styles.googleButton}>
            <Button title="Sign In" onPress={SwitchtoSignIn} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
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
  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleButton: {
    width: '80%',
  },
});

export default SignUp;
