import { ref } from 'vue';
import firebase from '../firebase';

// refs & signup outside of exported function
// they don't need to be re-created every time we invoke useSignup
const error1 = ref(null);
const {projectAuth,projectFirestore} = firebase
const signup = async (email, password, displayName) => {
  error1.value = null

  try {
    const res = await projectAuth.createUserWithEmailAndPassword(email, password)
    if (!res) {
      throw new Error('Could not complete signup')
    }
    await res.user.updateProfile({ displayName })
    error1.value = null
    //test 
    projectFirestore.collection('allUsersThatSignedUp').add({email:email,displayName:displayName}).catch(err =>{
      console.log(err)
      })
    projectFirestore.collection(email).add({
      avatar:`https://avatars.dicebear.com/api/big-smile/${displayName}.svg`,
      email:email,
      subs:[],
      displayName:displayName,
      describtion:''
    }).catch(err =>{
      console.log(err)
      })
    return res
  }
  catch(err) {
    console.log(err.message)
    error1.value = err.message;
  }
}

const useSignup = () => {
  return { error1, signup }
}

export default useSignup
