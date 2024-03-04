import { useLocation } from "react-router";
import MainNav from "../components/MainNav";
import { useNavigate } from 'react-router';
import React, { useState } from 'react';
import './ModeSelect.css';

const ModeSelect = () =>{
    let location = useLocation();
    const name = location.state?.content;
    const navigate = useNavigate();
    const onClickMaking = () =>{
    navigate("/making?name=" + name, {state: { name }});
  }
  const onClickAdv = () =>{
    navigate("/adv?name=" + name, {state: { name }});
  }
return(
    <div><MainNav/>
<div className='container' style={{paddingTop: "100px", paddingBottom: "200px"}}>
<div className="QuestionT1">{name}(이)라는 로고를 만들게요.</div>
<div className="QuestionT2">원하시는 생성 방식을 선택해주세요.</div>
<div >
  <ul className="button_list">
  <li className="li">
    <div onClick={onClickMaking} className="modebutton" >
    <div className="buttonText">
      <div className="buttonT1">select mode</div>
      <div className="buttonT2">주관식</div>
      </div>
      </div>
    </li>
  <li className="li">
  <div onClick={onClickAdv} className="modebutton" >
    <div className="buttonText">
    <div className="buttonT1">typing mode</div>
      <div className="buttonT2">객관식</div>
      </div>
      </div>
  </li>
  </ul>
</div>
</div>
</div>
);
}
export default ModeSelect;