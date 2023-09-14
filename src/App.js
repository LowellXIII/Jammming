import React, { useState, useEffect } from 'react';

import './App.css';
import SearchBar from './SearchBar.js';
import Playlist from './Playlist.js'
import refreshAccessToken from './Refresh.js';


function App() {

  const [tokenNow, setTokenNow] = useState("")
  const [sharedSpotID, setSharedSpotID] = useState("");
  const [addSong, setAddSong] = useState({name:0});

  
  useEffect(() => {
    const refreshTokenAndSetState = async () => {
      try {
        const result = await refreshAccessToken();
        setTokenNow(result);
        console.log(`The New token is: ${result}`);
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    };
    refreshTokenAndSetState();
    const intervalId = setInterval(refreshTokenAndSetState, 3500000);
    return () => clearInterval(intervalId);
  }, []);

  const containerStyle = {
    "display":"flex",
    "flexDirection":"row",
    "flexWrap":"wrap",
    "justifyContent":"space-between"    
  }



  return (
    <div className="App">
      <h1>Jason's Amazing Spotify Project</h1>
      <header className="App-header">
        <container style={containerStyle}>
          <Playlist message={tokenNow} setSharedSpotID={setSharedSpotID} addSong={addSong} />
          <SearchBar message={tokenNow} sharedSpotID={sharedSpotID} setAddSong={setAddSong} />
        </container>
      </header>
    </div>
  );
}

export default App;
