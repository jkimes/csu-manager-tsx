import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC7NScPQtDe3Tgh9VcnOT0e6DeNL_XtV_s",
  authDomain: "clients-7be32.firebaseapp.com",
  databaseURL: "https://clients-7be32-default-rtdb.firebaseio.com",
  projectId: "clients-7be32",
  storageBucket: "clients-7be32.appspot.com",
  messagingSenderId: "273559061003",
  appId: "1:273559061003:web:cb3112e6b527b6f678bd0e",
  measurementId: "G-8DDH2XWLLD",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase, firebaseConfig };
