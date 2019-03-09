const key = "5wzdv2po34437rxy6wjkpvc2jj0x8o";
const urlUsers = "https://api.twitch.tv/helix/users";
const urlStreams = "https://api.twitch.tv/helix/streams";

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

  return users.map(user => Object.assign({}, user, {
    stream: streams.find(stream => stream.user_id === user.id) || "offline"
  }))
}

const userNames = [
  "nikcs",
  "khadhd",
  "zokiio",
  "cgjimster",
  "matthsimon",
  "maltharion",
  "mussealamide",
  "stalli_8",
  "spodergirrl",
  "zchnuggelstv"
];


loadUsers(userNames).then(users =>
  Promise.all([
    users,
    loadStreams(users)
  ])
).then(zipUserStream).then(
  users => {
    $().ready(function () { // Wait for page to load completely
      let topUser = {
        stream: {
          viewer_count: 0
        }
      };
      users.forEach(user => {
        if (user.stream != 'offline') {
          if (topUser.stream.viewer_count < user.stream.viewer_count) {
            topUser = user;
          }

          $('.broadcasters').append(`
          <div id="${user.display_name}" class="broadcast">
            <img class="rounded broadcastIMG" src="${user.profile_image_url}">
            <div class="status">
              <div class="status-indicator"></div>
              <div class="status-viewers">${user.stream.viewer_count}</div>
            </div>
          </div>
        `);
        }
      });

      if(topUser.display_name !== undefined ) {
        liveStreamHTML(topUser.display_name);
      }

      $(".broadcast").on('click', (e) => {
        liveStreamHTML(e.currentTarget.id);
      });
    });
  }
);

// Template for embedding Twitch stream
const liveStreamHTML = (channelName) => {
  return $('#twitch-embed').html(`
  <iframe
    class="embed-responsive-item"
    src="https://player.twitch.tv/?channel=${channelName}&muted=true"
    frameborder="0"
    scrolling="no"
    allowfullscreen="true">
  </iframe>
  `)
}
