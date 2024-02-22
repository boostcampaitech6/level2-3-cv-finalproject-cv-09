import './App.css';
import Home from './pages/Home';
import About from './pages/About';
import HowTo from './pages/HowTo';
import Devs from './pages/Devs';
import Making from './pages/Making';
import Footer from "./components/Footer";
//import axios from 'axios';
//import { useState } from 'react';
import { BrowserRouter, Router, Route, Routes } from 'react-router-dom';


const App = ()=> {
  return (
    <div className="App">
      <BrowserRouter>
          <Routes>
            <Route path='/' element ={<Home/>}/>
            <Route path='/about' element ={<About/>}/>
            <Route path='/howto' element ={<HowTo/>}/>
            <Route path='/devs' element ={<Devs/>}/>
            <Route path='/making' element ={<Making/>}/>
          </Routes>
          <Footer/>
          </BrowserRouter>
    </div>
    );
}

export default App;
