import React, { Component } from 'react';
import { Link } from "react-router-dom";
import '../App.css';
import './MakingNav.css'

const MakingNav = () => {
    return(
          <div class="sidebar">
                <div >
                  <Link 
                    to="/"
                    class='navtitle'>Logoin</Link>
                </div>
                <div >
                  <ul class="navbutton_list">
                    <li >
                      <button class="navbutton" >About</button>
                    </li>
                    <li >
                      <button class="navbutton" >How To</button>
                    </li>
                    <li >
                      <button class="navbutton" >Devs</button>
                    </li>
                  </ul>
                  </div>
          </div>
    );
  }

export default MakingNav;