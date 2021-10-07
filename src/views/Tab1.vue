<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title  @click="refresh" class="font" >PhotoDiary</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">

    <ion-refresher slot="fixed" @ionRefresh="doRefresh()">
      <ion-refresher-content></ion-refresher-content>
    </ion-refresher>
<!--test-->
      <div  v-for="x in datefromfb" :key="x.id">

        <ion-card style="box-shadow: 0px 0px">
          <ion-item @click="lookatprofile(x.createdBy)">
            <ion-avatar slot="start">
            <ion-img :src="`${x.avatar}`" ></ion-img>
            </ion-avatar>
          <ion-label>
            <h3 class="font"> {{x.displayName}}</h3>
            <p class="font">posted {{x.createdAt}} ago </p>
          </ion-label>
        </ion-item>
          <ion-img :src="`${x.source}`" @click="lookatfoto(x.id)" alt="test" />
            <ion-card-header>
              <ion-card-title class="font"> {{x.message}}</ion-card-title>
              </ion-card-header>
              <ion-card-content>              
              <p  v-if="x.likedBy.length != 'undefined'">Liked by {{x.likedBy.length}} people</p>
              </ion-card-content>
        </ion-card>
        </div>
<!---->


         
    </ion-content>
  </ion-page>
</template>

<script >
import getUser from '@/composables/getUser'
import { IonImg,IonItem,IonAvatar,IonRefresher,IonRefresherContent,
IonPage,IonCard,IonCardContent,IonCardTitle, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import { formatDistanceToNow } from 'date-fns'
import { ref, } from 'vue';
import { useRouter } from 'vue-router'

import firebase from '../firebase.js'
export default  {
  name: 'Tab1',
  components: {IonItem,IonAvatar,IonRefresher,IonRefresherContent,
  IonImg, IonCard,IonCardContent,IonCardTitle,IonHeader, IonToolbar, IonTitle, IonContent, IonPage },

  setup(){
    let {user }= getUser()
    let router =useRouter()
//test
      let {projectFirestore} = firebase
      const datefromfb = ref([]);

      console.log(user.value.email)
      projectFirestore.collection(user.value.email).get()
        .then(snap=>{
          snap.forEach(doc=>{
            let subs1 = doc.data().subs
            subs1.forEach(x=>{
              projectFirestore.collection(`all-fotos`).where('createdBy','==',x)
                     .onSnapshot(snap=>{
                       snap.forEach(z=>{
                      let foto = doc.data()
                       foto.message =z.data().message
                       console.log(foto.message)
                       foto.createdBy= z.data().createdBy
                       foto.likedBy = z.data().likedBy
                       
                       
                       foto.createdAt= formatDistanceToNow(z.data().createdAt.toDate())
                       
                       foto.createdAtSec = z.data().createdAt
                       console.log(foto.createdAt)
                       foto.source = z.data().foto
                       foto.id = z.id
                        projectFirestore.collection(foto.createdBy)
                          .get().then(snap=>{
                            snap.forEach(doc=>{
                              console.log(foto)
                              foto.avatar= doc.data().avatar
                              foto.displayName = doc.data().displayName
                              console.log(foto)
                              datefromfb.value.push(foto)
                            })
                        datefromfb.value.sort((a,b)=>{
                          return b.createdAtSec - a.createdAtSec
                        })
                          })

                       console.log(foto)
                       console.log(datefromfb.value)
                       //datefromfb.value.push(foto)
                       console.log(datefromfb.value)
                      })
                   })
            })
          })
        })
    let testlist=datefromfb.value.map(x=>{
     return x.createdAtSec
    })
    const doRefresh = ()=>{router.go()}
    const refresh=()=>{router.go()}
    let lookatfoto=(x)=>{ router.push({name:'lookatfoto',params:{id:x}})}

    let lookatprofile=(x)=>{router.push({name:'profileof',params:{email:x}})}
    return{user,datefromfb,lookatprofile,testlist,doRefresh,lookatfoto,refresh
    }
  }
}
</script>

<style scoped>
.font{font-family: 'Hammersmith One', sans-serif;}
</style>