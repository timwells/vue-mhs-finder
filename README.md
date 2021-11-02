# vue-mhs-finder
## Pre-requisites
On Windows.
1. npm install; via git https://git-scm.com/download/win
2. Vue CLI (optional)- https://cli.vuejs.org/guide/prototyping.html

## API Key
```
Requires API key from https://developer.api.nhs.uk/register
Create .env and .env.production files
Add:
VUE_APP_NHS_SEARCH_API_V2_KEY=<your-key>

Access via process.env.VUE_APP_NHS_SEARCH_API_V2_KEY
ref: https://cli.vuejs.org/guide/mode-and-env.html#modes
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
