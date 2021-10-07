<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
          <ion-buttons slot="start" @click="goback">
          <ion-button>
            <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title  class="font" >PhotoDiary</ion-title>
      </ion-toolbar>
    </ion-header>
  <ion-content :fullscreen="true" v-if="aboutproper">

    <ion-refresher slot="fixed" @ionRefresh="doRefresh()">
      <ion-refresher-content></ion-refresher-content>
    </ion-refresher>

        <ion-card style="box-shadow: 0px 0px" v-if="foto">
          <ion-item @click="lookatprofile(foto.createdBy)">
            <ion-avatar slot="start">
            <ion-img :src="`${aboutproper.avatar}`" ></ion-img>
            </ion-avatar>
          <ion-label>
          
            <h3 class="font"> {{aboutproper.displayName}}</h3>
            <p class="font">posted {{foto.createdAt}} ago </p>
          </ion-label>
        </ion-item>
          <ion-img class="materialboxed"  :src="`${foto.foto}`"  alt="test" />
          <ion-item>

                <ion-fab-button v-if="changebutt ==  true" @click="likedAdd"   size="small" class="delete" style="  box-shadow: 0px 0px 0px 0px" slot="start" color="danger">
                  <ion-icon :icon="heart"  ></ion-icon>
                </ion-fab-button>
  
                <ion-fab-button v-else @click="DelLike"  size="small" color="warning" slot="start" >
                    <ion-icon :icon="star"  ></ion-icon>
                </ion-fab-button>

                 <ion-fab-button  @click="shareFunc" size="small" color="danger" slot="start" >
                    <ion-icon :icon="share"  ></ion-icon>
                </ion-fab-button>     
                  <ion-toast
                        position="top"
                        :is-open="liked"
                        message="You liked this photo"
                        :duration="1500"
                        @didDismiss="toast=false"
                      >
                  </ion-toast>

                  <ion-toast
                        position="top"
                        :is-open="tookback"
                        message="You took your reaction back"
                        :duration="1500"
                        @didDismiss="toast=false"
                      >
                  </ion-toast>
              </ion-item>
            <ion-card-header>
              <ion-card-title class="font">{{foto.message}}</ion-card-title>
              </ion-card-header>
              <ion-card-content>              
              <p  v-if="foto.likedBy.length != 'undefined'">Liked by {{foto.likedBy.length}} people</p>
              </ion-card-content>
        </ion-card>

        <ion-card style="box-shadow: 0px 0px">
          <ion-card-content>
            <div class="card-content flex2" >
              
             <ion-item>
              <ion-label class="font" position="floating" >Write Comment</ion-label>
              <ion-input @keyup.enter="editDescription" class="font" autocomplete="off"  type="text" v-model="comment" ></ion-input>
            </ion-item>
            </div>
          </ion-card-content>
        </ion-card>
        
        <ion-card style="box-shadow: 0px 0px">
          <ion-card-content>Number of comments - {{foto.comments.length}}</ion-card-content>
        </ion-card>

        <ion-card style="box-shadow: 0px 0px" >
          <ion-card-content>
            <div class="card-content" v-for="x in foto.comments" :key="x">
            <p>
              
              <span @click="lookatprofile(x.email)" class="font">{{x.displayaName}}</span> commented {{x.newtime}} ago </p>
              <p class="font">{{x.text}}</p>
         
            </div>
          </ion-card-content>
        </ion-card>


  </ion-content>
  </ion-page>
</template>

<script>
import {IonInput, IonContent,IonButtons,IonToast, IonHeader, IonTitle,IonFabButton,IonIcon, IonToolbar,IonRefresher,IonRefresherContent ,IonPage,IonCard,IonCardContent,IonCardHeader,IonItem,IonLabel,IonImg,IonAvatar} from '@ionic/vue';
import { defineComponent,ref } from 'vue';
import { useRouter,useRoute } from 'vue-router'
import getUser from '@/composables/getUser'
import firebase from '../firebase.js'
import { formatDistanceToNow } from 'date-fns'
import {share,arrowBack, heart,star} from 'ionicons/icons';

export default defineComponent({
  name: 'Modal',

  setup(){
    let route=useRoute()
    const router = useRouter()
    const id=ref(route.params.id)
    const { user } = getUser()
    let {projectFirestore} = firebase;
    let foto=ref()
    let aboutproper=ref()
    let likesfrom=ref([])
    let comment =ref()
    let changebutt=ref(true)
    const doRefresh = ()=>{router.go()}
    const liked =ref(false)
    const tookback = ref(false)
    let goback=()=>{router.go(-1)}

        projectFirestore.collection(`all-fotos`).doc(id.value).onSnapshot((doc) => {
              let f = doc.data()
              f.comments=doc.data().comments
              //test
              
              f.comments.forEach(x=>{
                var secs = x.time;
                
                x.newtime = formatDistanceToNow(new Date(secs))
              })
              f.comments=f.comments.reverse()
              
              f.createdAt = formatDistanceToNow(doc.data().createdAt.toDate())
              f.createdBy = doc.data().createdBy
              f.foto=doc.data().foto
              f.likedBy=doc.data().likedBy
              likesfrom.value = doc.data().likedBy
              console.log(likesfrom.value)
              if(doc.data().likedBy.includes(user.value.email)){
                changebutt.value=false
                console.log(changebutt.value)

              }
              f.message=doc.data().message
              foto.value=f
              projectFirestore.collection(`${foto.value.createdBy}`).get()
                .then(snap=>{
                  snap.forEach(x=>{
                    let q =x.data()
                    q.id =x.id
                    q.avatar= x.data().avatar
                    q.displayName =x.data().displayName
                    aboutproper.value= q

                  })
                })
                
            })



    let editDescription=()=>{
      
        let addComment ={
          email:user.value.email,
          displayaName:user.value.displayName,
          text:comment.value,
          time: Date.now(),
          newtime:'',


        }
        projectFirestore.collection(`all-fotos`).doc(id.value).update({
          comments:[...foto.value.comments,addComment]
        })
        comment.value=''

    }
    let likedAdd=()=>{
      projectFirestore.collection(`all-fotos`).doc(id.value).update({
        likedBy:[...likesfrom.value,user.value.email]
      })  
      changebutt.value=false
      projectFirestore.collection(`favs-of-${user.value.email}`).add({
        comments:foto.value.comments,
        createdAt:foto.value.createdAt,
        createdBy:foto.value.createdBy,
        likedBy:foto.value.likedBy,
        foto:foto.value.foto,
        message:foto.value.message,
        id:id.value
      
    }).catch(err =>{
      console.log(err)
      })
      liked.value=!liked.value
    }
    let lookatprofile=(x)=>{
      router.push({name:'profileof',params:{email:x}})
      
    }

    let DelLike=()=>{
      let newlike= likesfrom.value.filter(x=>{
        return x !== user.value.email
      })
      projectFirestore.collection(`all-fotos`).doc(id.value).update({
        likedBy:[...newlike]
      })  
      changebutt.value=true
      tookback.value=!tookback.value

    }
    let shareFunc= async(x,y,z)=>{
      console.log(x,y,z)
      if (navigator.canShare) {
              navigator.share({
                  url: 'https://fireship.io',
                  title: 'PWAs are awesome!',
                  text: 'I learned how to build a PWA today',
              })
          
          .then(() => console.log('Successful share'))
          .catch((error) => console.log('Error sharing', error));
      
      } else {console.log('not your daya')}

    }

    return{lookatprofile,heart,star,tookback,liked,share,shareFunc,goback,arrowBack,
      doRefresh,id,editDescription,DelLike,likedAdd,foto,likesfrom,changebutt,comment,aboutproper
    }
  },
  components: {IonButtons,IonToast, IonContent, IonRefresher,IonRefresherContent ,IonPage,IonCard,IonCardContent,IonCardHeader,IonItem,IonLabel,IonImg,IonAvatar
  ,IonHeader,IonInput, IonTitle, IonToolbar,IonFabButton,IonIcon,}
});
</script>

<style scoped>
.font{font-family: 'Hammersmith One', sans-serif;}

</style>