// Get registration token. Initially this makes a network call, once retrieved
import firebase from '../firebase'

const messaging = firebase.messaging();
const {projectFirestore}= firebase

// Add the public key generated from the console here.
// subsequent calls to getToken will return from cache.
messaging.getToken({ vapidKey: 'BH1gmk70Mi6OrXEpGjPq9bL4IGiynXbWi-3Q402inWVlTjsU5HMbNOPHBKB94vFVgm3wirhhTo-pcOdxQwHIWnA' }).then((currentToken) => {
    if (currentToken) {
      // Send the token to your server and update the UI if necessary
      // ...
      projectFirestore.collection('token').add({
       token:currentToken
    }).catch(err =>{
        console.log(err)
    })

    } else {
      // Show permission request UI
      console.log('No registration token available. Request permission to generate one.');
      // ...
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // ...
  });