import axios from "axios";
import { API_HEADERS, API2 } from "../../common/common" 

const state = {
  allIAPTResults : null
};

const getters = {
};

const mutations = {
  SET_IAPT_SEARCH_RESULTS: (state, payload) => {
    if(payload) {
      payload.forEach((e,i) => { e.index = i+1; });
    }
    state.allIAPTResults = payload;
  }
}

const actions = {
  postSearchAllIAPTs({commit}) {
    let reqParameters = {
        // filter: "OrganisationTypeId eq 'CLI'",
        filter: "(Services/any(l: l/ServiceCode eq 'SRV0339')) and (OrganisationTypeId ne 'TRU')",
        select: "OrganisationName,OrganisationTypeId,Address1,Address2,Address3,City,County,Postcode,Latitude,Longitude,ODSCode,SearchKey",
        top:500,
        count: true
    };
    commit("SET_IAPT_SEARCH_RESULTS", null);
    axios.post(API2, reqParameters, API_HEADERS).then(resp => {
      commit("SET_IAPT_SEARCH_RESULTS", resp.data.value);
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
