const _version = "mhs-mock-demo-1.0";
const state = {
  version: _version,
};
const getters = {
  version: state => state.version
};

const mutations = {
  // SET_SELECTED_SYSTEM: (state, payload) => (state.selectedSystem = payload)
};

const actions = {
  //updateSelectedSystem: ({ commit }, newValue) =>
  //  commit("SET_SELECTED_SYSTEM", newValue)
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
