import React, { Component } from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import './Footer.css';
import '../App.css';

const Footer = () => {
      return(
        <footer className="footer bg-white">
          <div className='container'>
            <div className='footer_layout'> 
              <div className='team'>SCV</div> 
                <div className="RightsReserved">Copyright © 2024 SCV | All Rights Reserved</div>
                  <a 
                    className="RightsReserved"
                    href='https://github.com/boostcampaitech6/level2-3-cv-finalproject-cv-09'
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{textDecoration:"none", display:"flex"}}
                    >
                    <GitHubIcon style={{height:'1rem'}}></GitHubIcon>
                    <div >
                    Github
                    </div>
                    </a>
              </div>
            </div>
        </footer>
        );
    }
        
export default Footer;