import './App.css';
import SearchSongTitle from "./songTitleSearch"
import Login from "./Login.js"

function App() {
  return (
    <div className="app">
      <h1>Jammming</h1>
      <div className="spotifyButton">
        
        <Login />   
      </div>
    
      <div className="main">
        <div className='leftContainer'>
          Search Your Songs
          <br />
          <SearchSongTitle />

      
        </div>    

        <div className='rightContainer'>
          Songs You Chose For Your Playlist
        </div>
      </div>
    
    </div>
  );
}

export default App;
