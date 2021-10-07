import { ref } from 'vue';
import firebase from '../firebase';

const error = ref(null)
const {projectAuth} = firebase
const login = async (email, password) => {
  error.value = null

  try {
    // INTERNAL TIMER MAY CAUSE EXTRA ERROR IN THE CONSOLE WHEN USING AWAIT
    // FIREBASE WILL OVERHAUL IN THE FUTURE & EVERYTHING STILL WORKS
    const res = await projectAuth.signInWithEmailAndPassword(email, password)
    error.value = null
    return res
  }
  catch(err) {
    console.log(err.message)
    error.value = 'Incorrect login credentials'
  }
}

const useLogin = () => {
  return { error, login };
}

export default useLogin
