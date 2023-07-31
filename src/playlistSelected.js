import axios from 'axios';
import React, { useEffect } from 'react';
import { useStateProvider } from './stateProvider';
import { reducerCases } from './reducerCases';
import './playlist.css'

export default function SelectedPlaylist() {
  const [{ token, selectedPlaylistId, selectedPlaylist }, dispatch] = useStateProvider();
  

  useEffect(() => {
    const getInitialPlaylist = async () => {
      try {
        const response = await axios({
          method:'get',
          url:`https://api.spotify.com/v1/playlists/${selectedPlaylistId}`,
          headers: {'Authorization': `Bearer ${token}`,'Content-Type': 'application/json'},
            
            }
        );
        const selectedPlaylist = {
          id: response.data.id,
          name: response.data.name,
          description: response.data.description.startsWith("<a") ? "" : response.data.description,
          image: response.data.images[0].url,
          tracks: response.data.tracks.items.map(({ track }) => ({
            id: track.id,
            name: track.name,
            artists: track.artists.map((artist) => artist.name),
            image: track.album.images[2].url,
            duration: track.duration_ms,
            albumn: track.album.name,
            context_uri: track.album.uri,
            track_number: track.track_number,
          }))
        };

        dispatch({ type: reducerCases.SET_PLAYLIST, selectedPlaylist });
      } catch (error) {
        console.log(error);
      }
    };
    if(token){
    getInitialPlaylist(); 
    }
  }, [dispatch, token, selectedPlaylistId]);


  return (
    <>
    { selectedPlaylist && (
      <>
      <div className="playlist">
        <div className="imagePlaylist">
          <img src={selectedPlaylist.image} alt="selectedplaylist"/>
        </div>
      <div className='details'>
        <span className='type'>PLAYLIST</span>
        <h1 className='title'>{selectedPlaylist.name}</h1>
        <p className='description'>{selectedPlaylist.description}</p>
      </div>
      <div className='list'>
        <div className='header_row'>
          <div className='col'>
            <span>ALBUM</span>
          </div>
          <div className='col'>
            <span>#</span>
          </div>
          <div className='col'>
            <span>ARTIST</span>
          </div>
          <div className='col'>
            <span>TITLE</span>
          </div>
        </div>
      <div className='tracks'>
        <>
        {
          selectedPlaylist.tracks.map(
            ( 
              { id, 
                name, 
                artists, 
                image, 
                duration, 
                album, 
                context_uri, 
                track_number 
              }, index 
              ) => {
          return (
            
            <div className='row' key={id}>
              
              <div className='col'>
                <div className='image'>
                <img src={image} alt="track" />
                <span>{album}</span>
                </div>
              </div> 
              <div className='col'>
                <span>{index+1}</span>
              </div>
              
              <div className='col'>
              <span>{artists}</span>
              </div>
              <div className='col'>
               <span className='name'>{name}</span>
              </div>
             
                
                

            </div>
            
          )
        })}
      </>
      </div>

      </div>
      </div>
      
      
    </>

    )
    }
  </>
  )
}
