import firebase from "firebase/app";
import "firebase/storage";
import "firebase/database";
import "firebase/auth";

var firebaseConfig = {
  /*
  
    FIREBASE CONFIG
 
 */
};

const secondaryApp = firebase.initializeApp(firebaseConfig, "Secondary");
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase, secondaryApp };
