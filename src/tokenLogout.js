import {useState, useEffect} from "react"

const clientId = "220edbc347214a93ad372a3035a0aee8";
  const clientSecret = "a326eee392bf475a8df9643fa7b4443b";
  const responseType = "token";
  const redirectUri = "http://localhost:3000";
  const endpoint = "https://accounts.spotify.com/authorize";
  const scope = "scope=streaming%20user-read-email%20user-read-private%20user-read-email%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";
  const scope2 = "scope=streaming%20playlist-read-private%20user-read-email%20playlist-modify-private%20user-read-playback-state%20user-modify-playback-state"

  const Auth_URL = `${endpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&${scope2}`;
  const fullUrl = "https://accounts.spotify.com/authorize?client_id=220edbc347214a93ad372a3035a0aee8&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";


  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("")

  useEffect(() => {
    const tokenParameters ={
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + clientId + '&client_secret' + clientSecret
    };
    fetch(Auth_URL)
      .then(result => result.json())
      .then(data => console.log(data))
  }, []);

  const Logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  
  };


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