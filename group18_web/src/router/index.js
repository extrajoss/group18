import Vue from 'vue'
import Router from 'vue-router'
import search from '@/components/tabs/search'
import home from '@/components/tabs/home'
import pdb from '@/components/tabs/pdb'
import login from '@/components/tabs/login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/Home',
      name: 'home',
      component: home
    },
    {
      path: '/Search',
      name: 'search',
      component: search
    },
    {
      path: '/PDB',
      name: 'pdb',
      component: pdb
    },
    {
      path: '/Login',
      name: 'login',
      component: login
    }
  ]
})
