import React, { forwardRef } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import '../App.css';
import './MakingNav.css';


const MakingNav = ({name, prompt}) => {
  const navigate = useNavigate();
  const onClickArea = () =>{
    navigate("/making/area?name=" + name, {state: { name }});
  }
  const onClickPurpose = () =>{
    navigate("/making/purpose?name=" + name, {state: { name }});
  }
  const onClickColor = () =>{
    navigate("/making/color?name=" + name, {state: { name }});
  }
  const onClickStyle = () =>{
    navigate("/making/style?name=" + name, {state: { name }});
  }
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
                      <button id="Question01" onClick={onClickArea} className="navbutton" >분야</button>
                    </li>
                    <div className='margin'>{prompt}</div>
                    <li >
                      <button id="Question02" onClick={onClickPurpose} className="navbutton" >목적</button>
                    </li>
                    <div className='margin'>{prompt}</div>
                    <li >
                      <button id="Question03" onClick={onClickColor} className="navbutton" >색상</button>
                    </li>
                    <div className='margin'>{prompt}</div>
                    <li >
                      <button id="Question04" onClick={onClickStyle} className="navbutton" >스타일</button>
                    </li>
                  </ul>
                  <div>{prompt}</div>
                  </div>
          </div>
    );
  }

export default MakingNav;