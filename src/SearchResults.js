import React from 'react';
import searchTrack from './API.js';

const SearchResults = (props) => {
    const search = props.target.value;
    const name = searchTrack(search).map((album) => {
        return album.album.name;
    });
    
    return (
      <div>
        
      </div>  
    );
}

export default SearchResults;