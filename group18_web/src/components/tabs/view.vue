<template>
<div id="jolecule"></div> 
  </template>
  
  <script>
  function addDataServer({embededJolecule,pdb,energyCutoffSet,index}){
    let url = `http://localhost:8081/api/dataServer/${pdb}/${energyCutoffSet}/${index}/`
      axios.get(url).then(response => {
        let dataServerFn = response.data.replace("define(","(")   //this is a hack that I need to fix with bosco: need to return function not define 
        let dataServer = eval(dataServerFn)
        embededJolecule.addDataServer(dataServer())        
      })
  }
  export default {
    data(){
      return     {
        name: "pdb",
        pdb: "1be9",
        energyCutoffSet: "high"
      }
    },mounted(){ 
      let pdb = this.$route.query.pdb
      let energyCutoffSet = this.$route.query.energyCutoffSet
      if(pdb && pdb>""){
        this.pdb = pdb
      }
      if(energyCutoffSet && energyCutoffSet>""){
        this.energyCutoffSet = energyCutoffSet
      }
      let j = jolecule.initEmbedJolecule({
          divTag: '#jolecule',
          viewId: '',
          viewHeight: 100,
          isLoop: false,
          isGrid: false,
          isEditable: false,
        })
      for(let i=0;i<=5;i++){
        addDataServer({
          embededJolecule: j,
          pdb: this.pdb,
          energyCutoffSet:this.energyCutoffSet,
          index: i
        })
      }
      document.getElementById("jolecule-protein-display").style.height = "1000px" //this is a hack that I need to fix with bosco: need to set height correctly
    }
  }
  </script>
  
  <style scoped>
    .md-layout-item {
    margin-top: 8px;
    margin-bottom: 8px;
    }
  </style>

