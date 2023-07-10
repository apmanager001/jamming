import './App.css';
import React, {useEffect, useState} from "react";

function App() {
  const clientId = "220edbc347214a93ad372a3035a0aee8";
  const responseType = "token";
  const redirectUri = "http://localhost:3000";
  const endpoint = "https://accounts.spotify.com/authorize";
  const scope = "scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";
  const scope2 = "scope=streaming%20playlist-read-private%20playlist-modify-private%20user-read-playback-state%20user-modify-playback-state"

  const Auth_URL = `${endpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&${scope2}`;
  const fullUrl = "https://accounts.spotify.com/authorize?client_id=220edbc347214a93ad372a3035a0aee8&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";
  
  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("")
  const [tracks, setTracks] = useState([])

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];
      window.location.hash = "";
      window.localStorage.setItem("token", token);
      
    }
    setToken(token);
  }, []);

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
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
  
    
  
  return (
    <>
    <div className="app">
      <h1>Jammming</h1>
      <div className="spotifyButton">
      {!token ? (
        <a href={Auth_URL} >Login Spotify</a>
        ) : (
          <button href="#" onClick={logout}>
            Logout
          </button>
        )} 
      </div>

      <div className="main">
        <div className='leftContainer'>
          Search Your Songs
          
        {token ?
          <form onSubmit={searchSongs}>
            <input type="text" onChange={e=> setSearchKey(e.target.value)}/>
            <button id={"searchButton"} type={"submit"} >Search</button>
          </form> : 
          <h2>Please Login</h2>
        }
        <div className={"resultHeader"}>
        <div className={"albumHeader"}>Album</div>
        <div className={"artistHeader"}>Artist</div>
        <div className={"songHeader"}>Song Title</div>
        <div className={"playlistHeader"}>Add to Playlist</div>
        </div>
      <div className={"searchResults"}>
        
        </div>
          
          
        </div>    

        <div className='rightContainer'>
          Songs You Chose <br />For Your Playlist

        </div>
      </div>
      
    </div>
    <div className="playerFooter"> </div>
</>
  );
}
export default App;
