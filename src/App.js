import './App.css';
import React, {useEffect, useState} from "react";
import { useStateProvider } from './stateProvider'
import axios from 'axios';
import {reducerCases} from "./reducerCases"
import Playlists from './Playlists'
import SelectedPlaylist from './playlistSelected'

import NewPlaylist from './newPlaylist';



function App() {
  const redirectUrl = "https://jammming12.netlify.app";
  const [selectedSongIds, setSelectedSongIds] = useState([]);
  const handleClick = () =>{
  
  const clientId = "220edbc347214a93ad372a3035a0aee8";
  const responseType = "token&show_dialog=true";
  
  const endpoint = "https://accounts.spotify.com/authorize";
  const scope = [
    "user-read-email",
    "streaming",
    "user-read-private",
    "user-read-playback-state",
    "playlist-modify-public",
    "playlist-modify-private",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-read-playback-position",
    "user-top-read",
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

    const Logout = () => {
      window.location.href = redirectUrl;
    };

  
  
  
    async function searchSongs(e) {
      e.preventDefault();
      const parameters = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
        
      };
      if (searchKey === ""){
          alert('Please Type something in the Search Box')
      } else {
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
        const songId = item.id
    
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

        

        function handleButtonClick() {
          if (!selectedSongIds.includes(songId)) {
            setSelectedSongIds((prevIds) => [...prevIds, songId]); // Update selectedSongIds using the setter function
          } else {
            setSelectedSongIds((prevIds) => prevIds.filter((id) => id !== songId)); // Update selectedSongIds to remove the songId
          }
          
        }
        
        // Add a click event listener to the button element
        songIdElement.addEventListener("click", handleButtonClick);
    
        // Append the elements to the resultItem element
        resultItem.appendChild(albumImageElement);
        resultItem.appendChild(artistNameElement);
        resultItem.appendChild(trackNameElement);
        resultItem.appendChild(songIdElement);
        
    
        // Append the resultItem to the searchResults element
        searchResults.appendChild(resultItem);
      }}
    }

    useEffect(() => {
      const newPlaylist = document.getElementById('newPlaylist');
      const currentPlaylist = document.getElementById('currentPlaylists');
      const addedTracksToPlaylist = document.getElementById('addedTracksToPlaylist');
      const listOfCurrentPlaylists = document.getElementById('listOfCurrentPlaylists');
      const playlistSongs = document.getElementById('currentPlaylistSongs');
      const playlistSongs2 = document.getElementById('listOfPlaylistSongs');
  
      // Add event listeners to the links
     
  
      newPlaylist.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the link from navigating

        addedTracksToPlaylist.style.display = 'block';
        listOfCurrentPlaylists.style.display = 'none';
        playlistSongs2.style.display = 'none';
      });

      currentPlaylist.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the link from navigating
        listOfCurrentPlaylists.style.display = 'block';
        addedTracksToPlaylist.style.display = 'none';
        playlistSongs2.style.display = 'none';
        
      });

      playlistSongs.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the link from navigating
        listOfCurrentPlaylists.style.display = 'none';
        addedTracksToPlaylist.style.display = 'none';
        playlistSongs2.style.display = 'block';
        
      });


    }, []);
  



    useEffect(() => {
      const getUserInfo =async ()=>{
        try {
        const {data} = await axios.get('https://api.spotify.com/v1/me', {
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
      })  
      const userInfo = {
        userId: data.id,
        userName: data.display,
        displayName:data.display_name
      }

      dispatch({type:reducerCases.SET_USER, userInfo})
    }  catch (error){
      console.log(error)
  }
      }
      getUserInfo()
    }, [dispatch, token])



    const [{userInfo}] = useStateProvider();
  return (
    <>
  
    <div className="app">
      <h1>Jammming</h1>
      <div className="spotifyButton">
      {!token ? (
        <a onClick={handleClick}>Login Spotify</a>
        ) : (
          <>
          
          <span>{userInfo?.displayName}</span>
          <button href="#" onClick={Logout}>
            Logout
          </button>
          </>
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
        <div className='rightContainerBackground'>
        <div className='rightContainer'>
          <div className='newTitle'>
            <a href="#" id="newPlaylist">New Playlist</a>
          </div>
       
          <div className='currentTitle'>
            <a href="#" id="currentPlaylists">Your Playlists</a>
          </div>
          <div className='currentSongs'>
            <a href="#" id="currentPlaylistSongs">Your Playlist Songs</a>
          </div>

        </div>

          <div id='addedTracksToPlaylist'>
            <NewPlaylist selectedSongIds={selectedSongIds} userInfo={userInfo}/>
          </div>
          <div id='listOfCurrentPlaylists'>
            <h4>Check "Your Playlist Songs" above after you <br/>click the playlist name below</h4>
            <Playlists />
          </div>
          <div id='listOfPlaylistSongs'>
            <SelectedPlaylist />
          </div>
        
        </div>

      </div>
      
    </div>
    
</>
  );
}




export default App;
