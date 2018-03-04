<template>
  <div>
    <div class="md-layout md-gutter md-alignment-top-center">
    <div class="md-layout-item md-size-95">
<search-form></search-form>  
</div>
  <div class="md-layout-item md-size-95">
<search-list></search-list> 
</div>
</div>
</div>  
  </template>
  
  <script>
import searchForm from '@/components/search/search-form'
import searchList from '@/components/search/search-list'
  export default {
    components:{
      "search-form":searchForm,
      "search-list":searchList
    }
  }
  </script>
  
  <style scoped>
    .md-layout-item {
    margin-top: 8px;
    margin-bottom: 8px;
    }
  </style>

