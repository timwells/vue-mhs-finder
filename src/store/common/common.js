const API_HEADERS = {
  headers : {
    "subscription-key": process.env.VUE_APP_NHS_SEARCH_API_V2_KEY,
    "Content-Type": "application/json"
  }
};

const API2 = "https://api.nhs.uk/service-search/search?api-version=2";



export { API_HEADERS, API2 }