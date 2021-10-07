import { ref } from 'vue'
import  firebase  from '../firebase'

// declare the connection & refs inside the function
// because the collection state is not global (like a user)
// different collections may be used at once this way
let {projectFirestore} =firebase
const useCollection = (collection) => {

  const error1 = ref(null)

  const addDoc = async (doc) => {
    error1.value = null

    try {
      await projectFirestore.collection(collection).add(doc)
    }
    catch(err) {
      console.log(err.message)
      error1.value = 'could not send the message'
    }
  }

  return { error1, addDoc }

}

export default useCollection