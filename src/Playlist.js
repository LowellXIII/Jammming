import React, { useState, useEffect } from 'react';
import './EditSong.css';

let checkInput = 0;

const Playlist = (props) => {
    const [idInput, setIdInput] = useState("");
    const [playlistResult, setPlaylistResult] = useState([]);

    
    const apiKey = "https://api.spotify.com/v1/playlists/";
    const apiUrl = `${apiKey}${idInput}`;

    const headers = new Headers({
        "Authorization" : `Bearer ${props.message}`,
        "Content-Type" : "application/json"
    })

    const handleOnChange = (e) => {
        setIdInput(e.target.value);
        props.setSharedSpotID(e.target.value);
    }

    const handleOnSubmit = (e) => {
        e.preventDefault();
        fetch(apiUrl,{
            method: "GET",
            headers: headers
        }).then(response => {
            if(!response.ok){
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.json();
        }).then(data => {
            let playlist = [];
            playlist = data.tracks.items;
            setPlaylistResult(playlist);
            console.log(playlist);
            checkInput = 1;
        }).catch(error => {
            console.error('Error fetching data: ', error);
        })
    };

    useEffect(() => {
        if(props.addSong){
            console.log(props.addSong);
            playlistResult.push(props.addSong);
        }
    }, [props.addSong, playlistResult])


    const handleButtonClick = (e) => {
        e.preventDefault();
        console.log(e.target.value);
        const deleteAPI = `https://api.spotify.com/v1/playlists/${idInput}/tracks`
        //Removing it from the playlist via API
        fetch(deleteAPI, {
            method: "DELETE",
            headers: headers,
            body: JSON.stringify({uris: [e.target.value]})
        }).then(response => {
            if(!response.ok){
                throw new Error(`Network response was not ok ${response.status}`);
            }
            return response.json();
        }).then(data => {
            console.log(data);
        }).catch(error => {
            console.error('Error fetching data: ', error);
        })
        //Removing the element from the array
        setPlaylistResult(playlistResult.filter(track => track.track.uri !== e.target.value));
        console.log(playlistResult);
    }

    return(
        <div style={{"width":"50%"}}>
            <form onSubmit={handleOnSubmit} >
                <label htmlFor="playlist" style={{padding:10}}>Search your Playlist by ID</label>
                <input
                    id="playlist" 
                    placeholder="Spotify ID" 
                    value={idInput} 
                    onChange={handleOnChange} 
                    type="text" 
                    className="inputField" />
                <p style={{
                    "opacity":checkInput,
                    "textDecoration":"underline"
                    }}>
                        Your Playlist
                </p>
            </form>    
                <ul>
                    {playlistResult.map(tracks => (
                        <div className="sectionContainer">
                            <li key={tracks.id} className="songContainer">
                                {tracks.track.name}
                                <img src={tracks.track.album.images[0].url} width="100" height="100" alt="" />
                            </li>
                            <button className="Button" onClick={handleButtonClick} value={tracks.track.uri}>Remove</button>
                        </div>
                        
                    ))}
                </ul>
            
        </div>

    )
}

export default Playlist;