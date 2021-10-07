<template>
    <ion-page>
        <ion-header >
        <ion-toolbar>
        <ion-buttons slot="start" @click="goback">
          <ion-button >
            <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
            <ion-title class="font" slot="start" >Your Profile</ion-title>
        </ion-toolbar>
        </ion-header>
        <ion-content>

          <ion-refresher slot="fixed" @ionRefresh="doRefresh()">
            <ion-refresher-content></ion-refresher-content>
          </ion-refresher>

        <ion-card style="box-shadow: 0px 0px" v-if="aboutuser">
          <ion-card-content>
  
              <ion-item>
                  <ion-avatar slot="start" id="biggerimg">
                      <ion-img  :src="`${aboutuser.avatar}`" alt="foto" />
                  </ion-avatar>
                  <ion-label>
                    <p class="font"> Hello there, {{aboutuser.displayName}}</p>
                    <p class="font">Number of subscribers: {{aboutuser.subs.length}}</p>
                    <p class="font">Number of posts: {{fotofromdb.length}}</p>

                  </ion-label>
              </ion-item>
            <ion-item> <p class="font ">{{aboutuser.describtion}}</p></ion-item>
                <ion-grid  >
                  <ion-row class="flextest">
                    <ion-fab-button @click="()=>router.push('/tabs/tab4')"  ><ion-icon :icon="camera"></ion-icon></ion-fab-button>
                    <ion-fab-button @click="()=>router.push('/tabs/tab6')"  ><ion-icon   :icon="create"></ion-icon></ion-fab-button>
                    <ion-fab-button @click="gotowelcome" ><ion-icon  :icon="exit"></ion-icon></ion-fab-button>
                    <ion-toast
                      position="top"
                      :is-open="toast"
                      message="You successfully logged out"
                      :duration="1500"
                      @didDismiss="toast=false"
                    >
                    </ion-toast>

                  </ion-row>
                </ion-grid> 
          </ion-card-content>
        </ion-card>

      <div v-if="aboutuser">
      <div   v-for="x in fotofromdb" :key="x.id">

        <ion-card style="box-shadow: 0px 0px">
          <ion-item>
            <ion-avatar slot="start">
            <ion-img :src="`${aboutuser.avatar}`"></ion-img>
            </ion-avatar>
          <ion-label>
            <h3 class="font"> {{aboutuser.displayName}}</h3>
            <p class="font">posted {{x.createdAtnew}} ago </p>
          </ion-label>

        </ion-item>
          <ion-img :src="`${x.foto}`" @click="lookatfoto(x.id)" alt="test" />
          <ion-item>
                <ion-fab-button @click="deletefoto(x.id,x.filePath)"  size="small" class="delete" style="  box-shadow: 0px 0px 0px 0px" slot="start" color="light">
                  <ion-icon :icon="trash"  ></ion-icon>
                </ion-fab-button>

              </ion-item>
            <ion-card-header>
    
              <ion-card-title class="font">{{x.message}}</ion-card-title>

              </ion-card-header>
              <ion-card-content>              
              <p  v-if="x.likedBy.length != 'undefined'">Liked by {{x.likedBy.length}} people</p>
                 <ion-toast
                 position="top"
                  :is-open="deletetoast"
                  message="You successfully deleted a photo!"
                  :duration="1500"
                  @didDismiss="deletetoast=false">
                </ion-toast>
              </ion-card-content>


        </ion-card>
        </div>
        </div>
        <div v-if="!fotofromdb">
            <p>no fotos</p>
        </div>



        </ion-content>

    </ion-page>
</template>
<script>
import { formatDistanceToNow } from 'date-fns'
import getUser from '../composables/getUser'
import useLogout from '../composables/useLogout'
import firebase from '../firebase.js'
import { ref} from 'vue';
import { arrowBack,camera,exit,create,trash} from 'ionicons/icons';
import { useRouter } from 'vue-router'
import useStorage from '../composables/useStorage'

import {IonPage,IonGrid,IonRow,IonIcon,IonFabButton,IonToast,IonRefresher,IonRefresherContent
,IonHeader,IonToolbar,IonButtons,IonContent,IonCard,IonCardContent,IonItem,IonLabel,IonAvatar} from '@ionic/vue';
export default {
    components:{IonIcon,IonToast,IonRefresher,IonRefresherContent,
      IonGrid,IonFabButton,IonRow,IonPage,IonHeader,IonToolbar,IonButtons,IonContent,IonCard,IonCardContent,IonItem,IonLabel,IonAvatar},
    setup() {
      const { user } = getUser()
      const {deleteImage} = useStorage()
      const {projectFirestore} = firebase
      const aboutuser=ref()
      const fotofromdb=ref([])
      const { logout, error } = useLogout()
      const router=useRouter()
      const deletetoast = ref(false)
      const toast=ref(false)
      projectFirestore.collection(`all-fotos`).where('createdBy','==',`${user.value.email}`)
        .get().then(snapshot => {
              snapshot.forEach(doc => {
                let smoothie = doc.data()
                smoothie.id = doc.id
                smoothie.createdAtnew= formatDistanceToNow(doc.data().createdAt.toDate())
                fotofromdb.value.push(smoothie)
                  })
              fotofromdb.value.sort((a,b)=>{
                  return b.createdAt - a.createdAt
                })

                });
      console.log(fotofromdb.value)
  
      projectFirestore.collection(`${user.value.email}`)
        .onSnapshot(snapshot =>{
                snapshot.forEach(doc=>{
                  let g = doc.data()
                  g.avatar=doc.data().avatar
                  g.subs = doc.data().subs
                  g.id = doc.id
                  aboutuser.value= g

                })})


      let gotowelcome = async ()=>{
        await logout()
        toast.value=true
        router.push({name:'welcome'})
        console.log('logout')
      }

    let toastgo=()=>{
      deletetoast.value=true
    }
    let deletefoto= async(x,y)=>{
      toastgo()
      projectFirestore.collection(`all-fotos`).doc(x).delete()
      console.log('deleted')
      

      fotofromdb.value = fotofromdb.value.filter(f=>{
        return f.id != x
      })
      await deleteImage(y)
      
    }
    let lookatfoto=(x)=>{ router.push({name:'lookatfoto',params:{id:x}})}
    let goback=()=>{router.go(-1)}
    const doRefresh = ()=>{router.go()}

      return{deletetoast,toastgo,doRefresh,lookatfoto,arrowBack,goback,
        user,logout,error,projectFirestore,aboutuser,fotofromdb,exit,create,camera,gotowelcome,router,toast,trash,deletefoto
      }
    },
}
</script>
<style  scoped>
.font{font-family: 'Hammersmith One', sans-serif;}

#biggerimg{
    width: 100px;
    height: 100px;
}
.flextest{
    justify-content: space-around 

}

.delete{
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2), 0 0 0 0 rgba(0, 0, 0, 0.14), 0 0 0 0 rgba(0, 0, 0, 0.12);
  z-index: 0;
};
</style>