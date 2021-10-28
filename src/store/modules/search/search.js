import axios from "axios";

// http://api.getthedata.com/postcode/SW1A+1AA
const _api = " http://api.getthedata.com/postcode/";

const state = {
  postCodeResult: {},
  mhResults: [],
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
  getPostCode({ commit }, { postCode }) {
    // http://api.getthedata.com/postcode/SW1A+1AA
    axios.get(_api + postCode).then(resp => {
      console.log(resp.data);
      commit("SET_POSTCODE", resp.data.data);
    });
  },
  postSearch({commit},{ testCase }) {    
    commit("SET_MH_RESULTS", []);
    commit("SET_MH_TESTCASE",testCase);
    axios.get(`/data/${testCase.name}.json`).then(resp => {
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
