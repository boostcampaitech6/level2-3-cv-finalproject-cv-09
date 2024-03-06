import React, { forwardRef } from 'react';
import { Link } from "react-router-dom";
import '../App.css';
import './MakingNav.css'

const MakingNav = ({props, handleScrollView, prompt}) => {
    return(
          <div className="sidebar">
                <div >
                  <Link 
                    to="/"
                    className='navtitle'>K-Logo Gen</Link>
                </div>
                <div className='margin'></div>
                <div >
                  <ul className="navbutton_list">
                    <li >
                      <button id="Question01" onClick={handleScrollView} className="navbutton" >1</button>
                    </li>
                    <div className='margin'>{prompt}</div>
                    <li >
                      <button id="Question02" onClick={handleScrollView} className="navbutton" >2</button>
                    </li>
                    <div className='margin'>{prompt}</div>
                    <li >
                      <button id="Question03" onClick={handleScrollView} className="navbutton" >3</button>
                    </li>
                    <div className='margin'>{prompt}</div>
                    <li >
                      <button id="Question04" onClick={handleScrollView} className="navbutton" >4</button>
                    </li>
                  </ul>
                  <div>{prompt}</div>
                  </div>
          </div>
    );
  }

export default MakingNav;