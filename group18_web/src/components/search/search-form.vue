<template>
  <form method="POST" action="http://localhost:8081/api/nobleGasBindings/search" @submit.prevent="search" class="md-layout">
    <md-card class="md-layout-item md-elevation-3">
    <md-toolbar>
      <div class="md-title">Query</div>
    </md-toolbar>

    <md-card-content>
      <div class="md-layout md-gutter md-alignment-left">

        <div class="md-layout-item">
          <md-field md-clearable v-bind:class="{'md-invalid': errors.has('pdb') }">
            <label for="pdb">PDB</label>
            <md-input type="text" name='pdb' ref="pdb" v-validate="'max:4'" v-model="searchQuery.pdb"/>
            <span class="md-error" v-show="errors.has('pdb')" >{{ errors.first('pdb') }}</span>
          </md-field>
          <md-subheader>N Atoms</md-subheader>
          <md-field md-clearable  v-bind:class="{'md-invalid': errors.has('min_n_atoms') }">
            <label for="min_n_atoms">Min</label>
            <md-input type="text" name='min_n_atoms' v-validate="'numeric'" v-model="searchQuery.min_n_atoms"/>
            <span class="md-error" v-show="errors.has('min_n_atoms')" >{{ errors.first('min_n_atoms') }}</span>
          </md-field>
          <md-field md-clearable  v-bind:class="{'md-invalid': errors.has('max_n_atoms') }">
            <label for="max_n_atoms">Max</label>
            <md-input type="text" name='max_n_atoms' v-validate="'numeric'" v-model="searchQuery.max_n_atoms"/>
            <span class="md-error" v-show="errors.has('max_n_atoms')" >{{ errors.first('max_n_atoms') }}</span>
          </md-field>
        </div>

        <div class="md-layout-item">   
          <md-subheader>Binding Site</md-subheader>   
          <md-field md-clearable  v-bind:class="{'md-invalid': errors.has('element') }">
            <label for="element">Element</label>
            <md-select type="text" name='element' ref="element" v-validate="" v-model="searchQuery.element">
              <md-option value=""></md-option>
              <md-option value="He">Helium</md-option>
              <md-option value="Ne">Neon</md-option>
              <md-option value="Ar">Argon</md-option>
              <md-option value="Kr">Krypton</md-option>
              <md-option value="Xe">Xenon</md-option>
            </md-select>
            <span class="md-error" v-show="errors.has('element')" >{{ errors.first('element') }}</span>
          </md-field>  
          <md-field md-clearable  v-bind:class="{'md-invalid': errors.has('min_binding_energy') }"> 
            <label for="min_binding_energy">Min Energy (kcal/mol)</label>
            <md-input type="text" name='min_binding_energy' v-validate="'numeric'" v-model="searchQuery.min_binding_energy"/>
            <span class="md-error" v-show="errors.has('min_binding_energy')" >{{ errors.first('min_binding_energy') }}</span>
          </md-field>
          <md-field md-clearable  v-bind:class="{'md-invalid': errors.has('max_binding_energy') }">
            <label for="max_binding_energy">Max Energy (kcal/mol)</label>
            <md-input type="text" name='max_binding_energy' v-validate="'numeric'" v-model="searchQuery.max_binding_energy"/>
            <span class="md-error" v-show="errors.has('max_binding_energy')" >{{ errors.first('max_binding_energy') }}</span>
          </md-field>
        </div>

        <div class="md-layout-item">
          <md-subheader>Protein</md-subheader>
          <md-field md-clearable  v-bind:class="{'md-invalid': errors.has('protein_type') }">
            <label for="element">Type</label>
            <md-input type="text" name='protein_type' v-validate="" v-model="searchQuery.protein_type"/>
            <span class="md-error" v-show="errors.has('protein_type')" >{{ errors.first('protein_type') }}</span>
          </md-field>
          <md-field md-clearable v-bind:class="{'md-invalid': errors.has('protein_description') }">
            <label for="protein_description">Description</label>
            <md-input type="text" name='protein_description' v-validate="" v-model="searchQuery.protein_description"/>
            <span class="md-error" v-show="errors.has('protein_description')" >{{ errors.first('protein_description') }}</span>
          </md-field>
        </div>

        <div class="md-layout-item"  v-bind:class="{'md-invalid': errors.has('has_ligand') }">
          <md-subheader>
            <md-checkbox type="text" name='has_ligand' v-model="searchQuery.has_ligand"/>
            Ligand
          </md-subheader>        
          <md-field md-clearable  v-bind:class="{'md-invalid': errors.has('ligand') }">
            <label for="ligand">Component Id</label>
            <md-input type="text" name='ligand'  v-validate="'max:3'" v-model="searchQuery.ligand"/>
            <span class="md-error" v-show="errors.has('ligand')" >{{ errors.first('ligand') }}</span>
          </md-field>
          <md-field md-clearable  v-bind:class="{'md-invalid': errors.has('ligand_name') }">
            <label for="ligand_name">Name</label>
            <md-input type="text" name='ligand_name' v-validate="" v-model="searchQuery.ligand_name"/>
            <span class="md-error" v-show="errors.has('ligand_name')" >{{ errors.first('ligand_name') }}</span>
          </md-field>
        </div>
      </div>
    <md-button type="submit" class="md-accent">{{buttonText}}</md-button>
    <md-button type="button" class="md-primary" @click="clearForm">Cancel</md-button>
    </md-card-content>
    </md-card>
  </form>
</template>
<script>
const SEARCH = "Search"

export default {
  name: "search-form",
  data() {
    return {
      isSubmitted: false,
      buttonText: SEARCH,
      searchQuery: {}
    };
  },
  methods: {
    async search() {
      Window.Event.$emit("refreshSearch",this.searchQuery)
    },
    clearForm() {      
      this.isSubmitted = false
      this.searchQuery = {};
      this.buttonText = SEARCH
      this.$refs.pdb.$el.focus()
      this.errors.clear()
      Window.Event.$emit("refreshSearch",this.searchQuery )
    }
  },
  mounted() {
    this.$refs.pdb.$el.focus()
    Window.Event.$on("search", this.search);
  }
};
</script>
<style scoped>

</style>
