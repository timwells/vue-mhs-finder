import axios from "axios";

// https://api.getthedata.com/postcode/SW1A+1AA
const _api = "https://api.getthedata.com/postcode/";
const _api2 = "https://api.nhs.uk/service-search/search?api-version=2";
const _api3 = "https://catchment-area-service.azurewebsites.net/eligibilityregion/fake"
const _headers = {
  headers: {
    "subscription-key": "0649ea6318e9425eb972e2e4c385cdb9",
    "Content-Type": "application/json"
  }
};

const state = {
  postCodeResult: null,
  mhTestCase: {},

  gpSearchTerm: "",
  gpSearchResults: null,

  mentalHealthProviderResults: null,

  iaptResults: null
};

const getters = {
  // selectedSystem: state => state.selectedSystem
};

const mutations = {
  SET_POSTCODE: (state, payload) => (state.postCodeResult = payload),
  SET_MH_TESTCASE: (state, payload) => (state.mhTestCase = payload),

  SET_SEARCH_MENTAL_HEALTH_PROVIDERS_BY_CATCHEMENT_RESULTS: 
    (state, payload) => (state.mentalHealthProviderResults = payload),

  SET_GP_SEARCH_TERM: (state, payload) => (state.gpSearchTerm = payload),
  SET_GP_SEARCH_RESULTS: (state, payload) => (state.gpSearchResults = payload),
  
  SET_IAPT_RESULTS: (state, payload) => (state.iaptResults = payload)
};

const actions = {
  // http://api.getthedata.com/postcode/SW1A+1AA
  getPostCode({ commit }, { postCode }) {
    commit("SET_POSTCODE", null);
    axios.get(_api + postCode).then(resp => {
      commit("SET_POSTCODE", resp.data.data);
    });
  },
  postSearchByTestCase({commit}, { testCase }) {    
    commit("SET_POSTCODE", null);
    commit("SET_MH_RESULTS", null);
    commit("SET_MH_TESTCASE",testCase);
    axios.get(`/data/${testCase.name}.json`).then(resp => {
      commit("SET_MH_RESULTS", resp.data);
    });
  },
  postSearchByGeo({commit}) {    
    commit("SET_MH_RESULTS", null);
    commit("SET_MH_TESTCASE");
    axios.get(`/data/PC1.json`).then(resp => {
      commit("SET_MH_RESULTS", resp.data);
    });
  },
  resetFinder({commit}) {
    console.log("resetFinder");
    commit("SET_GP_SEARCH_RESULTS", null);
    commit("SET_GP_SEARCH_TERM", "");
    commit("SET_SEARCH_MENTAL_HEALTH_PROVIDERS_BY_CATCHEMENT_RESULTS", null);
  },
  postSearchGP({commit},{ search }) {

    console.log("postSearchGP:",search)
    
    let reqParameters = {
        filter: "OrganisationTypeId eq 'GPB'",
        orderby: "OrganisationName",
        searchFields: "OrganisationName,OrganisationAliases/OrganisationAlias,Address1,Address2,Address3,City",
        search: search,
        select: "OrganisationName,Address1,Address2,Address3,City,County,Postcode,Latitude,Longitude",
        top: 25,
        skip: 0,
        count: true
    };
    commit("SET_GP_SEARCH_RESULTS", null);
    commit("SET_GP_SEARCH_TERM", "");
    axios.post(_api2, reqParameters, _headers).then(resp => {
      commit("SET_GP_SEARCH_TERM", search);
      commit("SET_GP_SEARCH_RESULTS", resp.data.value);
      console.log("postSearchGP:",resp.data.value);
    });
  },
  postSearchMentalHealthProvidersByCatchement({ commit }) {
    commit("SET_SEARCH_MENTAL_HEALTH_PROVIDERS_BY_CATCHEMENT_RESULTS", null);
    axios.get(_api3).then(resp => {
      commit("SET_SEARCH_MENTAL_HEALTH_PROVIDERS_BY_CATCHEMENT_RESULTS", resp.data);
     });
  },

  getSearchCatchment({commit}) {
    commit("SET_IAPT_RESULTS", null);
    axios.get(_api3).then(resp => {
      commit("SET_IAPT_RESULTS", resp.data);
     });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
