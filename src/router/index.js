import { createRouter, createWebHistory } from '@ionic/vue-router';
//import { RouteRecordRaw } from 'vue-router';
import Tabs from '../views/Tabs.vue'
import firebase from '../firebase'
import welcome from '@/views/Welcome.vue'
let {projectAuth} = firebase

const requireAuth = (to, from, next) => {
  let user = projectAuth.currentUser
  console.log('current user in auth guard: ', user)
  if (!user) {
    next({ name: 'welcome' })
  } else {
    next()
  }
}

const requireNoAuth = (to, from, next) => {
  let user = projectAuth.currentUser
  if (user) {
    next({ name: 'Home' })
  } else {
    next()
  }
}



const routes = [
  {
    path: '/home/',
    redirect: '/tabs/tab1',
    name:'Home',
    beforeEnter:requireAuth

  },

  {
    path: '/',
    name: 'welcome',
    component: welcome,
    beforeEnter:requireNoAuth
  },

  {
    path: '/tabs/',
    component: Tabs,
    beforeEnter:requireAuth,

    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3.vue')
      },
      {
        path: 'tab4',
        component: () => import('@/views/Tab4.vue')
      },
      {
        path: 'tab5',
        name:'you',
        component: () => import('@/views/Tab5.vue')
      },
      {
        path: 'tab6',
        component: () => import('@/views/editprofile.vue')
      },
      {
        path: 'tab7/:email',
        name: 'profileof',
        component: () => import('@/views/profileof.vue')
      },
      {
        path: 'tab8/:id',
        name: 'lookatfoto',
        component: () => import('@/views/lookatfoto.vue'),
      },
      {
        path: 'tab9/chat/:email',
        name: 'chat',
        component: () => import('@/views/chat.vue'),
      },


    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
