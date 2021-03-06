<template>
  <div style="height:85%;">
      <v-container grid-list-xl>
        <v-layout row wrap>
                          <v-flex sm8>
              <v-select
                combobox 
                label="Query"
                :items="querySelectItems"
                v-model="query"
                :filter="customFilter"
                :error-messages="errors.collect('query')"
                v-validate="''"
                hint="Space separated list of search terms. eg oxygen 1000:1200"
                persistent-hint
                data-vv-name="query"
                :loading="isWorking"
                item-text="text"
                item-value="value"
                return-object
                :search-input.sync="search"
              ></v-select> 
</v-flex>
                <v-flex sm2>
              <v-select
                label="PDB"
                :items="pdbSelectItems"
                v-model="pdb"
                :error-messages="errors.collect('pdb')"
                v-validate="'length:4'"
                data-vv-name="pdb"
                cache-items
                required
              ></v-select> 
</v-flex>
  <v-flex sm2>                
              <v-select
                combobox
                cache-items
                label="Energy Cutoff Set"
                :items="localEnergyCutoffSets"
                v-model="energyCutoffSet"
                :error-messages="errors.collect('energyCutoffSet')"
                v-validate="'isValidEnergyCutOffSet'"
                data-vv-name="energyCutoffSet"
              ></v-select> 
              </v-flex>
                      </v-layout>
              </v-container>
              <v-layout row wrap style="height:100%;">
                <v-flex xs12>
  <div id="jolecule" style="height:100%;"></div> 
  </v-flex>
  </v-layout>
  </div>
</template>
  
  <script>

  import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
  import {initEmbedJolecule} from '../../jolecule/main'
  import { Validator } from 'vee-validate';

  export default {     
    computed:{
      ...mapGetters([
        'energyCutoffSets',
        'elements',
        'searchQuery'
      ]),
      isWorking: {
        get () {
          return this.$store.state.isWorking
        },
        set(v) {
          this.$store.commit('SET_ISWORKING', v)
        }
      },
      pdb: {
        get () {
          return this.$store.state.pdb
        },
        set(v) {
          this.$store.commit('SET_PDB', v)
        }
      },
      energyCutoffSet: {
        get () {
          return this.$store.state.energyCutoffSet
        },
        set(v) {
          if(v){
            let value = v.value?v.value:v
            console.log("local","SET_ENERGYCUTOFFSET",v,value,this.isValidEnergyCutOffSet(value))
            if(this.isValidEnergyCutOffSet(value)){            
            this.$store.commit('SET_ENERGYCUTOFFSET', value)
            }
          }         
        }
      }  
    },
    data(){
      return{
        query:{text:'',value:''},
        search:null,
        pdbSelectItems:[],
        querySelectItems:[],
        customFilter (item, queryText, itemText) {
            return itemText
        },
        localEnergyCutoffSets:[]
      }
    },
    methods: {
      ...mapMutations([
        'SET_PDB',
        'SET_ENERGYCUTOFFSET'
      ]),
      isValidEnergyCutOffSet: function(value){
        let checkValue = value.value?value.value:value
        console.log("local","isValidEnergyCutOffSet",value,checkValue)
        return checkValue == "veryHigh" ||  checkValue == "high" ||  checkValue == "medium" ||  checkValue == "low" ||  ( checkValue <=-0.5 && checkValue >=-2.0 )
      },
      addDataServer: function ({embededJolecule,index}){
        let url = `http://localhost:8081/api/dataServer/${this.pdb}/${this.energyCutoffSet}/${index}/`
          axios.get(url).then(response => {
            let dataServerFn = response.data.replace("define(","(")   //this is a hack that I need to fix with bosco: need to return function not define #changed in jol-static
            let dataServer = eval(dataServerFn)
            console.log("local","dataserver",dataServer())
            embededJolecule.asyncAddDataServer(dataServer())        
          })
      },
      querySelections (query) {
        this.isWorking = true
        let url = `http://localhost:8081/api/nobleGasBindings/search?limit=10&query=${query}`
        axios.get(url).then(response => {
          console.log("local","autocompleteResults",response,response.data)
          let searchResults = []
          response.data.rows.forEach(row => {
            console.log("local",row)
            searchResults.push({'text':`[${row.pdb}]:${row.protein_type} - ${row.protein_description} (${row.binding_energy} kcal/mol)`,'value':row.pdb})
          });
          this.querySelectItems = searchResults
          this.isWorking = false
        })
      },
      reDisplayJolecule(){
      document.getElementById("jolecule").innerHTML = ""
      let j = initEmbedJolecule({
          divTag: '#jolecule',
          viewId: '',
          viewHeight: 100,
          isLoop: false,
          isGrid: true,
          isEditable: false,
        }) 
        let newURL = window.location.protocol + '//' + window.location.host
      + `/#/view?pdb=${this.pdb}&cutoff=${this.energyCutoffSet}`
      console.log("local","newurl",newURL,window.location.href)
      if(window.location.href != newURL){
        window.history.pushState(null,"",newURL)     
        console.log("local","url updated",newURL)
      }
      this.pdbSelectItems.push(this.pdb)  
      this.localEnergyCutoffSets.push(this.energyCutoffSet)    
      for(let i=0;i<=5;i++){
        this.addDataServer({
          embededJolecule: j,
          pdb: this.pdb,
          energyCutoffSet:this.energyCutoffSet,
          index: i
        })
      }
      //document.getElementById("jolecule-soup-display").style.height = "400px" //this is a hack that I need to fix with bosco: need to set height correctly
      } ,
      displayJolecule(){
        let pdb = this.$route.query.pdb
        let energyCutoffSet = this.$route.query.cutoff
        if(pdb && pdb>""){
          this.SET_PDB(pdb)
        }
        if(energyCutoffSet && energyCutoffSet>""){
          this.SET_ENERGYCUTOFFSET(energyCutoffSet)
        }
        this.localEnergyCutoffSets = this.energyCutoffSets
        this.localEnergyCutoffSets.push( { 'text':this.energyCutoffSet, 'value':this.energyCutoffSet } )
        this.reDisplayJolecule()
      }
    },
  watch: {
    search (val) {
      val && this.querySelections(val)
    },
    query (val) {      
      if(val.text && val.value){
        this.pdbSelectItems = [this.pdb]
        this.pdb = val.value     
      } 
    },
    energyCutoffSet: {
      handler() {
        this.reDisplayJolecule();
      },
      deep: true
    },
    pdb: {
      handler() {
        this.reDisplayJolecule();
      },
      deep: true
    },
    $route: {
      handler() {
        console.log("local","route change",this.$route,window.history)
        this.displayJolecule();
      },
      deep: true
    }
  }, 
    mounted(){ 
      Validator.extend('isValidEnergyCutOffSet', {
        getMessage: field => 'The ' + field + ' value is not a valid cutoff.',
        validate: value => {return this.isValidEnergyCutOffSet(value)}
      });
      this.displayJolecule();
    }
  }
  </script>
  
  <style scoped>
  </style>

