  // Your web app's Firebase configuration
import firebase from 'firebase/app'
import 'firebase/firestore';

//  import firestore from 'firebase/firestore'
import 'firebase/storage'
import 'firebase/auth'
var firebaseConfig = {
  apiKey: "AIzaSyDpXWDZoL2nIDxfZivxoQfkFSvzQ4ue9tE",
  authDomain: "instaclone2-1304e.firebaseapp.com",
  projectId: "instaclone2-1304e",
  storageBucket: "instaclone2-1304e.appspot.com",
  messagingSenderId: "206975860898",
  databaseURL: "https://instaclone2-1304e.firebaseio.com",
  appId: "1:206975860898:web:8bd1b34730433a9d4817fb"
};

firebase.initializeApp(firebaseConfig)

// Initialize Firebase projectAuth

const projectAuth = firebase.auth()
const projectFirestore = firebase.firestore()
const timestamp = firebase.firestore.FieldValue.serverTimestamp
const projectStorage = firebase.storage()
/*let projectAuth = firebase.auth()
const x  = firebase.initializeApp(firebaseConfig);
let firestore1 = x.firestore()
let timestamp =  firebase.firestore.FieldValue.serverTimestamp
firestore1.settings({timestampsInSnapshots:true})*/
export default {projectFirestore,projectAuth,projectStorage,timestamp}