import React, { Component } from 'react';
import { Route, Routes, Link } from "react-router-dom";
import { ReactComponent as Cookie } from './assets/login.svg';
import '../App.css';
import './MainNav.css';

const MainNav = () => {
    return(
          <nav className="navbar">
            <div className="container">
              <div className="container_inner navbar_inner-container">
                  <Link 
                    to="/"
                    className='title'>K-Logo Gen</Link>
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
                      target="_blank" >Survey</a>
                    </li>
                  </ul>
                  <ul className="navbar_login">
                    <li className="login_item">
                        <Link ><Cookie width="35" height="35" /></Link>
                    </li>
                  </ul>
                  {/* <ul className="navbar_hide_menu">
                    <li className="menu_item">
                        <Link ><Cookie width="35" height="35" /></Link>
                    </li>
                  </ul> */}
                </div>
              </div>
            </div>
          </nav>
    );
  }

export default MainNav;