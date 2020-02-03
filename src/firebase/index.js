import firebase from "firebase/app";
import "firebase/storage";
import "firebase/database";
import "firebase/auth";

var firebaseConfig = {
  apiKey: "AIzaSyByyX1eUf6zDjDBCJA0DN-7K2xDtWq43R4",
  authDomain: "dyuthi-bd052.firebaseapp.com",
  databaseURL: "https://dyuthi-bd052.firebaseio.com",
  projectId: "dyuthi-bd052",
  storageBucket: "dyuthi-bd052.appspot.com",
  messagingSenderId: "173809148500",
  appId: "1:173809148500:web:1321954016c2f2cc32c3c1",
  measurementId: "G-8TYM87Y5V3"
};

// var firebaseConfig = {
//   apiKey: "AIzaSyBDIZaaWCpYrjJFdy-IXGzKgHD9C8Nh_ZI",
//   authDomain: "dyuthierp.firebaseapp.com",
//   databaseURL: "https://dyuthierp.firebaseio.com",
//   projectId: "dyuthierp",
//   storageBucket: "dyuthierp.appspot.com",
//   messagingSenderId: "799799573144",
//   appId: "1:799799573144:web:f1ecafc6ead307a902eeed",
//   measurementId: "G-SPRV8QNX7F"
// };

const secondaryApp = firebase.initializeApp(firebaseConfig, "Secondary");
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

const storage = firebase.storage();

export { storage, firebase, secondaryApp };
