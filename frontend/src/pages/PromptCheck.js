import { useLocation } from "react-router";
import MainNav from "../components/MainNav";
import { useNavigate } from 'react-router';
import React, { useState } from 'react';

const PromptCheck = () =>{
    let location = useLocation();
    const name = location.state?.name;
    const prompt = location.state?.checkItems;
    const navigate = useNavigate();
    const onClickResult = () =>{
    navigate("/result?name=" + name + "?prompt="+ prompt, {state: { name, prompt }});
  }
  const onClickAdv = () =>{
    navigate("/adv?name=" + name + "?prompt="+ prompt, {state: { name, prompt }});
  }
return(
    <div><MainNav/>
<div className='container' style={{paddingTop: "100px", paddingBottom: "200px"}}>
<div className="nametext" >{name}</div>
<div className="QuestionT2">{prompt.join(", ")}</div>
<div className="QuestionT2">확인</div>
<div className="modebuttonbox">
    <div onClick={onClickResult} className="modebutton" style={{marginRight:"auto"}}>
    <div className="buttonText">
      <div className="buttonT1">making logo</div>
      <div className="buttonT2">로고를 생성할래요!</div>
      </div>
      </div>
  <div onClick={onClickAdv} className="modebutton" style={{marginLeft:"auto"}}>
    <div className="buttonText">
    <div className="buttonT1">typing mode</div>
      <div className="buttonT2">직접 더 수정하고 싶어요!</div>
      </div>
      </div>
</div>
</div>
</div>
);
}
export default PromptCheck;