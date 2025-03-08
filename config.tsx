import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css'; // Import the CSS for styling

const firebaseConfig = {
  apiKey: "AIzaSyCgMn_pZXz6f6Q8aTcjsKS9V7fHFy1I3VI",
  authDomain: "clients-7be32.firebaseapp.com",
  databaseURL: "https://clients-7be32-default-rtdb.firebaseio.com",
  projectId: "clients-7be32",
  storageBucket: "clients-7be32.appspot.com",
  messagingSenderId: "273559061003",
  appId: "1:273559061003:web:cb3112e6b527b6f678bd0e",
  measurementId: "G-8DDH2XWLLD",
};
//
// Original API Key: AIzaSyC7NScPQtDe3Tgh9VcnOT0e6DeNL_XtV_s
// // Configure FirebaseUI
// var uiConfig = {
//   signInSuccessUrl: '/', // Redirect after successful sign-in
//   signInOptions: [
//     // Array of sign-in providers
//     firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//     // ... (Other providers if you have them enabled)
//   ],
//   // ... (Other FirebaseUI configuration options)
// };

// // Initialize FirebaseUI
// var ui = new firebaseui.auth.AuthUI(firebase.auth());
// ui.start('#firebaseui-auth-container', uiConfig);

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase, firebaseConfig };
