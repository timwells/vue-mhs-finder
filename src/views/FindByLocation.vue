<template>
  <div class="nhsuk-width-container">
    <main class="nhsuk-main-wrapper" id="main-content">
      <div class="nhsuk-grid-row">
        <div class="nhsuk-grid-column-two-thirds">
          <h1>Find a Mental Health Service</h1>

          <!--div class="nhsuk-form-group nhsuk-form-group--error">
            <label class="nhsuk-label" for="example">Full name</label>
            <span class="nhsuk-error-message" id="example-error">Enter your full name</span>
            <input
              class="nhsuk-input nhsuk-input--error"
              id="example"
              name="example"
              type="text"
              aria-describedby="example-error"
            />
          </div-->

          <!--div :class="inputError ? 'nhsuk-form-group nhsuk-form-group--error': 'nhsuk-form-group'" -->
          <div class="nhsuk-form-group" :class="inputError ? 'nhsuk-form-group--error': ''" >
            <label class="nhsuk-label" for="Location"
              >Enter a town, city or postcode in England</label>
            <span v-if="inputError" class="nhsuk-error-message" id="example-error">Please enter a search value</span>
            <input
              class="nhsuk-input nhsuk-input--width-20"
              type="text"
              id="Location"
              name="Location"
              value=""
              @keyup.enter="onSearchEnter($event)"
              v-model="searchText"
            />
          </div>

          <button
            @click="onSearchClick"
            class="nhsuk-button nhsuk-u-margin-bottom-4"
            type="submit"
          >
            Search
          </button>

          <br />
          <button
            class="
              nhsuk-button nhsuk-button--secondary
              geo-locate--button
              nhsuk-u-margin-bottom-7
            "
            disabled
          >
            Use your location
          </button>
          <div class="nhsuk-form-group">
            <label class="nhsuk-label" for="select-test-geo">Test Cases</label>
            <select
              v-model="selectedTestCase"
              @change="onTestCaseSelection($event)"
              id="select-test-geo"
              name="select-test-geo"
            >
              <option
                v-for="testCase in testCases"
                :key="testCase.name"
                :value="testCase.id"
              >
                {{ testCase.location }}
              </option>
            </select>

            <button type="button" @click="onTestCaseSearchClick">Go</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { mapState } from "vuex";

const TEST_CASES = [
  {
    id: 0,
    name: "TC0",
    location: "North - Surrey Heartlands",
    lng: 51.41404043234957,
    lat: -0.48989128125001,
  },
  {
    id: 1,
    name: "TC1",
    location: "East - Surrey Heartlands",
    lng: 51.238119518392004,
    lat: -0.017479171875010024,
  },
  {
    id: 2,
    name: "TC2",
    location: "South - Surrey Heartlands",
    lng: 51.13138109936718,
    lat: -0.362175216796885,
  },
  {
    id: 3,
    name: "TC3",
    location: "West - Surrey Heartlands",
    lng: 51.26304687878365,
    lat: -0.65193962109376,
  },
  {
    id: 4,
    name: "TC4",
    location: "Milton Keynes",
    lat: 52.057825072574346,
    lng: -0.71785758984376,
  },
  {
    id: 5,
    name: "TC5",
    location: "Luton",
    lat: 51.9098123551845,
    lng: -0.43770622265626,
  },
  {
    id: 6,
    name: "TC6",
    location: "Bedford",
    lat: 52.119001391736006,
    lng: -0.3958208466796975,
  },
];

export default {
  name: "FindByLocation",
  computed: {
    ...mapState("search", ["postCodeResult", "mhResults"]),
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    postCodeResult(n, o) {
      if (n !== null) {
        this.$store.dispatch("search/postSearchByGeo");
      }
    },
    // eslint-disable-next-line no-unused-vars
    mhResults(n, o) {
      if (n !== null) {
        // Result Available -> route to display
        this.$router.push({ name: "FinderResults" });
      }
    },
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    onSearchEnter(event) {
      if (this.searchText.length > 0) {
        this.inputError = false;
        this.$store.dispatch("search/getPostCode", {
          postCode: this.searchText,
        });
      }
      else {
        this.inputError = true;
      }
    },
    onSearchClick() {
      if (this.searchText.length > 0) {
        this.inputError = false;
        this.$store.dispatch("search/getPostCode", {
          postCode: this.searchText
        });
      }
      else {
        this.inputError = true;
      }
    },
    onTestCaseSearchClick() {
      this.$store.dispatch("search/postSearchByTestCase", {
        testCase: this.testCases[this.selectedTestCase],
      });
    },
    onTestCaseSelection(event) {
      this.selectedTestCase = event.target.value;
    },
  },
  data: () => ({
    searchText: "",
    selectedTestCase: 0,
    testCases: TEST_CASES,
    inputError: false
  }),
  mounted() {
    this.searchText = "";
    this.selectedTestCase = 0;
  },
};
</script>

<style></style>
