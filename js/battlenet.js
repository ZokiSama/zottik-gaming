const apiKey = "kbny2ghne36fzxabxywxjuchzkbwmgd7";
const lang = "enGB";
const region = "eu";

const loadData = (url, key) => fetch(url, {
  headers: new Headers({
    'client-ID': key
  }),
}).then(resp => resp.json()).then(json => json.data);