import React, { useState } from 'react';

const SearchBar = (props) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const apiUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchInput)}&type=track`;
  
  const headers = new Headers({
      'Authorization' : `Bearer ${props.message}`,
      'Content-Type' : 'application/json'
  });
  

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
        tracks = data.tracks.items
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
    <form onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search for a track..."
        value={searchInput}
        onChange={handleInputChange}
      /> 
      <ul style={{
        "display":"flex",
        "flexDirection":"row",
        "flexWrap":"wrap",
        "margin":"auto",
        "padding":0,
        "width":"100%",
        "borderColor":"white",
        "borderStyle":"solid",
        "justifyContent":"center"
      }}>
        {searchResults.map(track => (
          <li key={track.id} style= {{
            "display": "flex",
            "flexDirection": "row",
            "alignItems": "center",
            "justifyContent":"space-between",
            "width":"45%",
            "borderColor":"white",
            "borderStyle":"solid",
            "marginTop":10
          }}>
            {track.album.name}
            <img src={track.album.images[0].url} width="100" height="100" alt="" />
          </li>
        ))}
      </ul>
    </form>
  );
};

export default SearchBar;