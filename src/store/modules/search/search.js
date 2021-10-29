import axios from "axios";

// https://api.getthedata.com/postcode/SW1A+1AA
const _api = " https://api.getthedata.com/postcode/";

const state = {
  postCodeResult: null,
  mhResults: null,
  mhTestCase: {}
};

const getters = {
  // selectedSystem: state => state.selectedSystem
};

const mutations = {
  SET_POSTCODE: (state, payload) => (state.postCodeResult = payload),
  SET_MH_TESTCASE: (state, payload) => (state.mhTestCase = payload),
  SET_MH_RESULTS: (state, payload) => (state.mhResults = payload)
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
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
