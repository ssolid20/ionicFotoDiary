<template>
    <ion-page>
    <ion-header v-if="InfoUserSec">
      <ion-toolbar>
        <ion-buttons slot="start" @click="goback">
          <ion-button>
            <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-item slot="start">
            <ion-avatar >
            <ion-img :src="`${InfoUserSec.avatar}`" ></ion-img>
            </ion-avatar>
            <ion-title class="font" style="text-align:center"> {{InfoUserSec.displayName}}</ion-title>

        </ion-item>
      </ion-toolbar>
    </ion-header>
        <ion-content >


            <div v-if="InfoUserFir" >
            <ion-card   v-for="x in allMes" :key="x.id" style="box-shadow: 0px 0px;" >
                <ion-card-content>
                   
                   <div class="font" v-if="x.writtenByDisplayName==InfoUserFir.displayName">

                     
                     <div style="color:red;text-align:right">You wrote {{x.newCreatedAt}} ago  </div>
                      <p style="color:black;text-align:right;">{{x.text}}</p>                  
                       

                   </div>
                   <div v-else>
                      <div class="font" style="color:blue">{{x.writtenByDisplayName}} wrote {{x.newCreatedAt}} ago  </div>
                      <p  class="font" style="color:black">{{x.text}}</p>
                   </div>
                    
                </ion-card-content>
            </ion-card>
            </div>
              

               <ion-textarea  class="font text"   placeholder="write your message" v-model="message" @keypress.enter="writeMessage"  auto-grow></ion-textarea>
                <p  id="bottom" ></p>
        </ion-content>

    </ion-page>

</template>

<script>
import { ref,onUpdated} from 'vue';
import firebase from '../firebase.js'
import getUser from '../composables/getUser'
import { formatDistanceToNow } from 'date-fns'
import { useRoute, useRouter } from 'vue-router';
import {arrowBack} from 'ionicons/icons';

import {IonItem ,IonTextarea, IonCard,IonCardContent,IonImg,IonAvatar, IonPage,IonContent,IonHeader,IonToolbar,IonTitle,IonButton,IonButtons,IonIcon} from '@ionic/vue';
export default {
    components:{IonItem,IonImg,IonAvatar,IonCard,IonCardContent,IonTextarea,
        IonPage,IonContent,IonHeader,IonToolbar,IonTitle,IonButton,IonButtons,IonIcon
    },
    setup(){
        let router = useRouter()
        let route=useRoute()
        const {projectFirestore} = firebase
        const { user } = getUser()
        let profileof = ref(route.params.email)
        let message =ref('')
        const row =ref()
        const InfoUserFir=ref()
        const InfoUserSec = ref()
        const allMes =ref([])
        console.log(profileof.value)

        projectFirestore.collection(user.value.email).onSnapshot(snap=>{
             snap.forEach(doc=>{
               let infoAboutUser1= doc.data()
               infoAboutUser1.id=doc.id
               infoAboutUser1.avatar=doc.data().avatar
               infoAboutUser1.displayName=doc.data().displayName
               infoAboutUser1.chats =doc.data().chats
               infoAboutUser1.chatsToUser2 = doc.data().chats.filter(x=>{
                return x.writtenTo == profileof.value
               })
                console.log(infoAboutUser1)
                InfoUserFir.value = infoAboutUser1
                let x =[...InfoUserFir.value.chatsToUser2,...InfoUserSec.value.chats]
                console.log(x)
                allMes.value = x
                console.log(allMes.value)
                allMes.value.sort((a,b)=>{
                  return b.createdAt - a.createdAt
                })
                console.log(allMes.value)
                allMes.value.forEach(x=>{
                      x.newCreatedAt= formatDistanceToNow(x.createdAt)
                  })
                allMes.value.reverse()
                document.getElementById( 'bottom' ).scrollIntoView({block: "end",behavior:"smooth"});
             })
           })
            console.log(InfoUserFir.value)
          projectFirestore.collection(profileof.value).onSnapshot(snap=>{
             snap.forEach(doc=>{
               let infoAboutUser2= doc.data()
               infoAboutUser2.id=doc.id
               infoAboutUser2.avatar=doc.data().avatar
               infoAboutUser2.displayName=doc.data().displayName
               infoAboutUser2.chats = doc.data().chats.filter(x=>{
                return x.writtenTo == user.value.email
               })
               InfoUserSec.value = infoAboutUser2
                let x =[...InfoUserFir.value.chatsToUser2,...InfoUserSec.value.chats]
                console.log(x)
                allMes.value = x
                console.log(allMes.value)
                allMes.value.sort((a,b)=>{
                  return b.createdAt - a.createdAt
                })
                console.log(allMes.value)
                allMes.value.forEach(x=>{
                      x.newCreatedAt= formatDistanceToNow(x.createdAt)
                  })
                allMes.value.reverse()
                document.getElementById( 'bottom' ).scrollIntoView({block: "end",behavior:"smooth"});
             })
           })


        onUpdated(()=>{
          document.getElementById( 'bottom' ).scrollIntoView({block: "end",behavior:"smooth"});
          
        })


          let writeMessage =()=>{
              let toSendByYou={
                text:message.value,
                createdAt:Date.now(),
                writtenTo:profileof.value,
                writtenToDisplayName:InfoUserSec.value.displayName,
                writtenBy:user.value.email,
                writtenByDisplayName:user.value.displayName
              }
              //infoAboutUser1.value.chats.push(toSendByYou)
              projectFirestore.collection(user.value.email).doc(InfoUserFir.value.id).update({
                chats:[...InfoUserFir.value.chats,toSendByYou]
              }).catch(err =>{
                console.log(err)
            })
            message.value=""
            
           // document.getElementById( 'bottom' ).scrollIntoView({block: "end",behavior:"smooth"});
            //row.value.scrollIntoView({block: "end",behavior:"smooth"})

          }

        let goback=()=>{router.go(-1)}

        return{
            goback,writeMessage,InfoUserFir,InfoUserSec,message,row,arrowBack,allMes

        }
    }
}
</script>

<style scoped>
.font{font-family: 'Hammersmith One', sans-serif;}
.test{
  color:blue
}
.text{
  margin-top:60px;
  text-align:center;
  position: sticky;
  bottom: 0;
  background-color: white;
  border: 5px solid white

}
</style>