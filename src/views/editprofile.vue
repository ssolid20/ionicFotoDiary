<template>
    <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start" @click="goback">
          <ion-button>
            <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title class="font" >Edit your profile</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">

    <div id="container">
    <ion-card style="box-shadow: 0px 0px">
    <ion-card-content>
        <ion-avatar slot="start" class="test" @click="changeAvatar">
            <ion-img   :src="avatar"  alt="foto" />
        </ion-avatar>
        <ion-textarea auto-grow="true" class="font" v-model="newDes" placeholder="write a describtion"></ion-textarea>  
        <ion-button expand="full" @click="editInfo" class="font">Edit</ion-button>

     <ion-toast
        :is-open="toast"
        message="You successfully edited your profile!"
        :duration="1500"
        @didDismiss="toast=false">
        </ion-toast>
        </ion-card-content>
    </ion-card>
    </div>

      
    </ion-content>
  </ion-page>
</template>

<script>
import getUser from '../composables/getUser'
import { ref} from 'vue';
import firebase from '../firebase'
import { Camera, CameraResultType } from '@capacitor/camera';
import { useRouter } from 'vue-router'
import { arrowBack} from 'ionicons/icons';

import { IonPage,IonButton, IonHeader, IonToolbar, IonTitle, IonContent,IonButtons,IonAvatar,IonTextarea ,IonCard,IonCardContent} from '@ionic/vue';
export default {
  components: {  IonHeader,IonButton, IonToolbar, IonTitle, IonContent, IonPage,IonButtons,IonAvatar,IonTextarea ,IonCard,IonCardContent},
  setup(){
    const {projectFirestore}= firebase
    const toast = ref(false)
    const { user } = getUser()
    const newDes = ref('')
    const avatar=ref()
    const idofuser = ref()
    const router  = useRouter()
    let changeAvatar= async ()=>{
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: true,
          resultType: CameraResultType.Base64
        });
        avatar.value= `data:image/jpeg;base64,${image.base64String}`
    }
    let goback=()=>{router.go(-1)}


    let editInfo= ()=>{


        projectFirestore.collection(`${user.value.email}`).doc(idofuser.value).update({
                describtion: newDes.value,
                avatar:avatar.value
            }).catch(err =>{
                console.log(err)
            })
        toast.value=true
        router.push('/tabs/tab5')
    }

    projectFirestore.collection(`${user.value.email}`)
        .onSnapshot(snapshot =>{
                snapshot.forEach(doc=>{
                  newDes.value =doc.data().describtion
                  avatar.value= doc.data().avatar
                  idofuser.value=doc.id

                })})

    return{
        avatar,user,newDes,changeAvatar,editInfo,idofuser,toast,goback,arrowBack
    }

  }
}
</script>

<style scoped>
.font{font-family: 'Hammersmith One', sans-serif;}
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}
.test{
    
  display: block;
  margin-left: auto;
  margin-right: auto;
   width: 200px;
    height: 200px;

}
</style>