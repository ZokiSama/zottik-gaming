const key = "5wzdv2po34437rxy6wjkpvc2jj0x8o";
const urlUsers = "https://api.twitch.tv/helix/users";
const urlStreams = "https://api.twitch.tv/helix/streams";

const liveStreamHTML = (channelName) => {
  return $('#twitch-embed').html(`
  <iframe
    class="embed-responsive-item"
    src="http://player.twitch.tv/?channel=${channelName}&muted=true"
    frameborder="0"
    scrolling="no"
    allowfullscreen="true">
  </iframe>
  `)
}

const loadData = (url, key) => fetch(url, {
  headers: new Headers({
    'client-ID': key
  }),
}).then(resp => resp.json()).then(json => json.data);

const buildUrl = (
  array,
  url,
  key
) => `${url}${array.reduce((acc, item) => acc += `${key}=${item}&`, `?`).slice(0, -1)}`

loadUsers = (userlist) => loadData(buildUrl(userlist, urlUsers, 'login'), key);
loadStreams = (users) => loadData(buildUrl(users.map(user => user.id), urlStreams, 'user_id'), key);

const zipUserStream = (array) => {
  const users = array[0];
  const streams = array[1];

  return users.map(user => Object.assign({}, user, {stream: streams.find(stream => stream.user_id === user.id) || "offline"}))
}

const userNames = [
  "zokisama",
  "khadhd",
  "cgjimster",
  "matthsimon",
  "overwatchcontenders",
  "aimbotcalvin",
  "overwatchleague",
  "pgl_dota2"
];

loadUsers(userNames).then(users =>
  Promise.all([
    users,
    loadStreams(users)
  ])
).then(zipUserStream).then(
  users => {

    for (const user in users) {
      console.log(users[user].stream);
      if (users[user].stream !== offline){
        liveStreamHTML(users[user].login);
      } 
      else {
        $('#offline').html(`
          <h3>${users[user].display_name}</h3>
        `);
      }
    }
    console.log(users)

  }
)