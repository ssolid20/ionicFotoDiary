<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1"  @click="gotofirst">
          <ion-icon :icon="home"/>
        </ion-tab-button>
          
        <ion-tab-button tab="tab2"  @click="gotosecond">
          <ion-icon :icon="search" />
        </ion-tab-button>
        <ion-tab-button tab="tab3"  @click="gotothird">
          <ion-icon :icon="chatbubble" />
        </ion-tab-button>
      <ion-tab-button tab="tab4"  @click="gotofourth">
          <ion-icon :icon="camera" />
        </ion-tab-button>
        <ion-tab-button tab="tab5"  @click="gotofifth">
          <ion-icon :icon="person" />
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script >
import { IonTabBar, IonTabButton, IonTabs, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { search, chatbubble,home,camera,person} from 'ionicons/icons';
import{useRouter} from'vue-router'
export default {
  name: 'Tabs',
  components: {  IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage, IonRouterOutlet },
  setup() {
    const router=useRouter()
    let gotofifth=()=>{ router.push("/tabs/tab5")}
    let gotofourth=()=>{router.push("/tabs/tab4")}
    let gotothird=()=>{router.push("/tabs/tab3")}
    let gotofirst=()=>{router.push("/tabs/tab1")}
    let gotosecond=()=>{router.push("/tabs/tab2")}

    return {
      search, 
      chatbubble, 
      home,camera,person,gotofifth,gotofourth,gotothird,gotofirst,gotosecond
    }
  }
}
</script>