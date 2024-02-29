import React, { Component } from 'react';
//import { Link } from "react-router-dom";
import './Footer.css';
import '../App.css';

const Footer = () => {
      return(
        <footer class="footer bg-white">
          <div class='container'>
            <div style={{display:"flex" }}> 
              <div style={{fontSize:"150%" }}>SCV</div> 
              <div class="navbar_content" aria-expanded="false" aria-hidden="true">
                <div></div>
                <div class="RightsReserved">Copyright © 2024 SCV | All Rights Reserved</div>
                <div>
                  <div></div>
                  <a 
                    class="RightsReserved"
                    href='https://github.com/boostcampaitech6/level2-3-cv-finalproject-cv-09'
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{textDecoration:"none", display:"flex"}}
                    >
                      <img src={process.env.PUBLIC_URL+"./github-mark.svg"}
                      style={{height:"1rem", paddingRight:"5px"}}></img>
                    <div >
                    Github
                    </div>
                    </a>
                </div>
              </div>
            </div>
            </div>
        </footer>
        );
    }
        
export default Footer;