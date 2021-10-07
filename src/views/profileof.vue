<template>
    <ion-page>
    <ion-header v-if="aboutuser">
      <ion-toolbar>
        <ion-buttons slot="start" @click="goback">
          <ion-button>
            <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title class="font" slot="start" style="text-align:center">Profile of {{aboutuser.displayName}}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">

    <ion-refresher slot="fixed" @ionRefresh="doRefresh()">
      <ion-refresher-content></ion-refresher-content>
    </ion-refresher>
        <!--test-->

      <ion-card style="box-shadow: 0px 0px" v-if="aboutuser">
        <ion-card-content>
 
            <ion-item>
                <ion-avatar slot="start" id="biggerimg">
                    <ion-img  :src="`${aboutuser.avatar}`" alt="foto" />
                </ion-avatar>
                <ion-label class="font">
                 {{aboutuser.displayName}}
                <p class="font">Subscriptions of {{aboutuser.displayName}} : {{aboutuser.subs.length}} </p>
                <p class="font">Number of posts :{{fotofromdb.length}}</p>
                </ion-label>
            </ion-item>
          <ion-item>
            <p class="font">About {{aboutuser.displayName}}:</p>
          </ion-item>
          <ion-item> <p class="font ">{{aboutuser.describtion}}</p></ion-item>
         
            <ion-grid>
                <ion-row>
                    <ion-col>
                        <ion-button v-if="!toChangeButton" style="width:100%" @click="followUser(aboutuser.email)">Follow</ion-button>
                        <ion-button v-if="toChangeButton" color="danger" style="width:100%"  @click="unFollowUser(aboutuser.email)">Unfollow</ion-button>
                <ion-toast
                  :is-open="toast"
                  position="top"
                  message= "You're now following this user"
                  :duration="1500"
                  @didDismiss="toast=false">
                </ion-toast>
                    </ion-col>
                    <ion-col>
                        <ion-button style="width:100%"  color="primary" @click="startChat()"><ion-icon slot="start" :icon="chatbubble"></ion-icon> Chat </ion-button>
                    </ion-col>
               
                
                </ion-row>
            </ion-grid>     
           </ion-card-content>

      </ion-card>
    <!--
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
            <ion-card-header>
              <ion-card-title class="font">{{x.message}}</ion-card-title>
              </ion-card-header>
              <ion-card-content>              
              <p  v-if="x.likedBy.length != 'undefined'">Liked by {{x.likedBy.length}} people</p>
              </ion-card-content>
        </ion-card>
        </div>
        </div>
        -->
        <ion-grid>
          <ion-row>
          <ion-col size="4"  class="ion-align-self-start" v-for="x in test1" :key="x.id">
             <ion-img :src="`${x.foto}`" @click="lookatfoto(x.id)" alt="test" />

          </ion-col>
          <ion-col size="4"  class="ion-align-self-center" v-for="x in test2" :key="x.id">
             <ion-img :src="`${x.foto}`" @click="lookatfoto(x.id)" alt="test" />

          </ion-col>          
          <ion-col size="4"  class="ion-align-self-end" v-for="x in test3" :key="x.id">
             <ion-img :src="`${x.foto}`" @click="lookatfoto(x.id)" alt="test" />

          </ion-col>
          </ion-row>
        </ion-grid>



    </ion-content>
    </ion-page>

</template>
<script >
import { defineComponent } from 'vue'
import {onMounted,computed, ref} from 'vue';
import firebase from '../firebase.js'
import getUser from '../composables/getUser'
import { formatDistanceToNow } from 'date-fns'
import { useRoute, useRouter } from 'vue-router';
import { arrowBack,chatbubble} from 'ionicons/icons';
import {IonPage,IonContent,IonAvatar,IonCol,IonRefresher,IonRefresherContent,
IonIcon,IonImg,IonItem,IonButton,IonButtons,IonGrid,IonRow,IonToast, IonCard,IonCardContent,IonToolbar,IonHeader}from '@ionic/vue';
export default defineComponent({
    components:{IonRefresher,IonRefresherContent,
        IonPage,IonContent,IonAvatar,IonCol,IonIcon,IonImg,IonCard,IonCardContent,IonToolbar,IonGrid,IonRow,IonHeader,IonItem,IonButton,IonButtons,IonToast,
    },

    setup() {
        let toChangeButton=ref()
        let route=useRoute()
        let profileof = ref(route.params.email)
        console.log(profileof.value)
        const fotofromdb = ref([])
        let aboutuser = ref()
        let idfordatabase = ref()
        const { user } = getUser()
        const {projectFirestore} = firebase
        const toast = ref(false)
        const router=useRouter()

        onMounted(()=>{
          if (profileof.value==user.value.email){router.replace({name:'you'})}}
        )

        projectFirestore.collection(profileof.value)
            .get().then(snapshot =>{
                    snapshot.forEach(doc=>{
                    let g = doc.data()
                    g.id = doc.id
                    aboutuser.value = g
                    console.log(aboutuser.value.subs)
                    })})

        projectFirestore.collection(user.value.email)
            .onSnapshot(snap=>{
                snap.forEach(doc=>{
                    let h=doc.data()
                    h.subs=doc.data().subs
                    h.id = doc.id
                    idfordatabase.value= h

                })
                console.log(idfordatabase.value)
                idfordatabase.value.subs.forEach(x=>{
                    if (x == profileof.value){
                        toChangeButton.value=true
                        console.log(toChangeButton.value)
                    }
                })

            })
    


        projectFirestore.collection(`all-fotos`).where('createdBy','==',profileof.value).get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              let smoothie = doc.data()
              smoothie.id = doc.id
              smoothie.createdAtnew= formatDistanceToNow(doc.data().createdAt.toDate())
              fotofromdb.value.push(smoothie)
            })
              fotofromdb.value.sort((a,b)=>{
                  return b.createdAt - a.createdAt
                })

                console.log(fotofromdb.value)
              });

        let followUser =(x)=>{
            console.log(x)
            projectFirestore.collection(`${user.value.email}`).doc(idfordatabase.value.id).update({
                subs:[...idfordatabase.value.subs,x]
            })
            toast.value=true

        }
        let unFollowUser=(x)=>{
            console.log('unfollow :' + x)
            let newSubs = idfordatabase.value.subs.filter(f=>{
                return f != x
            })
            console.log(newSubs)
            projectFirestore.collection(`${user.value.email}`).doc(idfordatabase.value.id).update({
                subs:[...newSubs]
            })
            toChangeButton.value=false
        }

      const test1 = computed(()=>{
        let r  =fotofromdb.value.length
        let x = fotofromdb.value.slice(0,r/3);
       return  x
      })
      const test2 = computed(()=>{
        let r  =fotofromdb.value.length
        let x = fotofromdb.value.slice(r/3,2*(r/3));
       return  x
      })
      const test3 = computed(()=>{
        let r  =fotofromdb.value.length
        let x = fotofromdb.value.slice(2*(r/3),r);
       return  x
      })
    const doRefresh = ()=>{router.go()}
    let goback=()=>{router.go(-1)}
    let lookatfoto=(x)=>{ router.push({name:'lookatfoto',params:{id:x}})}
    const startChat=()=>{router.push({name:'chat',params:{email:profileof.value}})}

    return{
      user,doRefresh,lookatfoto,arrowBack,goback,startChat,test1,test2,test3
      ,idfordatabase,fotofromdb,aboutuser,toChangeButton,projectFirestore,chatbubble,followUser,unFollowUser,toast
    
        }

        
    },
})
</script>
<style scoped>
.font{font-family: 'Hammersmith One', sans-serif;}

#biggerimg{
    width: 100px;
    height: 100px;
}
</style>