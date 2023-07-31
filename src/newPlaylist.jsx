import './App.css'
import React, {useState, useEffect}from "react";
import { useStateProvider } from "./stateProvider";
import axios from "axios";

export default function NewPlaylist ({selectedSongIds, userInfo}) {
    const [{ token,}] = useStateProvider();
    
    useEffect(() => {
      const getTracks = async () => {
        try {
          if (selectedSongIds.length > 0) { // Check if the array is not empty
            const tracks = selectedSongIds.map(async (songId) => {
              const response = await axios.get(`https://api.spotify.com/v1/tracks/${songId}`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });
              return response.data;
            });
    
            const data = await Promise.all(tracks);
            displayItems(data);
          }
        } catch (error) {
          console.log(error);
        }
      };
    
      function displayItems(data) {
        const NewPlaylistResults = document.querySelector(".NewPlaylistResults");
        NewPlaylistResults.innerHTML = ""; // Clear previous search results
    
        for (const item of data) {
          const albumImage = item.album.images[0].url;
          const artistName = item.artists[0].name;
          const trackName = item.name;
          const songId = item.id;
    
          // Create HTML elements to display the information
          const resultItem = document.createElement("div");
          resultItem.classList.add("resultItem");
    
          const albumImageElement = document.createElement("img");
          albumImageElement.src = albumImage;
    
          const artistNameElement = document.createElement("p");
          artistNameElement.textContent = artistName;
    
          const trackNameElement = document.createElement("p");
          trackNameElement.textContent = trackName;
    
          const songIdElement = document.createElement("button");
          songIdElement.textContent = "X";
          songIdElement.addEventListener("click", () => {
            removeSong(songId);
          });
    
          // Append the elements to the resultItem element
          resultItem.appendChild(albumImageElement);
          resultItem.appendChild(artistNameElement);
          resultItem.appendChild(trackNameElement);
          resultItem.appendChild(songIdElement);
    
          // Append the resultItem to the searchResults element
          NewPlaylistResults.appendChild(resultItem);
        }
      }
    
      function removeSong(songId) {
        const index = selectedSongIds.indexOf(songId);
        if (index >= 0) {
          selectedSongIds.splice(index, 1);
          getTracks(); // Call getTracks again to refresh the displayed results
        }
      }
    
      getTracks();
    }, [selectedSongIds, token]);




    const [playlistName, setPlaylistName] = useState("")
    
      const submitNewPlaylist = async () => {
          try {
            if (userInfo?.userId && token) {
              if (playlistName === ""){
                alert('Please Type something for a Playlist Name')
                } else {

              const playlistData = {
                name: playlistName, // Replace with the desired playlist name
                public: true, // Set to 'true' for a public playlist, 'false' for private
              }
            
          const response = await axios.post(`https://api.spotify.com/v1/users/${userInfo?.userId}/playlists`, playlistData,
          {
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
          })

          const playlistId = response.data.id
          try {
              if (userInfo?.userId && token) {
                const modifiedArray = selectedSongIds.map(item => 'spotify:track:' + item);
                const playlistData = {
                  uris: modifiedArray,
                  position: 0
                }
            await axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, playlistData,
              {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
                 }
              })
            alert("Your Playlist has been saved!")
    
            }
        }  catch (error){
            console.log(error)
          }

         
        }
          }
      }  catch (error){
          console.log(error)
      }
     }
      


    
      
 







  

  const handlePlaylistSubmission = () => {
    submitNewPlaylist();
  };






    

    return (
        <>
        {selectedSongIds.length > 0 ?
        <>
        <div className="newPlaylistHeader">
        
            <input placeholder="Playlist Name" type="text" onChange={e=> setPlaylistName(e.target.value)}/>
            <button id={"newPlaylistButton"} type={"submit"} onClick={handlePlaylistSubmission}>Submit</button>
        </div>
        <div className={"resultHeader2"}>
          <div className={"albumHeader2"}>Album</div>
          <div className={"artistHeader2"}>Artist</div>
          <div className={"songHeader2"}>Song Title</div>
          <div className={"playlistHeader2"}>Remove From Playlist</div>
        </div> 
        <div className="NewPlaylistResults">

        </div>
        </>
         : 
         ""
       
       }
       </>

    )

}