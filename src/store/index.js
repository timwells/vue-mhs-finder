import Vue from "vue";
import Vuex from "vuex";

// Store Modules
import app from "./modules/app/app";
import search from "./modules/search/search";

Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    app,
    search
  }
});
