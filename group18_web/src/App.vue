<template>
  <div id="app">
    <md-tabs md-sync-route>
      <md-tab id="tab-home" md-label="Home" to="/home">
      </md-tab>
      <md-tab id="tab-search" md-label="Search" to="/search">
      </md-tab>
      <md-tab id="tab-view" md-label="View" to="/view">
      </md-tab>
      <md-tab id="tab-login" md-label="Login" to="/login">
      </md-tab>
    </md-tabs>
    <router-view/>
  </div>
</template>

<script>
import Vue from 'vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/black-green-light.css'
Vue.use(VueMaterial)

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
  margin-top: 60px;
}
</style>
