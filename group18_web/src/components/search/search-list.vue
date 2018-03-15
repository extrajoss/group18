<template>
<div>  
  <md-dialog :md-active.sync="doingWork" :md-close-on-esc=false :md-click-outside-to-close=false>
    <md-dialog-title style="text-align:center;">Working...</md-dialog-title>
    <md-content>
      <div class="md-layout md-alignment-top-center">
        <div class="md-layout-item"> 
        </div>
        <div class="md-layout-item">          
          <md-progress-spinner md-mode="indeterminate">            
          </md-progress-spinner>
        </div>
        <div class="md-layout-item"> 
        </div>
      </div>
    </md-content>
  </md-dialog>
      <md-card class="md-layout-item md-elevation-3">
    <md-toolbar>
      <div class="md-title">Results</div>
    </md-toolbar>

    <md-card-content>
    <md-table 
      v-model="searchResults" 
    :md-sort.sync="sortField" 
    :md-sort-order.sync="sortOrder" 
    :md-sort-fn="onSort" 
    >
      <md-table-empty-state md-label="No matching binding sites found for this search" :md-description="`${searchError}`">        
      </md-table-empty-state>
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Element" md-sort-by="element">{{ item.element }}</md-table-cell>
        <md-table-cell md-label="PDB" md-sort-by="pdb"><a :href="`/#/view?pdb=${item.pdb}`">{{ item.pdb }}</a></md-table-cell>
        <md-table-cell md-label="N Atoms" md-numeric md-sort-by="n_atoms">{{ item.n_atoms }}</md-table-cell>
        <md-table-cell md-label="Binding Energy" md-numeric  md-sort-by="binding_energy">{{ item.binding_energy }}</md-table-cell>
        <md-table-cell md-label="Ligand" md-sort-by="ligand_name">{{ item.ligand_name }}</md-table-cell>
        <md-table-cell md-label="Ligand Id" md-sort-by="ligand">{{ item.ligand }}</md-table-cell>
        <md-table-cell md-label="Type" md-sort-by="protein_type">{{ item.protein_type }}</md-table-cell>
        <md-table-cell md-label="Description" md-sort-by="protein_description">{{ item.protein_description }}</md-table-cell>        
      </md-table-row>
      <md-table-pagination
        :md-page-size=size
        :md-total=total
        :md-page=page
        md-label="Rows"
        md-separator="of"
        :md-page-options="[5, 10, 25, 50]"
      >
      </md-table-pagination>
    </md-table>
        </md-card-content>
    </md-card>
</div>
</template>
<script>
export default {
  data() {
    return {
      total:0,
      page:1,
      size:5,
      sortField:"pdb",
      sortOrder:"asc",
      searchResults: [],
      searchQuery:{},
      searchError:"",
      doingWork:true
    };
  },
  methods:{
    onSort(value){
      this.refresh(this.searchQuery)
      return value
    },
    refresh(searchQuery){
      this.doingWork = true
      this.searchError = ""
      if(searchQuery){
        this.searchQuery = searchQuery
      }
      this.searchQuery['limit'] = this.size
      this.searchQuery['offset'] = (this.page-1)*this.size
      this.searchQuery['sort'] = `${this.sortField} ${this.sortOrder.toUpperCase()}`
      var queryString = ""
      if(this.searchQuery){
        queryString ="?"+ Object.entries(this.searchQuery).filter(([key,value])=>{ return value}).map(([key,value]) => key + '=' + value).join('&')
      }
      var url = 'http://localhost:8081/api/nobleGasBindings/search' + queryString
      axios.get(url).then(response => {
        if(response.data.error){
          this.total = 0
          this.searchResults = {}
          //TODO: need to improve error message
          this.searchError = JSON.stringify(response.data.error, null, 2)
        }else{
          this.total = response.data.count
          this.searchResults = response.data.rows
          if(this.total == 0){
            this.searchError = `Try a different set of search terms.${JSON.stringify(searchQuery, null, 2)}`
          }
        }
        this.doingWork = false
      })
    }
  },
  mounted(){
    Window.Event.$on('refreshSearch', (query)=>{
      this.refresh(query)
    } );
    Window.Event.$emit("refreshSearch")
  }
};
</script>
<style scoped>

</style>
