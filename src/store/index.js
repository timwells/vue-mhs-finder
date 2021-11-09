import Vue from "vue";
import Vuex from "vuex";

// Store Modules
import app from "./modules/app/app";
import search from "./modules/search/search";
import explorer from "./modules/explorer/explorer";

Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    app,
    search,
    explorer
  }
});
