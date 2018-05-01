<template>
  <div id="app">
    <v-app>
    <v-tabs dark>
      <v-tab id="tab-home" to="/home" router>Home
      </v-tab>
      <v-tab id="tab-search" to="/search" router>Search
      </v-tab>
      <v-tab id="tab-view" to="/view" router>View
      </v-tab>
      <v-tab id="tab-login" to="/login" router>Login
      </v-tab>
    </v-tabs>
    <router-view/>
    </v-app>
  </div>
</template>

<script>
import Vue from 'vue'
import Vuetify from 'vuetify'

import 'vuetify/dist/vuetify.min.css'
 
Vue.use(Vuetify)

Window.Event = new Vue()

export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
</style>
