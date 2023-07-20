import React, { useEffect } from 'react'
import { useStateProvider } from './stateProvider'
import { reducerCases } from './reducerCases';
import axios from "axios";

export default function Playlists() {
     const [{token, playlists}, dispatch] = useStateProvider()
    useEffect(()=> {
        const getPlaylistData = async () => {
            try {
            const response = await axios.get('https://api.spotify.com/v1/me/playlists', 
            {
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


    return <div>
        <ul>
            {
                playlists.map(({name, id})=>{
                    return (
                        <ul key={id}>{name}</ul>
                    )
                })
            }
        </ul>
    </div>


}