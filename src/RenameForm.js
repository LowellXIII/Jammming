import React, {useState} from 'react';
import "./EditSong.css";

const RenameForm = (props) => {
    const [input, setInput] = useState("")

    const handleOnChange = (e) => {
        setInput(e.target.value);
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        document.getElementById("PlaylistName").innerHTML = input;
        const bodyRequest = {
            name:input
        };
        fetch(props.apiUrl, {
            method: "PUT",
            headers: props.headers,
            body: JSON.stringify(bodyRequest)
        }).then(response => {
            if(!response.ok){
                throw new Error (`Network response was not ok: ${response.status}`);
            }
            return response.json();
        }).then(data => {
            console.log(data); 
        }).catch(error => {
            console.error('Error fetching data: ', error);
        })
    }

    return(
        <form onSubmit={handleSubmit}>
            <label htmlFor="rename">Rename your Playlist</label>
            <input className="inputField" id="rename" onChange={handleOnChange} value={input} placeholder={props.current} />
        </form>
    )
}

export default RenameForm;