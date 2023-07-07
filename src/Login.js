import React from "react"





function Login() {
const Auth_URL ="https://accounts.spotify.com/authorize?client_id=220edbc347214a93ad372a3035a0aee8&response_type=code&redirect_uri=https://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"

    return (
        <a href={Auth_URL}>Login Here</a>   
    )


}



export default Login;