import React, { Component } from 'react';
import { Route, Routes, Link } from "react-router-dom";
import '../App.css';
import './MainNav.css';

const MainNav = () => {
    return(
          <nav className="navbar" style={{height: 60}}>
            <div className="container ">
              <div className="container_inner navbar_inner-container">
                <div className='navbar_logo-container' >
                  <Link 
                    to="/"
                    className='title'>Logoin</Link>
                </div>
                <div className="navbar_content" aria-expanded="false" aria-hidden="true">
                  
                  <ul className="navbar_menu">
                    <li className="navbar_item">
                      <Link to="/about" >About</Link>
                    </li>
                    <li className="navbar_item">
                      <Link to="/howto" >How To</Link>
                    </li>
                    <li className="navbar_item">
                      <Link to="/devs" >Devs</Link>
                    </li>
                    <li className="navbar_item">
                      <a href="https://www.naver.com/"
                      target="_blank" >구글폼</a>
                    </li>
                  </ul>
                  <ul>
                  <li className="navbar_item">
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