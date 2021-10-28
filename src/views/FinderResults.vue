<template>
  <div class="nhsuk-width-container">
    <main id="main-content" class="nhsuk-main-wrapper">
      <div class="nhsuk-u-reading-width">
        <div class="nhsuk-back-link">
          <router-link to="/find-by-location">
            <svg
              class="nhsuk-icon nhsuk-icon__chevron-left"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              aria-hidden="true">
              <path
                d="M8.5 12c0-.3.1-.5.3-.7l5-5c.4-.4 1-.4 1.4 0s.4 1 0 1.4L10.9 12l4.3 4.3c.4.4.4 1 0 1.4s-1 .4-1.4 0l-5-5c-.2-.2-.3-.4-.3-.7z"
              ></path>
            </svg>
            </router-link>
        </div>        
        <h1>Contact a psychological therapies service</h1>
        <h2 class="nhsuk-body-l">
          <span role="text">
            <span class="results__count">{{mhResults.length}}</span> service(s) are available for location.
          </span>
        </h2>
        <p class="small-test-note" v-if="mhTestCase">{{mhTestCase}}</p>
        <div class="nhsuk-inset-text">
          <span class="nhsuk-u-visually-hidden">Information: </span>
          <p>
            Please note: If your GP is in London, please select the service in
            the borough where your GP is based.
          </p>
          <p>You may not be eligible for the other services being shown.</p>
          <p>We are working to fix this as soon as possible.</p>
        </div>
        <div>
          <ol class="nhsuk-list inline-list">
            <li v-for="mhOption in mhResults" :key="mhOption.OrganisationName" class="nhsuk-c-panel results__item" data-index="1">
              <hr />
              <div>
                <h3 class="results__name">{{mhOption.OrganisationName}}</h3>
                <p class="results__website">
                  <a href="#">Visit<span class="nhsuk-u-visually-hidden">{{mhOption.OrganisationName}}</span>website</a>
                </p>

                <p class="results__telephone">
                  Telephone:<a href="#" class="telephone_tracking">{{mhOption.phone}}</a>
                </p>

                <p class="results__email">
                  Email:<a href="mailto:hillingdontalkingtherapies.cnwl@nhs.net">{{mhOption.email}}</a>
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
                    <span 
                      class="nhsuk-action-link__text">Refer yourself online<span class="nhsuk-u-visually-hidden">{{mhOption.OrganisationName}}</span>
                    </span>
                  </a>
                </div>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "FinderResults",
  computed: {
    ...mapState("search", [
      "postCodeResult",
      "mhTestCase",
      "mhResults"
    ])
  },
};
</script>

<style>
span.small-test-note {
  color: yellow;
  background-color: black;
  font-size: smaller;
}
p.small-test-note {
  color: green;
  font-size: small;
}

</style>
