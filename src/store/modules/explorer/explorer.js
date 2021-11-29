import axios from "axios";
import { ORG_INDEX_HEADERS_API2, ORG_INDEX_SEARCH_API2 } from "../../common/common" 

const state = {
  allIAPTResults : null,
  allGPResults : null
};

const getters = {
};

const mutations = {
  SET_IAPT_SEARCH_RESULTS: (state, payload) => {
    if(payload) {
      payload.forEach((e,i) => { e.index = i+1; });
    }
    state.allIAPTResults = payload;
  },
  SET_GP_SEARCH_RESULTS: (state, payload) => {
    if(payload) {
      payload.forEach((e,i) => { e.index = i+1; });
    }
    state.allGPResults = payload;
  }
}

const actions = {
  postSearchAllIAPTs({commit}) {
    let reqParameters = {
        // filter: "OrganisationTypeId eq 'CLI'",
        filter: "(Services/any(l: l/ServiceCode eq 'SRV0339')) and (OrganisationTypeId ne 'TRU')",
        orderby: "OrganisationName",
        select: "OrganisationName,Email,Website,Phone,OrganisationTypeId,Address1,Address2,Address3,City,County,Postcode,Latitude,Longitude,ODSCode,SearchKey,RelatedIAPTCCGs,Services",
        top:500,
        count: true
    };
    commit("SET_IAPT_SEARCH_RESULTS", null);
    axios.post(ORG_INDEX_SEARCH_API2, reqParameters, ORG_INDEX_HEADERS_API2).then(resp => {
      commit("SET_IAPT_SEARCH_RESULTS", resp.data.value);
    });
  },

  postSearchAllGPs({commit}) {
    let reqParameters = {
        // filter: "OrganisationTypeId eq 'CLI'",
        filter: "OrganisationTypeId eq 'GPB'",
        orderby: "OrganisationName",
        select: "OrganisationName,OrganisationTypeId,Address1,Address2,Address3,City,County,Postcode,ODSCode,SearchKey,CCG,Latitude,Longitude",
        top:2000,
        count: true
    };
    commit("SET_GP_SEARCH_RESULTS", null);
    axios.post(ORG_INDEX_SEARCH_API2, reqParameters, ORG_INDEX_HEADERS_API2).then(resp => {
      commit("SET_GP_SEARCH_RESULTS", resp.data.value);
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

