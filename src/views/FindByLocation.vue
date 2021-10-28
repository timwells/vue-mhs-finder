<template>
  <div class="nhsuk-width-container">
    <main class="nhsuk-main-wrapper" id="main-content">
      <div class="nhsuk-grid-row">
        <div class="nhsuk-grid-column-two-thirds">
            <h1>Find a Mental Health Service</h1>
            <div name="ServiceSearchForm" id="service-search-form">
              <input
                type="hidden"
                value="GPB"
                data-val="true"
                data-val-required="The ServiceId field is required."
                id="ServiceId"
                name="ServiceId"
              />
              <input
                type="hidden"
                id="UsersLatitude"
                name="UsersLatitude"
                value=""
              />
              <input
                type="hidden"
                id="UsersLongitude"
                name="UsersLongitude"
                value=""
              />
              <div class="nhsuk-form-group">
                <label class="nhsuk-label" for="Location">Enter a town, city or postcode in England</label>
                <input
                  class="nhsuk-input nhsuk-input--width-20"
                  type="text"
                  id="Location"
                  name="Location"
                  value=""
                  disabled
                />
              </div>
              <button @click="onSearch" class="nhsuk-button nhsuk-u-margin-bottom-4" type="submit">Search</button>
              <br />
              <button class="nhsuk-button nhsuk-button--secondary geo-locate--button nhsuk-u-margin-bottom-7" disabled>
                Use your location
              </button>
              <div class="nhsuk-form-group">
                <label class="nhsuk-label" for="select-test-geo">Test Cases</label>
                <select 
                  v-model="selectedTestCase" 
                  @change="onTestCaseSelection($event)" 
                  class="nhsuk-select" id="select-test-geo" name="select-test-geo">
                  <option v-for="testCase in testCases" :key="testCase.name" :value="testCase.id">{{ testCase.location }}</option>
                </select>
              </div>

              <div class="geo-locate">
                <p class="geo-locate--searching nhsuk-u-margin-bottom-7">
                  <!--img src=".loading.gif" alt="" /-->
                  We are searching for your location
                </p>
                <p class="geo-locate--error nhsuk-u-margin-bottom-7">
                  We can't find your location. Please try again or enter a town,
                  city or postcode.
                </p>
                <p class="geo-locate--denied nhsuk-u-margin-bottom-7">
                  You have not allowed us to use your location. You can change
                  this in your browser settings.
                </p>
              </div>
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
    id:0,
    name: "TC0",
    location: "North - Surrey Heartlands",
    lng: 51.41404043234957,
    lat: -0.48989128125001
  },
  {
    id:1,
    name: "TC1",
    location: "East - Surrey Heartlands",
    lng: 51.238119518392004,
    lat: -0.017479171875010024
  },
  {
    id:2,
    name: "TC2",
    location: "South - Surrey Heartlands",
    lng: 51.13138109936718,
    lat:-0.362175216796885
  },
  {
    id:3,
    name: "TC3",
    location: "West - Surrey Heartlands",
    lng: 51.26304687878365,
    lat: -0.65193962109376
  },
  {
    id:4,
    name:"TC4",
    location:"Milton Keynes",
    lat: 52.057825072574346,
    lng: -0.71785758984376
  },
  {
    id:5,
    name: "TC5",
    location: "Luton",
    lat: 51.9098123551845,
    lng: -0.43770622265626
  },
  {
    id: 6,
    name: "TC6",
    location: "Beford",
    lat: 52.119001391736006,
    lng: -0.3958208466796975	
  }
]

export default {
  name: "FindByLocation",
    computed: {
    ...mapState("search", ["postCodeResult"])
  },
  methods:{
    onSearch() {
      // this.$store.dispatch("search/getPostCode", {postCode : "SW1A+1AA"});
      this.$store.dispatch("search/postSearch",{ testCase : this.testCases[this.selectedTestCase] });
      this.$router.push({ name:'FinderResults' })
    },
    onTestCaseSelection(event) {
      this.selectedTestCase = event.target.value;
    }
  },
  data: () => ({
    selectedTestCase: 0,
    testCases: TEST_CASES
  }),
  mounted() {


  }
}
</script>

<style>
</style>
