import './App.css';
import React, {useEffect, useState, createContext, useContext, useReducer} from "react";
import { useStateProvider } from './stateProvider'

import {reducerCases} from "./reducerCases"
import Playlists from './Playlists'




function App() {

  const handleClick = () =>{

  const clientId = "220edbc347214a93ad372a3035a0aee8";
  const clientSecret = "a326eee392bf475a8df9643fa7b4443b";
  const responseType = "token&show_dialog=true";
  const redirectUrl = "http://localhost:3000";
  const endpoint = "https://accounts.spotify.com/authorize";
  const scope = [
    "user-read-email",
    "streaming",
    "user-read-private",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-read-playback-position",
    "user-top-read"
  ];

  window.location.href = `${endpoint}?client_id=${clientId}&redirect_uri=${redirectUrl}&scope=${scope.join(" ")}&response_type=${responseType}`;
  }

  const [searchKey, setSearchKey] = useState("")

  
  const [{ token }, dispatch] = useStateProvider()
  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      const token = hash.substring(1).split("&")[0].split("=")[1];
      dispatch({ type:reducerCases.SET_TOKEN, token})
    }
  }, [token, dispatch]);


  async function userinfo() {

    const userParameters ={
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };
      const userReturnedInfo = await fetch("http GET https://api.spotify.com/v1/me", userParameters)
        .then(response => response.json())
        .then(data => console.log(data))
        
  
   }
  
  
    async function searchSongs(e) {
      e.preventDefault();
      const parameters = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
        
      };
    
      const data = await fetch("https://api.spotify.com/v1/search?q=" + searchKey + '&type=track', parameters)
        .then(response => response.json());
        
      const itemsArray = data.tracks.items.slice(0, 10); // Extract items 1-10 from the 'tracks' object
      displayItems(itemsArray); // Call the function to display the items
    }
    
    function displayItems(itemsArray) {
      const searchResults = document.querySelector(".searchResults");
      searchResults.innerHTML = ""; // Clear previous search results
    
      for (const item of itemsArray) {
        const albumImage = item.album.images[0].url;
        const artistName = item.artists[0].name;
        const trackName = item.name;
    
        // Create HTML elements to display the information
        const resultItem = document.createElement("div");
        resultItem.classList.add("resultItem");
    
        const albumImageElement = document.createElement("img");
        albumImageElement.src = albumImage;
    
        const artistNameElement = document.createElement("p");
        artistNameElement.textContent = artistName;
    
        const trackNameElement = document.createElement("p");
        trackNameElement.textContent = trackName;
  
        const addToPlaylistElement = document.createElement("a");
        trackNameElement.textContent = trackName;
    
        // Append the elements to the resultItem element
        resultItem.appendChild(albumImageElement);
        resultItem.appendChild(artistNameElement);
        resultItem.appendChild(trackNameElement);
        
    
        // Append the resultItem to the searchResults element
        searchResults.appendChild(resultItem);
      }
    }

    useEffect(() => {
      const newPlaylist = document.getElementById('newPlaylist');
      const currentPlaylist = document.getElementById('currentPlaylists');
      const addedTracksToPlaylist = document.getElementById('addedTracksToPlaylist');
      const listOfCurrentPlaylists = document.getElementById('listOfCurrentPlaylists');
  
      // Add event listeners to the links
      currentPlaylist.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the link from navigating
        listOfCurrentPlaylists.style.display = 'block';
        addedTracksToPlaylist.style.display = 'none';

        
      });
  
      newPlaylist.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the link from navigating

        addedTracksToPlaylist.style.display = 'block';
        listOfCurrentPlaylists.style.display = 'none';
        
      });
    }, []);
  
  return (
    <>
  
    <div className="app">
      <h1>Jammming</h1>
     {console.log(userinfo())}
      <div className="spotifyButton">
      {!token ? (
        <a onClick={handleClick}>Login Spotify</a>
        ) : (
          <button href="#" >
            Logout
          </button>
        )} 
      </div>

      <div className="main">
        <div className='leftContainer'>
          Search Your Songs
          
          {token ?
        <>
          <form onSubmit={searchSongs}>
            <input type="text" onChange={e=> setSearchKey(e.target.value)}/>
            <button id={"searchButton"} type={"submit"} >Search</button>
          </form> 
          <div className={"resultHeader"}>
        <div className={"albumHeader"}>Album</div>
        <div className={"artistHeader"}>Artist</div>
        <div className={"songHeader"}>Song Title</div>
        <div className={"playlistHeader"}>Add to Playlist</div>
        </div> 
          </>
          : 
          <h2>Please Login</h2>
       
        }
      <div className={"searchResults"}>
        
        </div>
          
          
        </div>    

        <div className='rightContainer'>
        <div className='newTitle'>
          <a href="#" id="newPlaylist">New Playlist</a>
          </div>
        <div id='addedTracksToPlaylist'>
          <h2>Hello World</h2>
        </div>
        <div className='currentTitle'>
        <a href="#" id="currentPlaylists">Your Playlists</a>
        </div>
        <div id='listOfCurrentPlaylists'>
          <Playlists />
        </div>
        </div>
      </div>
      
    </div>
    <div className="playerFooter"> </div>
</>
  );
}




export default App;
