import axios from "axios";

// https://api.getthedata.com/postcode/SW1A+1AA
const _api1 = "https://api.getthedata.com/postcode/";
const _api2 = "https://api.nhs.uk/service-search/search?api-version=2";
// const _api2 = "https://nhsuk-apim-int-uks.azure-api.net/service-search/organisationprofiles/search?api-version=1";
const _api3 = "https://catchment-area-service.azurewebsites.net/eligibilityregion/fake"

// https://catchment-area-service.azurewebsites.net/serviceprovider/point?lat=51.3619384765625&lon=-0.5259902477264404
const _api4 = "https://catchment-area-service.azurewebsites.net/serviceprovider/point"

const _headers = {
  headers: {
    // "subscription-key": "0649ea6318e9425eb972e2e4c385cdb9",
    "subscription-key": process.env.VUE_APP_NHS_SEARCH_API_V2_KEY,
    "Content-Type": "application/json"
  }
};

const state = {
  postCodeResult: null,
  mhTestCase: {},

  gpSearchTerm: "",
  gpSearchResults: null,

  mentalHealthProviderResults: null,  
  mentalHealthProviderReqAPI: "",
  mentalHealthProviderRespPerf: 0,

  gpSearchReqAPI: "",
  gpSearchRespPerf: 0,
  gpSearchReqBody: "",

  request: "",
  response: "",

  iaptResults: null
};

const getters = {
  // selectedSystem: state => state.selectedSystem
};

const mutations = {
  SET_POSTCODE: (state, payload) => (state.postCodeResult = payload),
  SET_MH_TESTCASE: (state, payload) => (state.mhTestCase = payload),

  SET_SEARCH_MENTAL_HEALTH_PROVIDERS_BY_CATCHMENT_REQ_API: 
    (state, payload) => (state.mentalHealthProviderReqAPI = payload),
  SET_SEARCH_MENTAL_HEALTH_PROVIDERS_BY_CATCHMENT_RESP_PERF: 
    (state, payload) => (state.mentalHealthProviderRespPerf = payload),
  SET_SEARCH_MENTAL_HEALTH_PROVIDERS_BY_CATCHMENT_RESULTS: 
    (state, payload) => (state.mentalHealthProviderResults = payload),

  SET_GP_SEARCH_TERM: (state, payload) => (state.gpSearchTerm = payload),
  SET_GP_SEARCH_RESULTS: (state, payload) => (state.gpSearchResults = payload),
  SET_GP_SEARCH_REQ_API: 
    (state, payload) => (state.gpSearchReqAPI = payload),
  SET_GP_SEARCH_REQ_BODY: 
    (state, payload) => (state.gpSearchReqBody = payload),
  SET_GP_SEARCH_RESP_PERF: 
    (state, payload) => (state.gpSearchRespPerf = payload),

  SET_IAPTP_REQ: 
    (state, payload) => (state.request = payload),
  SET_IAPTP_RESP: 
    (state, payload) => (state.response = payload),
  
  SET_IAPT_RESULTS: (state, payload) => (state.iaptResults = payload)
};

const actions = {
  // http://api.getthedata.com/postcode/SW1A+1AA
  getPostCode({ commit }, { postCode }) {
    commit("SET_POSTCODE", null);
    axios.get(_api1 + postCode).then(resp => {
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
    // console.log("resetFinder");
    commit("SET_GP_SEARCH_RESULTS", null);
    commit("SET_GP_SEARCH_TERM", "");
    commit("SET_SEARCH_MENTAL_HEALTH_PROVIDERS_BY_CATCHMENT_RESULTS", null);
  },
  postSearchGP({commit},{ search = ""}) {
    // console.log("postSearchGP:",search)
    let reqParameters = {
        filter: "OrganisationTypeId eq 'GPB'",
        searchFields: "OrganisationName,OrganisationAliases/OrganisationAlias,Address1,Address2,Address3",
        search: search,
        select: "OrganisationName,Address1,Address2,Address3,City,County,Postcode,Latitude,Longitude,ODSCode,SearchKey",
        top: 25,
        skip: 0,
        count: true
    };
    // Add interceptors for the the request/response performance
    // Record start time of request
    axios.interceptors.request.use(function (config) {
      config.metadata = { startTime: new Date()}
      return config;
    }, function (error) {
      return Promise.reject(error);
    });
 
    axios.interceptors.response.use(function (response) {
      response.config.metadata.endTime = new Date()
      response.duration = response.config.metadata.endTime - response.config.metadata.startTime
      return response;
    }, function (error) {
      error.config.metadata.endTime = new Date();
      error.duration = error.config.metadata.endTime - error.config.metadata.startTime;
      return Promise.reject(error);
    });

    // Add interceptors for the the request/response
    // Request & Response Logging
    axios.interceptors.request.use(request => {
      console.log('Starting Request', JSON.stringify(request, null, 2))
      return request
    })
    axios.interceptors.response.use(response => {
      console.log('Response:', JSON.stringify(response, null, 2))
      return response
    })

    commit("SET_GP_SEARCH_RESULTS", null);
    commit("SET_GP_SEARCH_TERM", "");
    axios.post(_api2, reqParameters, _headers).then(resp => {
      commit("SET_GP_SEARCH_TERM", search);
      commit("SET_GP_SEARCH_RESULTS", resp.data.value);
      commit("SET_GP_SEARCH_REQ_API", _api2)
      commit("SET_GP_SEARCH_REQ_BODY", reqParameters)
      commit("SET_GP_SEARCH_RESP_PERF", resp.duration)
      // console.log("postSearchGP:",resp.data.value);
    });
  },
  postSearchMentalHealthProvidersByCatchment({ commit }) {
    commit("SET_SEARCH_MENTAL_HEALTH_PROVIDERS_BY_CATCHMENT_RESULTS", null);
    axios.get(_api3).then(resp => {
      // console.log("postSearchMentalHealthProvidersByCatchment:",resp.data)
      commit("SET_SEARCH_MENTAL_HEALTH_PROVIDERS_BY_CATCHEMNT_RESULTS", resp.data);
     });
  },

  getSearchMentalHealthProvidersByCatchment({ commit }, { lat, lng }) {
    console.log("getSearchMentalHealthProvidersByCatchment","lat:",lat,"lng:", lng);
    let _api = `${_api4}?lat=${lat}&lon=${lng}`
    console.log("getSearchMentalHealthProvidersByCatchment",_api);
    commit("SET_SEARCH_MENTAL_HEALTH_PROVIDERS_BY_CATCHMENT_RESULTS", null);
    commit("SET_SEARCH_MENTAL_HEALTH_PROVIDERS_BY_CATCHMENT_REQ_API", _api);

    // Add interceptors for the the request/response performance
    // Record start time of request
    axios.interceptors.request.use(function (config) {
      config.metadata = { startTime: new Date()}
      return config;
    }, function (error) {
      return Promise.reject(error);
    });
 
    axios.interceptors.response.use(function (response) {
      response.config.metadata.endTime = new Date()
      response.duration = response.config.metadata.endTime - response.config.metadata.startTime
      return response;
    }, function (error) {
      error.config.metadata.endTime = new Date();
      error.duration = error.config.metadata.endTime - error.config.metadata.startTime;
      return Promise.reject(error);
    });

    // Add interceptors for the the request/response
    // Request & Response Logging
    axios.interceptors.request.use(request => {
      console.log('Starting Request', JSON.stringify(request, null, 2))
      commit("SET_IAPTP_REQ", request)
      return request
    })
    axios.interceptors.response.use(response => {
      console.log('Response:', JSON.stringify(response, null, 2))
      commit("SET_IAPTP_RESP", response)
      return response
    })

    axios.get(_api)
    .then(resp => {
      commit("SET_SEARCH_MENTAL_HEALTH_PROVIDERS_BY_CATCHMENT_RESP_PERF", resp.duration)
      commit("SET_SEARCH_MENTAL_HEALTH_PROVIDERS_BY_CATCHMENT_RESULTS", resp.data)
    });
  },

  getSearchCatchment({commit}) {
    commit("SET_IAPT_RESULTS", null);
    axios.get(_api3).then(resp => {
      console.log(resp.data)
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
