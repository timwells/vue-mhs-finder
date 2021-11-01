<template>
  <div class="nhsuk-width-container">
    <main id="main-content" class="nhsuk-main-wrapper">
      <div class="nhsuk-u-reading-width">
        <div class="nhsuk-back-link">
          <router-link to="/find-gp">
            <svg
              class="nhsuk-icon nhsuk-icon__chevron-left"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              aria-hidden="true">
              <path
                d="M8.5 12c0-.3.1-.5.3-.7l5-5c.4-.4 1-.4 1.4 0s.4 1 0 1.4L10.9 12l4.3 4.3c.4.4.4 1 0 1.4s-1 .4-1.4 0l-5-5c-.2-.2-.3-.4-.3-.7z"
              > </path>
            </svg>
          </router-link>
        </div>

        <div v-if="gpSearchResults">
          <h1>Select your GP to see available services</h1>
          <h2 class="nhsuk-body-l">
            <span role="text">
              We found <span class="results__count">{{ gpSearchResults.length }}</span> GP surgeries using '{{gpSearchTerm}}''.
            </span>
          </h2>
          <p role="text">If your surgery is not here, check your spelling and <a class="results__search__again" href="/find-gp">search again</a>.</p>
          <div>
            <ol class="nhsuk-list inline-list">
              <li v-for="gp in gpSearchResults"
                :key="gp.SearchKey"
                class="nhsuk-c-panel results__item"
                data-index="1">
                <hr />
                <div>
                  <h3 class="results__name">
                    <span role="text">{{ gp.OrganisationName }}</span>
                  </h3>
                  <p class="results__address" role="text">{{gp.Address1}},{{gp.Address2}},{{gp.City}},{{gp.Postcode}}</p>
                  <p>
                    <a @click="gpLinkClicked(gp.OrganisationName,gp.Latitude,gp.Longitude)">
                      <span class="nhsuk-u-visually-hidden">{{ gp.OrganisationName }}</span>
                      <span aria-hidden="true">This</span> is my GP
                    </a>
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "FindGPSearchResults",
  computed: {
    ...mapState("search", [
      "gpSearchResults",
      "gpSearchTerm",
      "mentalHealthProviderResults"
    ])
  },
  watch: {
    mentalHealthProviderResults(n) {
    console.log("mentalHealthProviderResults",n)
      if (n !== null) {
        // Result Available -> route to display
        this.$router.push({ name: "FindMentalHealthResults"});
      }
    }
  },
  methods: {
    gpLinkClicked(org, lat, lng) {
      console.log("gpLinkClicked", org, lat, lng);      
      this.$store.dispatch("search/getSearchMentalHealthProvidersByCatchment", {
          lat: lat,
          lng: lng,
      });

}
  }
};
</script>

<style>
 a { cursor: pointer; }

</style>
