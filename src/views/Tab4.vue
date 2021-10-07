<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
          <ion-buttons slot="start" @click="goback">
          <ion-button >
            <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title class="font" >Add Photo</ion-title>

      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">


      
      <div id="container">
      <ion-card style="box-shadow: 0px 0px">
        <ion-card-content>
        <ion-fab-button v-show="!foto" class="centerButton" expand="full" id="capture" @click="takePicture"><ion-icon :icon="camera"></ion-icon></ion-fab-button>

        <ion-avatar slot="start" class="centerImage" v-show="foto" @click="takePicture">
            <ion-img   @click="takePicture"   :src="foto"  alt="foto" />
        </ion-avatar>
        <ion-textarea auto-grow="true" class="font" v-model="message" placeholder="write a describtion"></ion-textarea>  
        <ion-button v-show="foto" expand="full" @click="handleSubmit" class="font"><ion-icon :icon="checkmark"></ion-icon></ion-button>
       

  
          <ion-toast
            :is-open="toast" position="top"
            message="You successfully posted a photo!"
            :duration="1500"
            @didDismiss="toast=false">
          </ion-toast>

        </ion-card-content>
      </ion-card></div>












      
 
    </ion-content>
  </ion-page>
</template>

<script  >


import { IonPage, IonHeader,IonButtons, IonFabButton,IonToast, IonToolbar,IonIcon, IonTitle,IonButton, IonContent,IonCard,IonCardContent,IonTextarea } from '@ionic/vue';
import {ref} from 'vue'
import {arrowBack, camera,checkmark} from 'ionicons/icons';
import firebase from '../firebase'
import useStorage from '../composables/useStorage'
import getUser from '../composables/getUser'
import useCollection from '../composables/useCollection'
import { Camera, CameraResultType } from '@capacitor/camera';
import {  useRouter } from 'vue-router';

export default  {

  name: 'Tab4',
  components: {IonFabButton,IonButtons,IonToast,IonButton, IonHeader,IonIcon, IonToolbar, IonTitle, IonContent, IonPage ,IonCard,IonCardContent,IonTextarea},
  setup (){
    const foto =ref()
    const {projectStorage,timestamp}= firebase
    const {url} =useStorage()
    const { user } = getUser()
    let file =ref(null);
    const message = ref('');
    const fileError=ref(null)
    const { addDoc} = useCollection(`all-fotos`)
    const toast = ref(false)
    const filePath =ref('')
    const router=useRouter()

    let goback=()=>{router.go(-1)}



    const handleSubmit = async () => {
      let blob =toBlob(foto.value)
        //test to firebase base 64
        filePath.value= `covers/${user.value.uid}/$${blob.size}`
        const storageRef = projectStorage.ref(filePath.value)

        try {
          const res = await storageRef.put(blob)
          url.value = await res.ref.getDownloadURL()
          console.log(url.value)
        } catch (err) {
          console.log(err.message)
          
        }
          const chat = {
            message: message.value,
            createdAt: timestamp(),
            foto:url.value,
            createdBy:user.value.email,
            likedBy:[],
            comments:[],
            filePath:filePath.value
          }
          await addDoc(chat)
          toast.value=true
          console.log('addde to firestores')
          message.value=''
          foto.value=''

    }

     let toBlob=(x)=>{
       var byteString = atob(x.split(',')[1]);
       var mimeString = x.split(',')[0].split(':')
       var ab = new ArrayBuffer(byteString.length);
       var ia = new Uint8Array(ab)
       for (var i=0;i<byteString.length;i++){
         ia[i]=byteString.charCodeAt(i)
       }
       var blob = new Blob([ab],{type:mimeString});
       return blob
    }
    let takePicture=async()=>{

        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: true,
          resultType: CameraResultType.Base64
        });
        foto.value= `data:image/jpeg;base64,${image.base64String}`
    }

    return{goback,
        toBlob,takePicture,handleSubmit,camera,foto,file,message,fileError,checkmark,toast,filePath,arrowBack
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


.centerButton{
    
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.centerImage{
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 200px;
  height: 200px;

}
</style>