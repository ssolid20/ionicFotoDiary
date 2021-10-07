<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
          <ion-buttons slot="start" @click="goback">
          <ion-button>
            <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title class="font" >Search People</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">

      <ion-card style="box-shadow: 0px 0px">
        <ion-card-content>
        <ion-item  >
          <ion-input class="font" style="text-align:center" placeholder="Write a Name" v-model="name"></ion-input>
        </ion-item>
        </ion-card-content>
     </ion-card>

      <div v-if="findName.length>0" >
      <ion-list  v-for="x in findName" :key="x">
          <ion-item @click="toprofile(x.email)">
              <ion-avatar slot="start">
                <img :src="`${x.avatar}`">
              </ion-avatar>
              <ion-label>
                <h3 class="font">{{x.displayName}}</h3>
                <p class="font">Tap to see  profile</p>
              </ion-label>
          </ion-item>
      </ion-list>
      </div>

      <div v-else>
        <ion-card style="box-shadow: 0px 0px">
        <ion-card-content  class="font" style="text-align:center;">
           <h3>  </h3>
        <ion-card-title>No Results</ion-card-title>
        </ion-card-content>
     </ion-card>
      </div>

    </ion-content>
  </ion-page>
</template>

<script >
import { ref,computed} from 'vue';

import {IonList,IonCardTitle, IonCard,IonCardContent, IonPage,IonInput,IonItem, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import firebase from '../firebase.js'
import getUser from '@/composables/getUser'
import {  useRouter } from 'vue-router'
import {arrowBack} from 'ionicons/icons';

export default  {
  name: 'Tab2',
  components: {IonInput,IonItem,IonCard,IonCardContent,IonList,IonCardTitle,  IonHeader, IonToolbar, IonTitle, IonContent, IonPage },
  setup(){
    let {user}=getUser()
    let test = ref([])
    let name = ref()
    let router = useRouter()
    let {projectFirestore} = firebase
    console.log(user.value.displayName)
    projectFirestore.collection('allUsersThatSignedUp').onSnapshot(snapshot =>{
            snapshot.forEach(doc=>{
                if (doc.data().email !== user.value.email){
                  projectFirestore.collection(doc.data().email)
                    .onSnapshot(snapshot=>{
                      snapshot.forEach(x=>{
                          let f = x.data()
                          f.id= x.id
                          f.displayName = x.data().displayName
                          f.avatar = x.data().avatar
                          test.value.push(f)
                          console.log(x.data())
                      })
                    })
              }
            })})
    const findName = computed(() =>{
        return test.value.filter((x)=>{return x.displayName.match(name.value)} )})

    let goback=()=>{router.go(-1)}

    let toprofile =(x)=>{router.push({name:'profileof',params:{email:x}})}


    return{
      user,test,findName,name,toprofile,arrowBack,goback
    }
  }
}
</script>


<style scoped>
.font{font-family: 'Hammersmith One', sans-serif;}
</style>