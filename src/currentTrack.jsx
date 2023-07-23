import "./footer.css"
import React, {useEffect}from "react";
import { useStateProvider } from "./stateProvider";
import {reducerCases} from "./reducerCases"
import axios from "axios";


export default function CurrentTrack () {
    const [{ token, currentlyPlaying}, dispatch] = useStateProvider();
    useEffect(()=> {
        const getCurrentTrack = async () => {
            try {
            const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', 
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
            })
            if(response.data !== "") {
                const {item} = response.data
                const currentlyPlaying = {
                    id: item.id,
                    name: item.name,
                    artists: item.artists.map((artist) => artist.name),
                    image:item.album.images[2].url
                }
           dispatch({type:reducerCases.SET_PLAYING, currentlyPlaying})
            }
        }  catch (error){
            console.log(error)
        }
       }
        getCurrentTrack();
    },[token, dispatch])

    return (
        <>
        {currentlyPlaying && (
          
            <div className="track">
                <div className="track_image">
                    <img src={currentlyPlaying.image} alt="currentlyPlaying" />
                </div>
                <div className="trackInfo">
                    <h4>{currentlyPlaying.name}</h4>
                    <h6>{currentlyPlaying.artists.join(", ")}</h6>
                </div>


            </div>
        )}
    </>
    )
}