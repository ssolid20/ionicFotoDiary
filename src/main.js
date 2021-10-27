import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import firebase from './firebase'
import { defineCustomElements } from '@ionic/pwa-elements/loader';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';
let {projectAuth} = firebase
let app

projectAuth.onAuthStateChanged(() => {
  if (!app) {app = createApp(App)
      .use(IonicVue).use(router).mount('#app')}})


router.isReady().then(() => {
  app.mount('#app');
});

// Get registration token. Initially this makes a network call, once retrieved
import '@firebase/messaging';

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

defineCustomElements(window);
