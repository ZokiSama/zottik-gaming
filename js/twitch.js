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
  "zokisama",
  "khadhd",
  "cgjimster",
  "matthsimon",
  "maltharion",
  //"overwatchcontenders",
  //"aimbotcalvin",
  //"overwatchleague",
  //"pgl_dota2"
];

loadUsers(userNames).then(users =>
  Promise.all([
    users,
    loadStreams(users)
  ])
).then(zipUserStream).then(
  users => {
    let viewer_count = [];
    let mostViewers = NaN;

    console.log(users);
    for (const user in users) {
      console.log(users[user].stream);
      if (users[user].stream != 'offline') {
        viewer_count.push(users[user].stream.viewer_count)
        $('.streamCarousel').append(`
          <div class="carousel-item">
            <img class="d-block col-3 img-fluid" src="${users[user].profile_image_url}">
          </div>
        `)
        // ${users[user].display_name}
      }
    }

    mostViewers = Math.max.apply(Math, viewer_count)
    for (const user in users) {
      if (users[user].stream.viewer_count === mostViewers) {
        liveStreamHTML(users[user].display_name);
      }
    }
    sortCarousel();
    console.log(mostViewers);
  }
)

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

const sortCarousel = () => {
  $(".streamCarousel .carousel-item:first").addClass("active");

  $('.carousel .carousel-item').each(function () {
    var next = $(this).next();
    if (!next.length) {
      next = $(this).siblings(':first');
    }
    next.children(':first-child').clone().appendTo($(this));

    for (var i = 0; i < 2; i++) {
      next = next.next();
      if (!next.length) {
        next = $(this).siblings(':first');
      }
      
      next.children(':first-child').clone().appendTo($(this));
    }
  });
}