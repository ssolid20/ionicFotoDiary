<template>
<ion-page>

  <div class="welcome container">
    <ion-card style="box-shadow: 0px 0px">
      <ion-card-content>
        <div v-if="showLogin" > 
        <h1 class="font" style="color:black">Login</h1>
        <form @submit.prevent="handleSubmit" @keyup.enter="handleSubmit">

            <ion-item>
              <ion-label class="font" position="floating" >Email</ion-label>
              <ion-input class="font" type="email" required="true" v-model="email"></ion-input>
            </ion-item>

            <ion-item>
              <ion-label class="font" position="floating">Password</ion-label>
              <ion-input  type="password" required="true" v-model="password"></ion-input>
            </ion-item>

            <ion-button class="font" @click="handleSubmit"  type="submit" expand="full"> Log in</ion-button> 

            <div class="error">{{ error }}</div>

        </form>
          <ion-toast
          position="top"
            :is-open="toast"
            message="You successfully logged in"
            :duration="1500"
            @didDismiss="toast=false" 
          >
          </ion-toast>
        <p class="font">No account yet? <span @click="showLogin = false">Signup</span> instead.</p>


    </div>
      <div v-else >
        <h1 class="font" style="color:black">Sign up</h1>
       
          <form @submit.prevent="handleSubmit1" @keyup.enter="handleSubmit1">
            <ion-item>
              <ion-label class="font" position="floating" >Nickname</ion-label>
              <ion-input class="font" type="text" required="true" v-model="displayName"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label class="font" position="floating" >Email</ion-label>
              <ion-input class="font" type="email" required="true" v-model="email1"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Password</ion-label>
              <ion-input  type="password" required="true" v-model="password1"></ion-input>
            </ion-item>
            <ion-button class="font" @click="handleSubmit1"  type="submit" expand="full">Sign up</ion-button> 

            <div class="error">{{ error1 }}</div>
          </form>
          <ion-toast
          position="top"
            :is-open="toast"
            message="You successfully signed up"
            :duration="1500"
            @didDismiss="toast=false"
          >
          </ion-toast>
        <p class="font">Already registered? <span @click="showLogin = true">Login</span> instead.</p>
      </div>
      </ion-card-content>
    </ion-card>
  </div>
  
  </ion-page>
</template>

<script>
import useSignup from '../composables/useSignup'
import useLogin from '../composables/useLogin'
import {IonPage ,IonItem,IonLabel,IonInput,IonButton,IonCard,IonCardContent,IonToast}  from '@ionic/vue';
import { ref } from 'vue'
import { useRouter } from 'vue-router'
export default {
    components:{
      IonPage,IonItem,IonLabel,IonInput,IonButton,IonCard,IonCardContent,IonToast
    },
  setup() {

    const showLogin = ref(true)
    const email1 = ref('')
    const displayName = ref('')
    const password1 = ref('')
    let router = useRouter()
    const email = ref('')
    const password = ref('')
    const { error, login } = useLogin()
    const toast = ref(false)
    const handleSubmit = async () => {
      await login(email.value, password.value)
      if (!error.value) {
        //context.emit('login')
        toast.value=true
        console.log('siccess login')
        await router.go()
        router.push({name:'Home'})

      }
    }
    const { error1, signup } = useSignup()
    const handleSubmit1 = async () => {
      await signup(email1.value, password1.value, displayName.value)
      if (!error1.value) {
        //context.emit('signup')
        console.log('succsess')
        router.push({name:'Home'})

      }      
    }
    return { showLogin ,toast,handleSubmit,email1,email,password1,password,displayName,handleSubmit1,error,error1}
  }
}
</script>

<style scoped>

  .error{
    color: red;
    font-family: 'Hammersmith One', sans-serif;
  }

.font{font-family: 'Hammersmith One', sans-serif;}
.container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

</style>