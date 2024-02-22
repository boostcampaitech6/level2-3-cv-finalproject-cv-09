import React, { Component } from 'react';
import { Route, Routes, Link } from "react-router-dom";
import '../App.css';
import './MainNav.css';

const MainNav = () => {
    return(
          <nav class="navbar" style={{height: 60}}>
            <div class="container ">
              <div class="container_inner navbar_inner-container">
                <div class='navbar_logo-container' >
                  <Link 
                    to="/"
                    class='title'>Logoin</Link>
                </div>
                <div class="navbar_content" aria-expanded="false" aria-hidden="true">
                  
                  <ul class="navbar_menu">
                    <li class="navbar_item">
                      <Link to="/about" >About</Link>
                    </li>
                    <li class="navbar_item">
                      <Link to="/howto" >How To</Link>
                    </li>
                    <li class="navbar_item">
                      <Link to="/devs" >Devs</Link>
                    </li>
                  </ul>
                  <ul>
                  <li class="navbar_item">
                      <Link >Logoin</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </nav>
    );
  }

export default MainNav;