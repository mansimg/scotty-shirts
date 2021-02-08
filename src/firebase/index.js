import firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBVntWOh4WCZVJIQKcaApBEwCCPnx8WS6M",
  authDomain: "ssui-hw-6-b7a65.firebaseapp.com",
  databaseURL: "https://ssui-hw-6-b7a65.firebaseio.com",
  projectId: "ssui-hw-6-b7a65",
  storageBucket: "ssui-hw-6-b7a65.appspot.com",
  messagingSenderId: "754951202782",
  appId: "1:754951202782:web:4a13ccc24bbeb62b145f4f",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
