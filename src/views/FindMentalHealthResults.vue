<template>
  <div class="nhsuk-width-container">
    <main id="main-content" class="nhsuk-main-wrapper">
      <div class="nhsuk-u-reading-width">
        <div class="nhsuk-back-link">
          <router-link to="/find-gp-search-results">
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
        <div v-if="mentalHealthProviderResults">
          <h1>Contact a psychological therapies service</h1>
          <h2 class="nhsuk-body-l">
            <span role="text">
              <span class="results__count">{{ mentalHealthProviderResults.length }}</span> service(s) are available for location.
            </span>
          </h2>
          <div class="nhsuk-inset-text">
            <span class="nhsuk-u-visually-hidden">Information: </span>
            <p>
              Please note: If your GP is in London, please select the service in
              the borough where your GP is based.
            </p>
            <p>You may not be eligible for the other services being shown.</p>
            <p>We are working to fix this as soon as possible.</p>
          </div>

          <details class="nhsuk-details debug" nhsuk-polyfilled="true" id="nhsuk-details">
            <summary class="nhsuk-details__summary" 
              role="button" aria-controls="nhsuk-details__text0" tabindex="0" :aria-expanded="bPermissionNoteExapand">
              <span class="nhsuk-details__summary-text">API Performance</span>
            </summary>
            <div class="nhsuk-details__text debug" id="nhsuk-details__text0" aria-hidden="false">
                <p class="page-perf-debug"><b>API:</b> {{ mentalHealthProviderReqAPI }}</p>
                <p class="page-perf-debug"><b>Req/Resp:</b> {{ mentalHealthProviderRespPerf }} ms</p>
            </div>
          </details>

          <div>
            <ol class="nhsuk-list inline-list">
              <li
                v-for="provider in mentalHealthProviderResults"
                :key="provider.OrganisationName"
                class="nhsuk-c-panel results__item"
                data-index="1"
              >
                <hr />
                <div>
                  <h3 class="results__name">
                    <span v-if="provider.organisationName">{{ provider.organisationName }}</span>
                    <span v-else class="error-item">???</span>
                    </h3>
                  <p class="results__website">
                    <a href="#">Visit website
                      <span class="nhsuk-u-visually-hidden">
                        <span v-if="provider.website">{{provider.website}} website</span>
                        <span v-else class="error-item">? website</span>
                      </span>
                    </a>
                  </p>

                  <p class="results__telephone">Telephone:
                    <a href="#" class="telephone_tracking">
                      <span v-if="provider.phone">{{provider.phone}}</span>
                      <span v-else class="error-item">?</span>
                    </a>
                  </p>

                  <p class="results__email">Email:
                    <a href="mailto:a@b.com">
                      <span v-if="provider.email">{{provider.email}}</span>
                      <span v-else class="error-item">?</span>
                    </a>
                  </p>

                  <div class="nhsuk-action-link results__self__referral">
                    <a class="nhsuk-action-link__link" href="#">
                      <svg
                        class="nhsuk-icon nhsuk-icon__arrow-right-circle"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M0 0h24v24H0z" fill="none"></path>
                        <path
                          d="M12 2a10 10 0 0 0-9.95 9h11.64L9.74 7.05a1 1 0 0 1 1.41-1.41l5.66 5.65a1 1 0 0 1 0 1.42l-5.66 5.65a1 1 0 0 1-1.41 0 1 1 0 0 1 0-1.41L13.69 13H2.05A10 10 0 1 0 12 2z"
                        ></path>
                      </svg>
                      <span class="nhsuk-action-link__text"
                        >Refer yourself online<span class="nhsuk-u-visually-hidden" v-if="provider.organisationName">{{ provider.organisationName }}</span
                        >
                      </span>
                    </a>
                  </div>
                  <details class="nhsuk-details debug" nhsuk-polyfilled="true" id="nhsuk-details">
                    <summary class="nhsuk-details__summary" 
                      role="button" aria-controls="nhsuk-details__text0" tabindex="0" :aria-expanded="bPermissionNoteExapand">
                      <span class="nhsuk-details__summary-text">Debug section</span>
                    </summary>
                    <div class="nhsuk-details__text debug" id="nhsuk-details__text0" aria-hidden="false">
                        <p class="debug">
                            <span v-if="provider.organisationName">The organisation <b>{{ provider.organisationName}} </b>
                              is one of the {{ mentalHealthProviderResults.length }} eligible IAPT Services available having:</span>
                            <span v-else class="error-item">Organisation: <b>?</b></span>
                        </p>
                        <p class="debug">
                          <span v-if="provider.odsCode>0">ODSCode: <b>{{ provider.odsCode }}</b></span>
                          <span v-else class="error-item">ODSCode: <b>?</b></span>
                        </p>
                        <p class="debug">
                          <span v-if="provider.referralURL">referralURL: <b>{{ provider.referralURL }}</b></span>
                          <span v-else class="error-item">referralURL: <b>?</b></span>
                        </p>
                        <p class="debug">
                          <span v-if="provider.website">Website<b>{{ provider.website }}</b></span>
                          <span v-else class="error-item">Website: <b>?</b></span>
                        </p>
                        <p class="debug">
                          <span v-if="provider.location">Latitude: <b>{{ provider.location.position.latitude }}</b></span>
                          <span v-else class="error-item">Latitude: <b>?</b></span>                          
                        </p> 
                        <p class="debug">
                          <span v-if="provider.location">Longitude: <b>{{ provider.location.position.longitude }}</b></span>
                          <span v-else class="error-item">Longitude: <b>?</b></span>                          
                        </p> 
                    </div>
                  </details>
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
  name: "FindMentalHealthResults",
  computed: {
    ...mapState("search", [
      "mentalHealthProviderReqAPI",
      "mentalHealthProviderRespPerf",
      "mentalHealthProviderResults"
    ]),
  },
  data: () => ({
    bPermissionNoteExapand: false
  }),
  mounted() {
    // If no result goto GP input step
    if(!this.mentalHealthProviderResults) {
      this.$router.push({ name: "FindGP" });
    }
  }
};
</script>

<style>
.page-perf-debug {
  font-size: 14px;
  font-weight: 400;
  margin: 0;
}
.error-item {
  color: red;
}
</style>
