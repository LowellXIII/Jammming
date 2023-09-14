import React, { useState } from 'react';
import './EditSong.css';

const SearchBar = (props) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);


  const apiUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchInput)}&type=track`;
  const addApiUri = `https://api.spotify.com/v1/playlists/${props.sharedSpotID}/tracks`;
  //const addapiUrl = `https://api.spotify.com/v1/playlists/${props.sharedSpotID}/tracks`;

  const headers = new Headers({
    "Authorization" : `Bearer ${props.message}`,
    "Content-Type" : "application/json"
  })

  //Add Song to Playlist
  const handleButtonClick = (e) => {
    e.preventDefault();
    
    const trackValue = e.target.value;
    const bodyRequest = {uris: [trackValue], position: 0};
    const dataValueString = e.target.getAttribute('data-value');
    const customObject = JSON.parse(dataValueString);
    props.setAddSong(customObject);
    console.log(customObject);
    
    fetch(addApiUri, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(bodyRequest),
    }).then((response) => {
      if(!response.ok){
        alert("Please search your playlist");
        throw new Error(`Network response was not ok: ${response.status}`);
      } 
      return response.json();
    }).then((data) => {
      console.log(data);
    }).catch((error) => {
      console.error(error);
    })
  }
  
  const handlePlayClick = (e) => {
    const audioIndex = e.target.value;
    console.log(audioIndex);
    const audioElement = document.getElementById(audioIndex);
    audioElement.play();
  }

  const handleStopClick = (e) => {
    const audioIndex = e.target.value;
    const audioElement = document.getElementById(audioIndex);
    audioElement.pause();
    audioElement.currentTime = 0;
  }

  const handleSearch = (e) => {
      e.preventDefault();
      fetch(apiUrl, {
        method: 'GET',
        headers: headers,
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          // Process the fetched data
          let tracks = [];
          tracks = data.tracks.items;
          setSearchResults(tracks)
          console.log('Search results:', tracks);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        }); 
  }

  const handleInputChange = event => {
    setSearchInput(event.target.value);
  };

  return (
    <div style={{
      "width":"50%"
    }}>
      <form onSubmit={handleSearch} >
      <label htmlFor="search" style={{padding:10}}>Search for Songs</label>
      <input
        type="text"
        placeholder="Search for a track..."
        value={searchInput}
        onChange={handleInputChange}
        id="search"
        className="inputField"
      />     
      </form>
      <ul>
        {searchResults.map((track, i) => (
          <div className="sectionContainer">
            <li key={track.id} className="songContainer">
              <p className="songName">{track.name}</p>
              <img src={track.album.images[0].url} alt="" className="images" />
              <audio id={"audio" + i} src={track.preview_url}></audio>
              <div style={{
                "display":"flex",
                "flexDirection": "column",
              }}>
                <button id={`audio${i}`} className="audioButton" value={"audio" + i} onClick={handlePlayClick} >Preview</button>
                <button className="audioButton" value={"audio" + i} onClick={handleStopClick} >Stop</button>
              </div>
            </li>
            <button id={`button${i}`} className="Button" data-value={JSON.stringify(track)} value={track.uri} onClick={handleButtonClick}>Add</button>      
          </div>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;