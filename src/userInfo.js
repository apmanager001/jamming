import React, {useEffect} from "react";




async function getUserInfo() {
    const parameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };
  
    const userInfo = await fetch("https://api.spotify.com/v1/me", parameters)
      .then(response => response.json());
  
    const userId = userInfo.id;
    console.log("User ID:", userId); // Display the user ID in the console or update the UI with the user ID
 
  
  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");
  
    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];
      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }
  
    setToken(token);
  
    if (token) {
      getUserInfo(); // Call the function to fetch and display the user ID
    }
  }, []);
 }
  <div className="app">
  ...
  <div className="user-info" id="user-info"></div>
  ...
</div>

export default getUserInfo;