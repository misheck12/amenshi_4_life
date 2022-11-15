import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";
import Navbar from "./component/Navbar/Navbar";
import Home from "./component/Home/Home";
import Footer from "./component/Footer/Footer";
import Services from "./component/Services/Services";
import About from "./component/About/About";
import Projects from "./component/Projects/Projects";
import Contact from './component/Contact/Contact';
import Gallery from './component/Gallery/Gallery';


const App = () => {
  return (
	<div className="App">
		<Router>
		<Navbar />  
			<Routes>
				<Route exact path="/" element={<Home />} />
				<Route exact path="/services" element={<Services />} />
				<Route exact path="/about" element={<About />} />
				<Route exact path="/projects" element={<Projects />} />
				<Route exact path="/contact" element={<Contact />} />
				<Route exact path="/gallery" element={<Gallery />} />
			</Routes>
		</Router>
		<Footer />
		
	</div>
  )
}

export default App