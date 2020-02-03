// // import firebase from "firebase/app";
// // import "firebase/auth";
// // // import 'firebase/firestore' // <- needed if using firestore
// // import "firebase/functions"; // <- needed if using httpsCallable
// // import { createStore, combineReducers, compose } from "redux";
// // import {
// //   ReactReduxFirebaseProvider,
// //   firebaseReducer
// // } from "react-redux-firebase";
// // // import { createFirestoreInstance, firestoreReducer } from 'redux-firestore' // <- needed if using firestore

// // const fbConfig = {
// //   apiKey: "AIzaSyByyX1eUf6zDjDBCJA0DN-7K2xDtWq43R4",
// //   authDomain: "dyuthi-bd052.firebaseapp.com",
// //   databaseURL: "https://dyuthi-bd052.firebaseio.com",
// //   projectId: "dyuthi-bd052",
// //   storageBucket: "dyuthi-bd052.appspot.com",
// //   messagingSenderId: "173809148500",
// //   appId: "1:173809148500:web:1321954016c2f2cc32c3c1",
// //   measurementId: "G-8TYM87Y5V3"
// // };

// // // react-redux-firebase config
// // const rrfConfig = {
// //   userProfile: "users"
// //   // useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
// //   // enableClaims: true // Get custom claims along with the profile
// // };

// // // Initialize firebase instance
// // firebase.initializeApp(fbConfig);

// // // Initialize other services on firebase instance
// // // firebase.firestore() // <- needed if using firestore
// // // firebase.functions() // <- needed if using httpsCallable

// // // Add firebase to reducers
// // const rootReducer = combineReducers({
// //   firebase: firebaseReducer
// //   // firestore: firestoreReducer // <- needed if using firestore
// // });

// // // Create store with reducers and initial state
// // const initialState = {};
// // const store = createStore(rootReducer, initialState);

// // const rrfProps = {
// //   firebase,
// //   config: rrfConfig,
// //   dispatch: store.dispatch
// //   // createFirestoreInstance // <- needed if using firestore
// // };

// // export default store;

// import { createStore, combineReducers, compose } from "redux";
// import { reactReduxFirebase, firebaseReducer } from "react-redux-firebase";
// import firebase from "firebase/app";
// import "firebase/auth";
// import "firebase/database";
// // import "firebase/firestore"; // <- needed if using firestore
// // import 'firebase/functions' // <- needed if using httpsCallable
// // import { reduxFirestore, firestoreReducer } from "redux-firestore"; // <- needed if using firestore
// // import notifyReducer from "./reducers/notifyReducer";
// // import settingsReducer from "./reducers/settingsReducer";

// const firebaseConfig = {
//   apiKey: "AIzaSyByyX1eUf6zDjDBCJA0DN-7K2xDtWq43R4",
//   authDomain: "dyuthi-bd052.firebaseapp.com",
//   databaseURL: "https://dyuthi-bd052.firebaseio.com",
//   projectId: "dyuthi-bd052",
//   storageBucket: "dyuthi-bd052.appspot.com",
//   messagingSenderId: "173809148500",
//   appId: "1:173809148500:web:1321954016c2f2cc32c3c1",
//   measurementId: "G-8TYM87Y5V3"
// };

// // react-redux-firebase config
// const rrfConfig = {
//   userProfile: "users"
//   //   useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
// };

// // Initialize firebase instance
// firebase.initializeApp(firebaseConfig);

// // Initialize other services on firebase instance
// // firebase.firestore(); // <- needed if using firestore
// // firebase.functions() // <- needed if using httpsCallable

// // Add reactReduxFirebase enhancer when making store creator
// // const createStoreWithFirebase = compose(
// //   reactReduxFirebase(firebase, rrfConfig) // firebase instance as first argument
// //   // <- needed if using firestore
// // )(createStore);

// // Add firebase to reducers
// const rootReducer = combineReducers({
//   firebase: firebaseReducer
// });

// const initialState = {};
// const store = createStore(
//   rootReducer,
//   initialState,
//   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// );

// export default store;
