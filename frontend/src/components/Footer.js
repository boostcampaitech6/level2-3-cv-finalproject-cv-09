import React, { Component } from 'react';
import './Footer.css';
import '../App.css';

const Footer = () => {
      return(
        <footer className="footer bg-white">
          <div className='container'>
            <div className='footer_layout'> 
              <div className='team'>SCV</div> 
              {/* <div className="navbar_content" aria-expanded="false" aria-hidden="true"> */}
                <div></div>
                <div className="RightsReserved">Copyright © 2024 SCV | All Rights Reserved</div>
                {/* <div> */}
                  <a 
                    className="RightsReserved"
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
                {/* </div> */}
              {/* </div> */}
            </div>
            </div>
        </footer>
        );
    }
        
export default Footer;