<template>
<div id="jolecule"></div> 
  </template>
  
  <script>
  export default {
    data(){
      return     {
        name: "pdb"
      }
    },mounted(){ 
      (function() {
        require(
          ['../../../resources/js/jolecule.js'],
          function(jolecule) {
            var j = jolecule.initEmbedJolecule({
                divTag: '#jolecule',
                viewId: '',
                viewHeight: 60,
                isLoop: false,
                isGrid: false,
                isEditable: false,
              });
            require(
              ['../../../resources/js/dataserverExample.js'],
              function(dataServer) {
                j.addDataServer(dataServer);
              });
          });
      })();
    }
  }
  </script>
  
  <style scoped>
    .md-layout-item {
    margin-top: 8px;
    margin-bottom: 8px;
    }
  </style>

