const ORG_INDEX_SEARCH_API2 = "https://api.nhs.uk/service-search/search?api-version=2";
const CATCHMENT_SEARCH_API1 = 
  "https://nhsuk-catchment-dev-uks.azurewebsites.net/api/GetServiceProviders?code=" + 
    process.env.VUE_APP_NHS_CATCHMENT_SEARCH_API_DEV_V1_KEY;

const ORG_INDEX_HEADERS_API2 = {
  headers : {"subscription-key": process.env.VUE_APP_NHS_SEARCH_API_V2_KEY,"Content-Type": "application/json"}
};

export { ORG_INDEX_SEARCH_API2, ORG_INDEX_HEADERS_API2, CATCHMENT_SEARCH_API1 }