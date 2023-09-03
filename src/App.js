import React, {useState, useEffect} from 'react';

import './App.css';
import SearchBar from './SearchBar.js';
import refreshAccessToken from './Refresh.js';


function App() {

  const [tokenNow, setTokenNow] = useState("")
  
  useEffect(() => {
    const refreshTokenAndSetState = async () => {
      try {
        const result = await refreshAccessToken();
        setTokenNow(result);
        console.log(`The New token is: ${result}`);
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    };

    refreshTokenAndSetState();

    const intervalId = setInterval(refreshTokenAndSetState, 3500000);

    return () => clearInterval(intervalId);

  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <SearchBar message={tokenNow}/>
        
      </header>
    </div>
  );
}

export default App;
