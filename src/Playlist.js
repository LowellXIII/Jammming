import React, { useState, useEffect } from 'react';
import './EditSong.css';
import RenameForm from './RenameForm.js'


const Playlist = (props) => {
    const [idInput, setIdInput] = useState("");                 //Spotify Playlist ID
    const [playlistResult, setPlaylistResult] = useState([]);
    const [playlistName, setPlaylistName] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [showComponent, setShowComponent] = useState(false);
    const apiKey = "https://api.spotify.com/v1/playlists/";
    const apiUrl = `${apiKey}${idInput}`;

    useEffect(() => {
        //console.log(playlistResult);
        //console.log(playlistResult[0], {track:props.addSong})
        if(props.addSong.name !== 0){
            setPlaylistResult((prev) => [{track: props.addSong}, ...prev])
        }
    }, [props.addSong]) 

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
        setShowComponent(true);
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
            setPlaylistName(data.name);
            console.log(playlist);
        }).catch(error => {
            console.error('Error fetching data: ', error);
        })
    };

    const toggleForm = (e) => {
        e.preventDefault();
        setShowForm(!showForm);
    }




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
        <div style={{
            "width":"50%",
            }}>
            <form onSubmit={handleOnSubmit} >
                <label htmlFor="playlist" style={{padding:10}}>Search your Playlist by ID</label>
                <input
                    id="playlist" 
                    placeholder="Spotify ID" 
                    value={idInput} 
                    onChange={handleOnChange} 
                    type="text" 
                    className="inputField" />
            </form>
            {showComponent && (<playlistName style={{
                    "display":"flex",
                    "flexDirection":"column",
                    "alignItems":"center"

                }}>
                <p id="PlaylistName">{playlistName}</p>
                <button className="Button" onClick={toggleForm}>Rename</button>
                {showForm && (
                    <RenameForm apiUrl={apiUrl} headers={headers} current={playlistName}/>
                )}
            </playlistName>)}    
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