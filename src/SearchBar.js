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

  const handleButtonClick = (e) => {
    e.preventDefault();
    const trackValue = e.target.value;
    const addingSong = e.target.message;
    const bodyRequest = {uris: [trackValue], position: 0};

    console.log(trackValue);
    console.log(addApiUri);
    console.log(JSON.stringify(bodyRequest));
    console.log(addingSong);
    //props.setAddSong(e.target.message);

    fetch(addApiUri, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(bodyRequest),
    }).then((response) => {
      if(!response.ok){
        throw new Error(`Network response was not ok: ${response.status}`);
      } 
      return response.json();
    }).then((data) => {
      console.log(data);
    }).catch((error) => {
      console.error(error);
    })
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
        {searchResults.map(track => (
          <div className="sectionContainer">
            <li key={track.id} className="songContainer">
              {track.name}
              <img src={track.album.images[0].url} width="100" height="100" alt="" />
            </li>
            <button className="Button" message={track} value={track.uri} onClick={handleButtonClick}>Add</button>      
          </div>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;