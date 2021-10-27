<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
          <ion-buttons slot="start" @click="goback">
          <ion-button >
            <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title class="font" >Chats</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">

    <ion-refresher slot="fixed" @ionRefresh="doRefresh()">
      <ion-refresher-content></ion-refresher-content>
    </ion-refresher>

      <div v-if="peopleToSpeak" >
      <ion-list  v-for="x in peopleToSpeak" :key="x">
          <ion-item @click="starChat(x.email)">
              <ion-avatar slot="start">
                <img :src="`${x.avatar}`">
              </ion-avatar>
              <ion-label>
                <h3 class="font">{{x.displayName}}</h3>
                <p class="font">Tap to chat</p>
              </ion-label>
              x
          </ion-item>
      </ion-list>
      </div>
      
    </ion-content>
  </ion-page>
</template>

<script  >
import { IonPage,IonRefresher,IonRefresherContent, IonHeader,IonLabel,IonList,IonItem,IonAvatar, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import { arrowBack} from 'ionicons/icons';
import { useRouter } from 'vue-router'
import firebase from '../firebase.js'
import getUser from '../composables/getUser'
import {ref} from 'vue'
export default  {
  name: 'Tab3',
  components: {  IonHeader,IonRefresher,IonRefresherContent, IonToolbar,IonLabel,IonList,IonItem,IonAvatar, IonTitle, IonContent, IonPage },
  setup(){
        const {projectFirestore} = firebase
        const { user } = getUser()
        const router  = useRouter()
        const peopleToSpeak=ref([])

      projectFirestore.collection(user.value.email).get()
        .then(snap=>{
          snap.forEach(doc=>{
              let people=doc.data().chatedwith
              people.forEach(x=>{
                projectFirestore.collection(x).get()
                  .then(snap=>{
                    snap.forEach(z=>{
                      let person={}
                      person.email =z.data().email
                      person.displayName= z.data().displayName
                      person.avatar = z.data().avatar
                      peopleToSpeak.value.push(person)

                    })
                  })
              })
          })})

    let goback=()=>{router.go(-1)}
    let starChat=(x)=>{
      router.push({name:'chat',params:{email:x}})

    }
    let doRefresh=()=>{router.go()}
    return{goback,arrowBack,peopleToSpeak,starChat,doRefresh,}
  }
}
</script>


<style scoped>


.font{font-family: 'Hammersmith One', sans-serif;}
</style>