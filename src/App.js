import "./App.css";
import Navbar from "./component/Navbar/Navbar";

import React from 'react'
import Home from "./component/Home/Home";

const App = () => {
  return (
	<div className="App">
		<Navbar />  
		<Home />
		
	</div>
  )
}

export default App