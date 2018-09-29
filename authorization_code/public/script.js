window.onSpotifyWebPlaybackSDKReady = () => {};
async function waitForSpotifyWebPlaybackSDKToLoad () {
  return new Promise(resolve => {
    if (window.Spotify) {
      resolve(window.Spotify);
    } else {
      window.onSpotifyWebPlaybackSDKReady = () => {
        resolve(window.Spotify);
      };
    }
  });
};
async function waitUntilUserHasSelectedPlayer (sdk) {
  return new Promise(resolve => {
    let interval = setInterval(async () => {
      let state = await sdk.getCurrentState();
      if (state !== null) {
        resolve(state);
        clearInterval(interval);
      }
    });
  });
};
(async () => {
  const { Player } = await waitForSpotifyWebPlaybackSDKToLoad();
  const sdk = new Player({
    name: "Web Playback SDK",
    volume: 1.0,
    getOAuthToken: callback => { callback("BQBXnlGUPAUhNYtMGVmS4-RPcVfqNGeUrvYiGM1KN1xIyIIQawOrQRm9PK6FmFOtVvBwqQOoML-L5p51_kbXeBkkB1BfkK09sa4Lwm7wfJLg3BJUTT0sFglX4BTxGJoOmHETpqG-T4UKQEomJAmxKECcTDR0X1og427RMC50Zg"); }
  });
  sdk.on("player_state_changed", state => {
    // Update UI with playback state changes
  });
  let connected = await sdk.connect();
  if (connected) {
    let state = await waitUntilUserHasSelectedPlayer(sdk);
    await sdk.resume();
    await sdk.setVolume(0.5);
    let {
      id,
      uri: track_uri,
      name: track_name,
      duration_ms,
      artists,
      album: {
        name: album_name,
        uri: album_uri,
        images: album_images
      }
    } = state.track_window.current_track;
    console.log(`You're listening to ${track_name} by ${artists[0].name}!`);
  }
})();
