<template>
  <a-tabs default-active-key="1" @change="callback">
    <a-tab-pane key="1" tab="IAPTs">
      <div class="table-width">
        <a-table
          :columns="column_concat(columns, unique_columns_iapt)"
          :data-source="allIAPTResults"
          :row-key="(record) => record.SearchKey"
          :pagination="pagination"
          :loading="loading"
          :scroll="{ x: 2700}"
        >
          <div
            slot="filterDropdown"
            slot-scope="{
              setSelectedKeys,
              selectedKeys,
              confirm,
              clearFilters,
              column,
            }"
            style="padding: 8px"
          >
            <a-input
              v-ant-ref="(c) => (searchInput = c)"
              :placeholder="`Search ${column.dataIndex}`"
              :value="selectedKeys[0]"
              style="width: 188px; margin-bottom: 8px; display: block"
              @change="
                (e) => setSelectedKeys(e.target.value ? [e.target.value] : [])
              "
              @pressEnter="
                () => handleSearch(selectedKeys, confirm, column.dataIndex)
              "
            />
            <a-button
              type="primary"
              icon="search"
              size="small"
              style="width: 90px; margin-right: 8px"
              @click="
                () => handleSearch(selectedKeys, confirm, column.dataIndex)
              "
              >Search</a-button
            >
            <a-button
              size="small"
              style="width: 90px"
              @click="() => handleReset(clearFilters)"
              >Reset</a-button
            >
          </div>
          <a-icon
            slot="filterIcon"
            slot-scope="filtered"
            type="search"
            :style="{ color: filtered ? '#108ee9' : undefined }"
          />
          <template
            slot="customRender"
            slot-scope="text, record, index, column"
          >
            <span v-if="searchText && searchedColumn === column.dataIndex">
              <template
                v-for="(fragment, i) in text
                  .toString()
                  .split(
                    new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i')
                  )"
              >
                <mark
                  v-if="fragment.toLowerCase() === searchText.toLowerCase()"
                  :key="i"
                  class="highlight"
                  >{{ fragment }}</mark
                >
                <template v-else>{{ fragment }}</template>
              </template>
            </span>
            <template v-else>
              {{ text }}
            </template>
          </template>
          <template slot="RelatedIAPTCCGsRender" slot-scope="record">
            {{ filterCCGs(record) }}
          </template>
            <template slot="Services" slot-scope="record">
              <li v-for="item in filterServices(record)" :key="item">
                <a v-if="item.includes('http')" :href="item">Link</a>
                <pre class="pre-style" v-else>{{ item }} </pre>
              </li>
            </template>
        </a-table>
      </div>
    </a-tab-pane>
    <a-tab-pane key="2" tab="GP's" force-render>
      <div class="table-width">
        <a-table
          :columns="column_concat(columns, unique_columns_gp)"
          :data-source="allGPResults"
          :row-key="(record) => record.SearchKey"
          :pagination="pagination"
          :loading="loading"
          :customRow="customRow"
          class="left-table"
        >
          <div
            slot="filterDropdown"
            slot-scope="{
              setSelectedKeys,
              selectedKeys,
              confirm,
              clearFilters,
              column,
            }"
            style="padding: 8px"
          >
            <a-input
              v-ant-ref="(c) => (searchInput = c)"
              :placeholder="`Search ${column.dataIndex}`"
              :value="selectedKeys[0]"
              style="width: 188px; margin-bottom: 8px; display: block"
              @change="
                (e) => setSelectedKeys(e.target.value ? [e.target.value] : [])
              "
              @pressEnter="
                () => handleSearch(selectedKeys, confirm, column.dataIndex)
              "
            />
            
            <a-button
              type="primary"
              icon="search"
              size="small"
              style="width: 90px; margin-right: 8px"
              @click="
                () => handleSearch(selectedKeys, confirm, column.dataIndex)
              "
              >Search</a-button
            >
            <a-button
              size="small"
              style="width: 90px"
              @click="() => handleReset(clearFilters)"
              >Reset</a-button
            >
          </div>
          <a-icon
            slot="filterIcon"
            slot-scope="filtered"
            type="search"
            :style="{ color: filtered ? '#108ee9' : undefined }"
          />
          <template
            slot="customRender"
            slot-scope="text, record, index, column"
          >
            <span v-if="searchText && searchedColumn === column.dataIndex">
              <template
                v-for="(fragment, i) in text
                  .toString()
                  .split(
                    new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i')
                  )"
              >
                <mark
                  v-if="fragment.toLowerCase() === searchText.toLowerCase()"
                  :key="i"
                  class="highlight"
                  >{{ fragment }}</mark
                >
                <template v-else>{{ fragment }}</template>
              </template>
            </span>
            <template v-else>
              {{ text }}
            </template>
          </template>
          <template slot="CCGsRender" slot-scope="text">
            {{ text.OrganisationName }} - {{ text.ODSCode }}
          </template>
        </a-table>
        <div class="map_width">
          <p style="text-align: center">
            Map for <b>{{ gp_name }}</b> with ODSCode: <b>{{ odscode }}</b>
          </p>
          <!-- <MapContainer :geojson="geojson" v-on:select="selected = $event"></MapContainer> -->
          <MapContainer v-if="geojson"
            :geojson="geojson"
            v-on:click="geojson = customRow"
          ></MapContainer>
        </div>
      </div>
    </a-tab-pane>
    <a-tab-pane key="3" tab="GP Comparison"> 
      <div class="tables-container">
      <div class="left-half">
        <h2 class="text-style">All GPs from INT environment</h2>
        <a-table
          :columns="column_concat(columns, unique_columns_gp)"
          :data-source="allGPResults"
          :row-key="(record) => record.SearchKey"
          :pagination="pagination"
          :loading="loading"
          :customRow="customRow"
        >
          <div
            slot="filterDropdown"
            slot-scope="{
              setSelectedKeys,
              selectedKeys,
              confirm,
              clearFilters,
              column,
            }"
            style="padding: 8px"
          >
            <a-input
              v-ant-ref="(c) => (searchInput = c)"
              :placeholder="`Search ${column.dataIndex}`"
              :value="selectedKeys[0]"
              style="width: 188px; margin-bottom: 8px; display: block"
              @change="
                (e) => setSelectedKeys(e.target.value ? [e.target.value] : [])
              "
              @pressEnter="
                () => handleSearch(selectedKeys, confirm, column.dataIndex)
              "
            />
            
            <a-button
              type="primary"
              icon="search"
              size="small"
              style="width: 90px; margin-right: 8px"
              @click="
                () => handleSearch(selectedKeys, confirm, column.dataIndex)
              "
              >Search</a-button
            >
            <a-button
              size="small"
              style="width: 90px"
              @click="() => handleReset(clearFilters)"
              >Reset</a-button
            >
          </div>
          <a-icon
            slot="filterIcon"
            slot-scope="filtered"
            type="search"
            :style="{ color: filtered ? '#108ee9' : undefined }"
          />
          <template
            slot="customRender"
            slot-scope="text, record, index, column"
          >
            <span v-if="searchText && searchedColumn === column.dataIndex">
              <template
                v-for="(fragment, i) in text
                  .toString()
                  .split(
                    new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i')
                  )"
              >
                <mark
                  v-if="fragment.toLowerCase() === searchText.toLowerCase()"
                  :key="i"
                  class="highlight"
                  >{{ fragment }}</mark
                >
                <template v-else>{{ fragment }}</template>
              </template>
            </span>
            <template v-else>
              {{ text }}
            </template>
          </template>
          <template slot="CCGsRender" slot-scope="text">
            {{ text.OrganisationName }} - {{ text.ODSCode }}
          </template>
        </a-table>
      </div>
      <div class="right-half">
        <h2 class="text-style">All GPs from LIVE environment</h2>
        <a-table
          :columns="column_concat(columns, unique_columns_gp)"
          :data-source="allGPResultsPublic"
          :row-key="(record) => record.SearchKey"
          :pagination="pagination"
          :loading="loading"
          :customRow="customRow"
        >
          <div
            slot="filterDropdown"
            slot-scope="{
              setSelectedKeys,
              selectedKeys,
              confirm,
              clearFilters,
              column,
            }"
            style="padding: 8px"
          >
            <a-input
              v-ant-ref="(c) => (searchInput = c)"
              :placeholder="`Search ${column.dataIndex}`"
              :value="selectedKeys[0]"
              style="width: 188px; margin-bottom: 8px; display: block"
              @change="
                (e) => setSelectedKeys(e.target.value ? [e.target.value] : [])
              "
              @pressEnter="
                () => handleSearch(selectedKeys, confirm, column.dataIndex)
              "
            />
            
            <a-button
              type="primary"
              icon="search"
              size="small"
              style="width: 90px; margin-right: 8px"
              @click="
                () => handleSearch(selectedKeys, confirm, column.dataIndex)
              "
              >Search</a-button
            >
            <a-button
              size="small"
              style="width: 90px"
              @click="() => handleReset(clearFilters)"
              >Reset</a-button
            >
          </div>
          <a-icon
            slot="filterIcon"
            slot-scope="filtered"
            type="search"
            :style="{ color: filtered ? '#108ee9' : undefined }"
          />
          <template
            slot="customRender"
            slot-scope="text, record, index, column"
          >
            <span v-if="searchText && searchedColumn === column.dataIndex">
              <template
                v-for="(fragment, i) in text
                  .toString()
                  .split(
                    new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i')
                  )"
              >
                <mark
                  v-if="fragment.toLowerCase() === searchText.toLowerCase()"
                  :key="i"
                  class="highlight"
                  >{{ fragment }}</mark
                >
                <template v-else>{{ fragment }}</template>
              </template>
            </span>
            <template v-else>
              {{ text }}
            </template>
          </template>
          <template slot="CCGsRender" slot-scope="text">
            {{ text.OrganisationName }} - {{ text.ODSCode }}
          </template>
        </a-table>
      </div>
      </div>
    </a-tab-pane>
    <a-tab-pane key="4" tab="Query"> Content of Tab Pane 4 


      <div>
        <!-- It will take some time to run - the JSONs are huge -->
      <!-- <vue-json-compare :oldData="allGPResults" :newData="allGPResultsPublic"></vue-json-compare> -->
    </div>
    </a-tab-pane>
    
  </a-tabs>
</template>

<script>
// import vueJsonCompare from 'vue-json-compare';
// import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import { mapState } from "vuex";
import MapContainer from "./MapContainer.vue";
import json from "@/assets/all_gps_int_api.json";
import json2 from "@/assets/all_gps_public_api.json";

const columns = [
  {
    title: "#",
    dataIndex: "index",
  },
  {
    title: "Key",
    dataIndex: "SearchKey",
    sorter: true,
  },
  {
    title: "ODS",
    dataIndex: "ODSCode",
  },
  {
    title: "Name",
    dataIndex: "OrganisationName",
    sorter: (a, b) => a.OrganisationName.localeCompare(b.OrganisationName),
    sortDirections: ["descend", "ascend"],
    onFilter: (value, record) =>
      record.OrganisationName.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => {
          if (this.searchInput) this.searchInput.focus();
        });
      }
    },
    scopedSlots: {
      filterDropdown: "filterDropdown",
      filterIcon: "filterIcon",
      customRender: "customRender",
    },
  },
  {
    title: "Type",
    dataIndex: "OrganisationTypeId",
    onFilter: (value, record) => record.OrganisationTypeId.indexOf(value) === 0,
    sorter: (a, b) => a.OrganisationTypeId.localeCompare(b.OrganisationTypeId),
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Address1",
    dataIndex: "Address1",
  },
  {
    title: "Address2",
    dataIndex: "Address2",
  },
  {
    title: "Address3",
    dataIndex: "Address3",
  },
  {
    title: "Email",
    dataIndex: "Email",
  },
  {
    title: "Website",
    dataIndex: "Website",
  },
  {
    title: "Services",
    dataIndex: "Services",
    scopedSlots: {
      customRender: "Services",
    }
  },
  {
    title: "City",
    dataIndex: "City",
    onFilter: (value, record) => record.City.indexOf(value) === 0,
    sorter: (a, b) => a.City.localeCompare(b.City),
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "County",
    dataIndex: "County",
    onFilter: (value, record) => record.County.indexOf(value) === 0,
    sorter: (a, b) => a.County.localeCompare(b.County),
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Postcode",
    dataIndex: "Postcode",
    onFilter: (value, record) => record.Postcode.indexOf(value) === 0,
    sorter: (a, b) => a.Postcode.localeCompare(b.Postcode),
    sortDirections: ["descend", "ascend"],
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => {
          if (this.searchInput) this.searchInput.focus();
        });
      }
    },
    scopedSlots: {
      filterDropdown: "filterDropdown",
      filterIcon: "filterIcon",
      customRender: "customRender",
    },
  },
];

const unique_columns_iapt = [
  {
    title: "Related CCGs",
    dataIndex: "RelatedIAPTCCGs",
    scopedSlots: {
      customRender: "RelatedIAPTCCGsRender",
    },
  },
];

const unique_columns_gp = [
  {
    title: "CCGs",
    dataIndex: "CCG",
    scopedSlots: {
      customRender: "CCGsRender",
    },
  },
];

export default {
  name: "Explorer",
  components: {
    MapContainer,
    // vueJsonCompare,
    // PulseLoader
  },
  computed: {
    ...mapState("explorer", ["allIAPTResults"]),
  },
  methods: {
    callback(key) {
      key;
    },
    handleSearch(selectedKeys, confirm, dataIndex) {
      confirm();
      this.searchText = selectedKeys[0];
      this.searchedColumn = dataIndex;
    },
    handleReset(clearFilters) {
      clearFilters();
      this.searchText = "";
    },
    column_concat(array_1, array_2) {
      // this.concat_columns = []
      this.concat_columns = array_1.concat(array_2);
      return this.concat_columns;
    },
    filterCCGs: (record) =>
      record.map((relatedOrg) => relatedOrg.OrganisationName).join(","),
    filterServices: (record) => {
      for(const item in record){
        if(record[item]["ServiceCode"] === "SRV0339"){
          var all_returns = []
          var contacts_details = ""
          var website_details = ""
          for (const i in record[item]["Contacts"]){
            // console.log(record[item]["Contacts"][i]["ContactValue"])
            if (record[item]["Contacts"][i]["ContactValue"] !== null){
              if(record[item]["Contacts"][i]["ContactMethodType"] == "Website"){
                website_details += record[item]["Contacts"][i]["ContactValue"]
              }
              else{
                contacts_details += record[item]["Contacts"][i]["ContactMethodType"] + ': ' + record[item]["Contacts"][i]["ContactValue"] + '\n'
              }
            }
          }
          contacts_details += "Service Code: " + record[item]["ServiceCode"]
          all_returns.push(contacts_details)
          all_returns.push(website_details)
          return all_returns
        }
      }
    },
    customRow(record) {
      return {
        on: {
          click: (event) => {
            // console.log(event, record.Latitude, record.Longitude);
            // this.lat = record.Latitude,
            // this.lon = record.Longitude
            event
            this.gp_name = record.OrganisationName;
            this.odscode = record.ODSCode;

            var geojson = {
              type: "Feature",
              properties: {
                name: "default object",
                quality: "medium",
              },
              geometry: {
                type: "Point",
                coordinates: [record.Longitude, record.Latitude],
              },
            };
            this.geojson = geojson;
          },
        },
      };
    },
  },
  data: () => ({
    selected: undefined,
    allGPResults: json,
    allGPResultsPublic: json2,
    gp_name: "",
    odscode: "",
    data: [],
    columns,
    unique_columns_iapt,
    unique_columns_gp,
    pagination: { pageSize: 15 },
    loading: false,
    searchText: "",
    searchInput: null,
    searchedColumn: "",
    geojson: undefined,
  }),
  mounted() {
    this.$store.dispatch("explorer/postSearchAllIAPTs");
    // this.$store.dispatch("explorer/postSearchAllGPs",{skip:0});
    if(json) {
          json.forEach((e,i) => { e.index = i+1; });
      }
    if(json2) {
        json2.forEach((e,i) => { e.index = i+1; });
      }
  },
  
};
</script>

<style>
.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}
.cell {
  border-radius: 4px;
  background-color: lightgrey;
}

.cell-map {
  grid-column: 1;
  grid-row-start: 1;
  grid-row-end: 3;
}

.map_width {
  width: 30%;
  padding-left: 4px;
  height: 400px;
  float: right;
}
/* table */
.ant-table table {
  background-color: #ffffff;
  font-size: 6px;
}
/* row data */
.ant-table-thead > tr > th {
  font-weight: 600;
  font-size: 0.875rem;
  height: 5px;
  padding: 4px;
}
.ant-table-tbody > tr > td {
  font-size: 0.875rem;
  height: 5px;
  padding: 4px;
}
.tables-container{
  display:flex;
}

.left-half{
  margin-right: 7px; 
  overflow-x: auto;
  height: 800px;
}

.right-half{
  margin-left: 7px; 
  overflow-x: auto;
  height: 800px;
}

body {
  background-color: #ffffff;
}

.table-width {
  padding: 10px;
}
.left-table {
  width: 70%;
  float: left;
}
ul > li:last-child {
  margin-bottom: 8px;
}

.text-style {
    text-align: center;
}

.pre-style {
  /* overflow: hidden; */
  overflow-wrap: break-word;
  font-size: 10px;
}
</style>
