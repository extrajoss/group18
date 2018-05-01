import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isWorking: false,
    isSearchSubmitted: false,
    searchQuery: {},
    searchPagination: {
      sortBy: "pdb",
      descending: false,
      rowsPerPage: 10,
      totalItems: 0
    }, 
    searchResults: [],
    searchErrors: [],
    totalResults: 0,
    pdb: "1be9",
    energyCutoffSet: "high",
    dataServers: [],
    elements: [
      { value: "He", text: "Helium" },
      { value: "Ne", text: "Neon" },
      { value: "Ar", text: "Argon" },
      { value: "Kr", text: "Krypton" },
      { value: "Xe", text: "Xenon" }
    ],
    energyCutoffSets: [
      { value: "veryHigh", text: "veryHigh" },
      { value: "high", text: "high" },
      { value: "medium", text: "medium" },
      { value: "low", text: "low" }
    ]
  },
  getters: {
    errors: state => state.errors,
    isWorking: state => state.isWorking,
    isSearchSubmitted: state => state.isSearchSubmitted,
    searchQuery: state => state.searchQuery,
    searchPagination: state => state.searchPagination,
    searchResults: state => state.searchResults,
    searchErrors: state => state.searchErrors,
    totalResults: state => state.totalResults,
    pdb: state => state.pdb,
    energyCutoffSet: state => state.energyCutoffSet,
    energyCutoffSets: state => state.energyCutoffSets,
    elements: state => state.elements
  },
  mutations: {
    SET_ISWORKING: (state, isWorking)=>{
      state.isWorking = isWorking
    },
    SET_ISSEARCHSUBMITTED: (state, isSearchSubmitted)=>{
      state.isSearchSubmitted = isSearchSubmitted
    },
    SET_PDB: (state, pdb)=>{
      state.pdb = pdb
    },
    SET_ENERGYCUTOFFSET: (state, energyCutoffSet)=>{
      state.energyCutoffSet = energyCutoffSet
    }, 
    SET_SEARCHQUERY: (state, searchQuery)=>{
      state.searchQuery = searchQuery
    } , 
    SET_SEARCHPAGINATION: (state, searchPagination)=>{
      state.searchPagination = searchPagination
    } , 
    SET_DATASERVERS: (state, dataServers)=>{
      state.dataServers = dataServers
    } , 
    SET_SEARCHRESULTS: (state, searchResults)=>{
      state.searchResults = searchResults
    } , 
    SET_SEARCHERRORS: (state, searchErrors)=>{
      state.searchErrors = searchErrors
    } , 
    SET_TOTALRESULTS: (state, totalResults)=>{
      state.totalResults = totalResults
    } 
  },    
  actions: {
    async refreshDataServers({commit, state}){
      let dataServers = []
      for(let i=0;i<=5;i++){
        let url = `http://localhost:8081/api/dataServer/${state.pdb}/${state.energyCutoffSet}/${i}/`
        dataServers[i] = axios
          .get(url)
          .then(response => {
            let dataServerFn = response.data
            let dataServer = eval(dataServerFn)
            return dataServer 
          })
      }
      commit("SET_DATASERVERS",await Promise.all(dataServers))
    },
    async search({commit, state}){
      if (!state.searchQuery || !state.searchPagination) {
        commit("SET_SEARCHERRORS","No query found") 
        return
      }
      const { sortBy, descending, page, rowsPerPage } = state.searchPagination;
      var queryString = ""; 
      let searchQuery = state.searchQuery
      let searchPagination = state.searchPagination
      commit("SET_SEARCHPAGINATION",searchPagination)  
      commit("SET_ISWORKING",true)  
      commit("SET_SEARCHERRORS","") 
      searchQuery["limit"] = rowsPerPage
      searchQuery["offset"] = (page - 1) * rowsPerPage
      searchQuery["sort"] = sortBy ? `${sortBy} ${descending ? "DESC" : "ASC"}` : ""
      
      commit("SET_SEARCHQUERY",searchQuery) 
      queryString =
        "?" +
        Object.entries(searchQuery)
          .filter(([key, value]) => {
            return value;
          })
          .map(([key, value]) => key + "=" + value)
          .join("&");
      var url =
        "http://localhost:8081/api/nobleGasBindings/search" + queryString;
      console.log("getting response to", queryString);
      await axios.get(url).then(response => {
        if (response.data.error) {
          commit("SET_TOTALRESULTS",0) 
          commit("SET_SEARCHRESULTS",{}) 
          //TODO: need to improve error message
          commit("SET_SEARCHERRORS",JSON.stringify(response.data.error, null, 2))
        } else {
          commit("SET_TOTALRESULTS",response.data.count) 
          commit("SET_SEARCHRESULTS",response.data.rows) 
          if (state.totalResults == 0) {
            commit("SET_SEARCHERRORS",`Try a different set of search terms.${JSON.stringify(
              searchQuery,
              null,
              2
            )}`)
          }
        }
        searchPagination.totalItems = state.totalResults;  
        commit("SET_SEARCHPAGINATION",searchPagination)       
        commit("SET_ISWORKING",false)  
        console.log("got response", this);
      })
    },
    async updatePDB ({commit,dispatch}, pdb) {
      commit("SET_PDB",pdb)            
      await dispatch("refreshDataServers")
    },
    async updateEnergyCutOffSet ({commit,dispatch}, energyCutoffSet) {
      commit("SET_ENERGYCUTOFFSET",energyCutoffSet)      
      await dispatch("refreshDataServers")
    },
    async updateView ({commit,dispatch}, {pdb, energyCutOffSet}) {
      commit("SET_PDB",pdb)            
      commit("SET_ENERGYCUTOFFSET",energyCutoffSet)      
      await dispatch("refreshDataServers")
    }
  }
})
