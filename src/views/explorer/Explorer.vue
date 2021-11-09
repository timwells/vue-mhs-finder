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
          <template
            slot="RelatedIAPTCCGsRender"
            slot-scope="record"
          >
            {{filterCCGs(record)}}
          </template>
        </a-table>
      </div>
    </a-tab-pane>
    <a-tab-pane key="2" tab="GP List" force-render>
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
          <template
            slot="CCGsRender"
            slot-scope="text"
          >
            {{text.OrganisationName}} - {{text.ODSCode}}
          </template>
        </a-table>
      <div class="map_width">
      <p style="text-align: center;">Map for <b>{{gp_name}}</b> with ODSCode: <b>{{odscode}}</b></p>
      <!-- <MapContainer :geojson="geojson" v-on:select="selected = $event"></MapContainer> -->
      <MapContainer :geojson="geojson" v-on:click="geojson = customRow"></MapContainer>
    </div>
      </div>
    </a-tab-pane>
    <a-tab-pane key="3" tab="Query"> Content of Tab Pane 3 </a-tab-pane>
  </a-tabs>
</template>

<script>
import { mapState } from "vuex";
import MapContainer from './MapContainer.vue'

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
    onFilter: (value, record) => record.OrganisationName.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => {
          if(this.searchInput)
            this.searchInput.focus();
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
  }
  /*{
    title: 'Latitude',
    dataIndex: 'Latitude',
  },
  {
    title: 'Longitude',
    dataIndex: 'Longitude',
  }*/
];

const unique_columns_iapt = [
  {
    title: "Related CCGs",
    dataIndex: "RelatedIAPTCCGs",
    scopedSlots: {
      customRender: "RelatedIAPTCCGsRender"
   },
  }
];

const unique_columns_gp = [
  {
    title: "CCGs",
    dataIndex: "CCG",
    scopedSlots: {
      customRender: "CCGsRender"
   },
  }
];


export default {
  name: "Explorer",
  components: {
    MapContainer
  },
  computed: {
    ...mapState("explorer", ["allIAPTResults", "allGPResults"]),
  },
  methods: {
    callback(key) {
      console.log(key);
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
      return this.concat_columns
    },
    filterCCGs: (record) => record.map((relatedOrg) => (relatedOrg.OrganisationName)).join(","),
    customRow(record) {
      return {
        on: {
          click: event => {
            // console.log(event, record.Latitude, record.Longitude);
            // this.lat = record.Latitude,
            // this.lon = record.Longitude
            this.gp_name = record.OrganisationName
            this.odscode = record.ODSCode
            var geojson = {
                type: 'Feature',
                properties: {
                  name: 'default object',
                  quality: 'medium'
                },
                geometry: {
                  type: 'Point',
                  coordinates: [
                       record.Longitude,
                       record.Latitude
                  ]
                }
              }
            console.log(event, geojson)
            this.geojson = geojson
            // return geojson
          }
        }
      };
    }
  },
  data: () => ({
    selected: undefined,
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
    geojson: undefined
  }),
  mounted() {
    this.$store.dispatch("explorer/postSearchAllIAPTs");
    this.$store.dispatch("explorer/postSearchAllGPs");
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
  float:right;
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

body {
  background-color: #ffffff;
}

.table-width {
  padding: 10px;
}
.left-table{
  width: 70%;
  float: left;
}
ul>li:last-child {
    margin-bottom: 8px;
}
</style>
