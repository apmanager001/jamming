import React, { useEffect } from 'react'
import { useStateProvider } from './stateProvider'
import { reducerCases } from './reducerCases';
import axios from "axios";
import "./footer.css"

export default function Playlists() {
     const [{token, playlists}, dispatch] = useStateProvider()
    useEffect(()=> {
        const getPlaylistData = async () => {
            try {
            const response = await axios({
            method:"get",
            url:'https://api.spotify.com/v1/me/playlists', 
            headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
            })
      
            const {items} = response.data
            const playlists = items.map(({name, id}) => {
                return {name, id}
            })
            dispatch({type:reducerCases.SET_PLAYLISTS, playlists})
        
        }  catch (error){
            console.log(error)
        }
       }
        getPlaylistData();
    },[token, dispatch])

    const changeCurrentPlaylist = (selectedPlaylistId) => {
        dispatch({type: reducerCases.SET_PLAYLIST_ID, selectedPlaylistId})
    }

    return <div className='playList'>

        <ul>
            {
                playlists.map(({name, id})=>{
                    return (
                        <li key={id} onClick={()=>changeCurrentPlaylist(id)}>{name}</li>
                    )
                })
            }
        </ul>
        
        
    </div>


}