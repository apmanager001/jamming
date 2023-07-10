import React, { useState } from "react";
import Login from "./Login";
import SearchSongTitle from "./songTitleSearch";

function Update() {
  const [token, setToken] = useState(""); // Shared state

  const handleTokenUpdate = (newToken) => {
    setToken(newToken);
  };

  return (
    <div>
      <Login onTokenUpdate={handleTokenUpdate} />
      <SearchSongTitle token={token} />
    </div>
  );
}

export default Update;
