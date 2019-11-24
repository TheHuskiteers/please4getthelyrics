window.onSpotifyWebPlaybackSDKReady = () => {
  var player = new Spotify.Player({
    name: "Please 4get These Lyrics",
    getOAuthToken: cb => {
      cb(token);
    }
  });

  player.addListener('ready', ({
    device_id
  }) => {
    did = device_id;

    fetch('https://api.spotify.com/v1/me/player', {
      method: 'put',
      body: JSON.stringify({
        device_ids: [did],
        play: false
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }).then(res => console.log(res));
  });
  player.connect();
};

const play = (uri, pos) => {
  fetch('https://api.spotify.com/v1/me/player/play?device_id=' + did, {
    method: 'put',
    body: uri ? JSON.stringify({
      uris: [uri],
      position_ms: pos
    }) : '',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  }).then(res => console.log(res));
}

const pause = () => {
  fetch('https://api.spotify.com/v1/me/player/pause?device_id' + did, {
    method: 'put',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  }).then(res => console.log(res));
}